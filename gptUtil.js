import keys from "./keys.mjs";
const { openAIKey, movieDBKey } = keys;

import getTitleInfo from "./movieAPI.js";

const CHATGPT_END_POINT = "https://api.openai.com/v1/chat/completions";
const CHATGPT_MODEL = "gpt-3.5-turbo";

// const sysPrompt = `
//     You are a movie recommender system that will do it's best to recommend movies to the user
//     based off preferences they give you. You will work in a multi-step process to collect user
//     preferences, determine a user profile including what types of movies you think the user likes,
//     and finally recommend movies to the user to watch.`;

const sysPrompt = `
    I will give you a list of movie or TV titles I can choose from on Netflix.
    Give me only your top 10 recommended titles from the list for me to watch in 
    the order of the best recommendations for me.
    Do not return any text other than the title names.
    Only return the exact names of the titles as I input them in the format
    "<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>"`;

// const sysPrompt = `
//     I will give you a list of movie or TV titles I can choose from on Netflix.
//     These titles were recommended to me by Netflix based on my past watch history and interests.
//     From these titles summarize my preferences briefly and recommend me 10 titles to watch.
//     Do not explain your recommendations.
//     Only return the exact names of the titles as I input them in the format
//     "<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>"`;

export const getGPTRecommendation = async (titles) => {
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

  const sysMessage = { role: "system", content: sysPrompt };
  const userMessage = { role: "user", content: titleOptions };
  const chatGPTData = {
    model: CHATGPT_MODEL,
    messages: [sysMessage, userMessage],
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
