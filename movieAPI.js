import keys from "./keys.mjs";
const { movieDBKey } = keys;

const loadTVGenres = async () => {
  let TVGenres = {};

  const url = "https://api.themoviedb.org/3/genre/tv/list?language=en";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZWRmY2IyNzg1ZmNhM2FiZjI4NGEwOWM1YWU4NDE4ZSIsInN1YiI6IjY1MWJkMzRjNzQ1MDdkMDBmZjk2ZWRiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jcRpXW5mYGoj_ct5zSQzV-bldOSM3LAPJ8Q7WNoBQiU",
    },
  };

  await fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      json["genres"].forEach((item) => {
        TVGenres[item.id] = item.name;
      });
      return TVGenres;
    })
    .catch((err) => console.error("error:" + err));

  return TVGenres;
};

const loadMovieGenres = async () => {
  let movieGenres = {};

  const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZWRmY2IyNzg1ZmNhM2FiZjI4NGEwOWM1YWU4NDE4ZSIsInN1YiI6IjY1MWJkMzRjNzQ1MDdkMDBmZjk2ZWRiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jcRpXW5mYGoj_ct5zSQzV-bldOSM3LAPJ8Q7WNoBQiU",
    },
  };

  await fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      json["genres"].forEach((item) => {
        movieGenres[item.id] = item.name;
      });
    })
    .catch((err) => console.error("error:" + err));

  return movieGenres;
};

const loadTitleInfo = async (title) => {
  let url = "https://api.themoviedb.org/3/search/multi?query=";
  url += title.replace(" ", "%20");
  url += "&include_adult=false&language=en-US&page=1";

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZWRmY2IyNzg1ZmNhM2FiZjI4NGEwOWM1YWU4NDE4ZSIsInN1YiI6IjY1MWJkMzRjNzQ1MDdkMDBmZjk2ZWRiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jcRpXW5mYGoj_ct5zSQzV-bldOSM3LAPJ8Q7WNoBQiU",
    },
  };

  let info = {};

  await fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      // console.log(json);
      // console.log(json["results"][0]["overview"]);
      info = json["results"];
    })
    .catch((err) => console.error("error:" + err));

  return info;
};

const getTitleInfo = async (title) => {
  const TVGenres = await loadTVGenres();
  const movieGenres = await loadMovieGenres();
  const titleInfoRes = await loadTitleInfo(title);

  if (titleInfoRes == {}) {
    return false;
  }

  let currInfo = titleInfoRes[0];
//   console.log(currInfo);

  let titleInfo = {};
  try {
    if (currInfo["media_type"] == "tv") {
      titleInfo["title"] = title;
      titleInfo["media_type"] = currInfo["media_type"];
      titleInfo["overview"] = currInfo["overview"];
      titleInfo["genres"] = currInfo["genre_ids"].map(
        (genre_id) => TVGenres[genre_id]
      );
      titleInfo["popularity"] = currInfo["popularity"];
      titleInfo["release_date"] = currInfo["first_air_date"];
      titleInfo["vote_average"] = currInfo["vote_average"];
      titleInfo["vote_count"] = currInfo["vote_count"];
    } else if (currInfo["media_type"] == "movie") {
      titleInfo["title"] = title;
      titleInfo["media_type"] = currInfo["media_type"];
      titleInfo["overview"] = currInfo["overview"];
      titleInfo["genres"] = currInfo["genre_ids"].map(
        (genre_id) => movieGenres[genre_id]
      );
      titleInfo["popularity"] = currInfo["popularity"];
      titleInfo["release_date"] = currInfo["release_date"];
      titleInfo["vote_average"] = currInfo["vote_average"];
      titleInfo["vote_count"] = currInfo["vote_count"];
    }
  } catch (error) {
    console.log("ERROR: Movie API no response from:", title);
    return false;
  }

  return titleInfo;
};

// console.log(await getTitleInfo("Stranger Things"));
export default getTitleInfo;
