console.log("run");

const elements = [...document.getElementsByClassName("fallback-text")];
console.log("load");

elements.forEach((title, idx) => {
  console.log(idx + 1, title.innerHTML);
});

const text = elements.map((element) => element.textContent);
chrome.runtime.sendMessage({ text });

// (async () => {
//   // TEMP UNTIL WAIT FUNC FIGURED OUT
//   async function delay(ms) {
//     return new Promise((resolve) => {
//       setTimeout(resolve, ms);
//     });
//   }

//   document.addEventListener("DOMContentLoaded", () => {
//     console.log("RUN");
//   });

//   await delay(5000);

//   let currentTitles = [...document.getElementsByClassName("fallback-text")];

//   // currentTitles.forEach((title, idx) => {
//   //   console.log(idx + 1, title.innerHTML);
//   // });

//   chrome.runtime.sendMessage({ currentTitles });
// })();
