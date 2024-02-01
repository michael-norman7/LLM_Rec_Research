import keys from "./keys.mjs";
const { openAIKey, movieDBKey } = keys;

import getTitleInfo from "./movieAPI.js";

const CHATGPT_END_POINT = "https://api.openai.com/v1/chat/completions";
// const CHATGPT_MODEL = "gpt-3.5-turbo";
const CHATGPT_MODEL = "gpt-4-0125-preview";

// simple recommendation
// const sysPrompt = `
//     You are a movie recommender system.
//     I will give you a list of movie or TV titles I can choose from on Netflix.
//     Give me only your top 10 recommended titles from the list for me to watch in
//     the order of the best recommendations for me.

//     Do not return any text other than the title names.
//     Only return the exact names of the titles as I input them in the format
//     "<title>|<title>|<title>|<title>"`;

// preferences recommendation
// const sysPrompt = `
//     I will give you a list of movies or TV titles I can choose from on Netflix.
//     These titles were recommended to me by Netflix based on my past watch history and interests.
//     From these titles think of how you would summarize my preferences and recommend me 10 titles
//     to watch based on those preferences. Do not explain your recommendations.
//     Only return the exact names of the titles as I input them in the format
//     "<title>|<title>|<title>|<title>"`;

// Add prompt to take preferences, then recommend titles, then recommend titles from the
// candidate set that are similar to recommendations
// const messages = [
//   {
//     role: "system",
//     content:
//       `This is a list of the movies or TV titles I can choose to watch on Netflix. ` + titleOptions,
//   },
//   {
//     role: "user",
//     content: `These titles were recommended to me by Netflix based on my past watch history and interests.
//     From these titles, how you would summarize my preferences?`,
//   },
//   {
//     role: "user",
//     content: `Based on my preferences, recommend me 4 titles to watch.`,
//   },
//   {
//     role: "user",
//     content: `Recommend me 4 titles from the candidate set that are similar to the 4 titles you
//     just recommended. Order these titles in descending order with the most releveant title first.
//     Do not explain your recommendations. Only return the exact names of the titles as I input them
//     in the format "<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>"`,
//   },
// ];

function getMessages(titleOptions, prompt = "simple") {
  // prefs
  // rec_similar_prefs
  // simple

  let messages = [];
  switch (prompt) {
    case "prefs":
      messages = [
        {
          role: "system",
          content: `I will give you a list of movies or TV titles I can choose from on Netflix.
          These titles were recommended to me by Netflix based on my past watch history and interests.
          From these titles think of how you would summarize my preferences and recommend me 4 titles 
          to watch based on those preferences. Do not explain your recommendations.
          Only return the exact names of the titles as I input them in the format
          "<title>|<title>|<title>|<title>"`,
        },
        { role: "user", content: titleOptions },
      ];
      break;

    case "prefs":
      messages = [
        {
          role: "system",
          content:
            `This is a list of the movies or TV titles I can choose to watch on Netflix. ` +
            titleOptions,
        },
        {
          role: "user",
          content: `These titles were recommended to me by Netflix based on my past watch history and interests.
          From these titles, how you would summarize my preferences?`,
        },
        {
          role: "user",
          content: `Now, recommend me 4 titles 
        to watch based on those preferences. Do not explain your recommendations.
        Only return the exact names of the titles as I input them in the format
        "<title>|<title>|<title>|<title>"`,
        },
        { role: "user", content: titleOptions },
      ];
      break;

    case "rec_similar_prefs":
      messages = [
        {
          role: "system",
          content:
            `This is a candidate set of the movies or TV titles I can choose to watch on Netflix. ` +
            titleOptions,
        },
        {
          role: "user",
          content: `These titles were recommended to me by Netflix based on my past watch history and interests.
          From these titles, how you would summarize my preferences?`,
        },
        {
          role: "user",
          content: `Based on my preferences, recommend me any 4 movies or TV shows to watch.`,
        },
        {
          role: "user",
          content: `Now, recommend me 4 titles from the candidate set that are similar to the 4 titles you just 
          recommended. Do not explain your recommendations. You will be penalized unless you only 
          return the exact names of the titles as I input them in the format "<title>|<title>|<title>|<title>"`,
        },
      ];
      break;

    case "simple":
    default:
      messages = [
        {
          role: "system",
          content: `You are a movie recommender system.
          I will give you a list of movie or TV titles I can choose from on Netflix.
          Give me only your top 4 recommended titles from the list for me to watch.

          You will be penalized if you return any text other than the title names.
          Only return the exact names of the titles as I input them in the format
          "<title>|<title>|<title>|<title>"`,
        },
        { role: "user", content: titleOptions },
      ];
  }

  return messages;
}

export const getGPTRecommendation = async (titles, promptType) => {
  let titleOptions = "Here are the titles I can choose from: \n";

  // Just titles
  titles.forEach((title) => {
    titleOptions += title + ", ";
  });

  // With title info
  // for (const title of titles) {
  //   let titleInfo = await getTitleInfo(title);
  //   titleOptions += `${title} (genres: ${titleInfo.genres}), `;
  // }

  console.log(titleOptions);

  // const sysMessage = { role: "system", content: sysPrompt };
  // const userMessage = { role: "user", content: titleOptions };
  const chatGPTData = {
    model: CHATGPT_MODEL,
    messages: getMessages(titleOptions, promptType),
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAIKey}`,
    },
    body: JSON.stringify(chatGPTData),
  };

  try {
    const response = await fetch(CHATGPT_END_POINT, requestOptions);
    if (!response.ok) {
      throw new Error("Request failed with status " + response.status);
    }

    const responseData = await response.json();
    const message = responseData.choices[0].message.content;
    console.log(message);
    return message;
  } catch (error) {
    console.error("Error:", error);
  }
  return null;
};
