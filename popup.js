// popup.js

// Function to run when the button is clicked
function runCode() {
  console.log("clicked");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: () => {
        // Retrieve text from elements with class "fallback-text"
        const elements = [...document.getElementsByClassName("fallback-text")];
        const text = elements.map((element) => element.textContent);
        chrome.runtime.sendMessage({ text });
      },
    });
  });
}

// Add a click event listener to the button
document.getElementById("runCodeButton").addEventListener("click", runCode);

// Listen for the message from the content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const text = message.text;
  const textContainer = document.getElementById("textContainer");

  // Display the retrieved text in the popup
  textContainer.textContent = text.join("\n");
});

// popup.js

// Listen for the message from the content script
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   const currentTitles = message.currentTitles;
//   const textContainer = document.getElementById("titles");

//   currentTitles.forEach(function (title, index) {
//       const newText = document.createElement("p");
//       newText.textContent = "4" + String(title);

//       textContainer.appendChild(newText);
//   });
// });

// Function to run when the button is clicked
// function runCode() {
//   console.log("clicked");
//   const textContainer = document.getElementById("titles");

//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     const activeTab = tabs[0];
//     chrome.scripting.executeScript({
//       target: { tabId: activeTab.id },
//       function: () => {
//         // Inside the script, get the elements and send them back to the extension
//         const currentTitles = [...document.getElementsByClassName("fallback-text")];
//         chrome.runtime.sendMessage({ currentTitles });
//       },
//     });
//   });
// }

// // Listen for the message from the content script
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   const currentTitles = message.currentTitles;
//   const textContainer = document.getElementById("titles");

//   currentTitles.forEach(function (title, index) {
//     const newText = document.createElement("p");
//     newText.textContent = "3" + String(title);

//     textContainer.appendChild(newText);
//   });

//   const newText = document.createElement("p");
//   newText.textContent = "new";

//   textContainer.appendChild(newText);
// });

// Add a click event listener to the button
// document.getElementById("runCodeButton").addEventListener("click", runCode);

// const onLoad = async (e) => {
//   console.log("Loading page...");

//   const activeTab = await getActiveTabURL();

//   chrome.tabs.sendMessage(activeTab.id, {
//     type: "LOAD",
//   });
// };

// const addTitle = (titles, title) => {
//   const titleElement = document.createElement("div");

//   titleElement.textContent = title.desc;
//   // titleElement.className = "bookmark-title";

//   titles.appendChild(titleElement);
// };

// const viewTitles = (currentTitles = []) => {
//   const titlesElement = document.getElementById("titles");
//   titlesElement.innerHTML = "";

//   if (currentTitles.length > 0) {
//     for (let i = 0; i < currentTitles.length; i++) {
//       const title = currentTitles[i];
//       addTitle(titlesElement, title);
//     }
//   } else {
//     titlesElement.innerHTML = '<i class="row">No titles to show</i>';
//   }

//   return;
// };

// document.addEventListener("DOMContentLoaded", async () => {
//   const activeTab = await getActiveTabURL();

//   console.log("RUN");

//   if (activeTab.url.includes("netflix.com/browse")) {
//     chrome.storage.sync.get([currentVideo], (data) => {
//       const currentTitles = data[currentVideo]
//         ? JSON.parse(data[currentVideo])
//         : [];

//       viewTitles(currentVideoBookmarks);
//     });
//   } else {
//     const container = document.getElementsByClassName("container")[0];

//     container.innerHTML =
//       '<div class="title">This is not a youtube video page.</div>';
//   }
// });
