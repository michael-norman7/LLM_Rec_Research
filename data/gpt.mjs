// using openai api directly

// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: "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",
// });

// const response = await openai.chat.completions.create({
//   model: "gpt-3.5-turbo",
//   messages: [
//     // {
//     //   role: "system",
//     //   content:
//     //     "You will be provided with a piece of code, and your task is to explain it in a concise way.",
//     // },
//     {
//       role: "user",
//       content: "Hello, what is your name?",
//     },
//   ]
// });

const openAIKey = "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";
const config = {
  headers: {
    Authorization: `Bearer ${openAIKey}`,
  },
};

const message = "Hello, what is your name?";

const chatGPTData = {
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: message }],
};

// using axios

// import axios from "axios";
// const response = await axios.post(
//   "https://api.openai.com/v1/chat/completions",
//   chatGPTData,
//   config
// );

// using fetch

const requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${openAIKey}`,
  },
  body: JSON.stringify(chatGPTData),
};

try {
  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    requestOptions
  );
  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }

  const responseData = await response.json();
  const message = responseData.choices[0].message.content;
  console.log(message);
} catch (error) {
  console.error("Error:", error);
}

// console.log(response?.data?.choices[0]?.message?.content);
