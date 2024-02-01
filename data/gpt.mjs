import keys from "../keys.mjs";
const { openAIKey, movieDBKey } = keys;

const CHATGPT_END_POINT = "https://api.openai.com/v1/chat/completions";
const CHATGPT_MODEL = "gpt-3.5-turbo";

let titles = [
  "Arrow",
  "BEEF",
  "BLUE EYE SAMURAI",
  "Batman v Superman: Dawn of Justice",
  "Better Call Saul",
  "Beverly Hills Cop",
  "Big Eyes",
  "Blazing Saddles",
  "Breaking Bad",
  "Castlevania",
  "Community",
  "Cunk On Earth",
  "Delicious in Dungeon",
  "Derry Girls",
  "Eurovision Song Contest: The Story of Fire Saga",
  "Hillbilly Elegy",
  "How to Train Your Dragon",
  "Hunter X Hunter (2011)",
  "I Think You Should Leave with Tim Robinson",
  "Jeffrey Epstein: Filthy Rich",
  "JoJo's Bizarre Adventure",
  "John Wick",
  "John Wick: Chapter 2",
  "Jurassic Park",
  "Justice League",
  "Kung Fu Panda 3",
  "Leo",
  "Mamma Mia!",
  "Man of Steel",
  "Monty Python and the Holy Grail",
  "Monty Python's Life of Brian",
  "Murder on the Orient Express",
  "Pokémon Concierge",
  "Rebel Moon — Part One: A Child of Fire",
  "School of Rock",
  "Scott Pilgrim vs. the World",
  "Snowpiercer",
  "Stand by Me",
  "Suits",
  "The Batman",
  "The Blues Brothers",
  "The Brothers Sun",
  "The Fall of the House of Usher",
  "The Good Place",
  "The Suicide Squad",
  "The Super Mario Bros. Movie",
  "The Umbrella Academy",
  "The Woman in the Window",
  "Trolls",
  "V for Vendetta",
  "Vice",
  "Young Sheldon",
];
let titleOptions = "This is the candidate set I can choose from: \n";

titles.forEach((title) => {
  titleOptions += title + ", ";
});

// console.log(titleOptions);

// recommendations based on preferences
const sysPrompt = `
    I will give you a list of movies or TV titles I can choose from on Netflix.
    These titles were recommended to me by Netflix based on my past watch history and interests.
    From these titles think of how you would summarize my preferences and recommend me 10 titles
    to watch based on those preferences. Do not explain your recommendations.
    Only return the exact names of the titles as I input them in the format
    "<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>"`;

const sysMessage = { role: "system", content: sysPrompt };
const userMessage = { role: "user", content: titleOptions };
// const chatGPTData = {
//   model: CHATGPT_MODEL,
//   messages: [sysMessage, userMessage],
// };

// similar recommendations with preferences
const message0 = {
  role: "system",
  content:
    `This is a list of the movies or TV titles I can choose to watch on Netflix. ` +
    titleOptions,
};
const message1 = {
  role: "user",
  content: `These titles were recommended to me by Netflix based on my past watch history and interests.
  From these titles, how you would summarize my preferences?`,
};
const message2 = {
  role: "user",
  content: `Based on my preferences, recommend me 4 titles to watch.`,
};
const message3 = {
  role: "user",
  content: `Recommend me 4 titles from the candidate set that are similar to the 4 titles you 
  just recommended. Order these titles in descending order with the most releveant title first. 
  Do not explain your recommendations. Only return the exact names of the titles as I input them 
  in the format "<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>|<title>"`,
};

const chatGPTData = {
  model: CHATGPT_MODEL,
  messages: [message0, message1, message2, message3],
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
  // console.log("Raw message:");
  // console.log(responseData.choices);
  // console.log();
  console.log(message);
} catch (error) {
  console.error("Error:", error);
}
