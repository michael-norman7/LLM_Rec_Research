import keys from "./keys.mjs";
const { openAIKey, movieDBKey } = keys;

import getTitleInfo from "./movieAPI.js";

const CHATGPT_END_POINT = "https://api.openai.com/v1/chat/completions";
// const CHATGPT_MODEL = "gpt-3.5-turbo";
const CHATGPT_MODEL = "gpt-4-0125-preview";

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
          content: `Now, recommend me 4 titles to watch based on those preferences.

          You will be penalized if you return any text other than the title names.
          Only return the exact names of the titles as I input them in the format
          "<title>|<title>|<title>|<title>"`,
        },
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
          content: `Now, recommend me 4 titles from the candidate set that are similar 
          to the 4 titles you just recommended.

          You will be penalized if you return any text other than the title names.
          Only return the exact names of the titles as I input them in the format
          "<title>|<title>|<title>|<title>"`,
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
          Recommend me only 4 titles from this list for me to watch.

          You will be penalized if you return any text other than the title names.
          Only return the exact names of the titles as I input them in the format
          "<title>|<title>|<title>|<title>"`,
        },
        { role: "user", content: titleOptions },
      ];
  }

  return messages;
}

export const getGPTRecommendation = async (titles, promptType, gptVersion, api) => {
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
