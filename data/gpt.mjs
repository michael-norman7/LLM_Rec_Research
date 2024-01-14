import keys from "../keys.mjs";
const { openAIKey, movieDBKey } = keys;

const CHATGPT_END_POINT = "https://api.openai.com/v1/chat/completions";
const CHATGPT_MODEL = "gpt-3.5-turbo";

const sysPrompt = `
    I will give you a list of movie or TV titles I can choose from on Netflix.
    These titles were recommended to me by Netflix based on my past watch history and interests.
    From these titles think of how you would summarize my preferences and recommend me 10 titles 
    to watch based on those preferences. Do not explain your recommendations.
    Only return the exact names of the titles as I input them in the format
    "<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>"`;

let titleOptions = "Here are the titles I can choose from: \n";


let titles = ["One Piece", "Better Call Saul", "Arrow", "The Good Place"]

titles.forEach((title) => {
  titleOptions += title + ", ";
});

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
  console.log("Raw message:")
  console.log(responseData.choices);
  console.log();
  console.log(message);

} catch (error) {
  console.error("Error:", error);
}
