// popup.js

// Function to run when the button is clicked
function runCode() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: () => {
        let currentTitles = [
          ...document.getElementsByClassName("fallback-text"),
        ];

        currentTitles.forEach((title, idx) => {
          // console.log(idx + 1, title.innerHTML);
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: () => {
              console.log(idx + 1, title.innerHTML);
            },
          });
        });
      },
    });
  });
}

// Add a click event listener to the button
document.getElementById("runCodeButton").addEventListener("click", runCode);

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
