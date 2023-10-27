import { getGPTRecommendation } from "./gptUtil.js";

document.addEventListener("DOMContentLoaded", function () {
  const scrapeButton = document.getElementById("scrapeButton");
  // const titleList = document.getElementById("titleList");
  const popupContent = document.getElementById("popupContent");
  let netflixTitles = [];

  scrapeButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];

      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          function: () => {
            const elements = [
              ...document.getElementsByClassName("fallback-text"),
            ];
            const netflixTitles = elements.map(
              (element) => element.textContent
            );
            return netflixTitles;
          },
        },
        (result) => {
          const netflixTitles = result[0].result;

          displayNetflixTitles(netflixTitles);
        }
      );
    });
  });

  async function displayNetflixTitles(titles) {
    // start loading
    popupContent.innerHTML = "";
    popupContent.textContent = "Loading Recommendations...";

    // send request to GPT
    let gptResponse = await getGPTRecommendation(titles);
    let recommendations = gptResponse.split("|");
    let cnt = 0;
    while (recommendations.length != 5) {
      cnt++;
      gptResponse = await getGPTRecommendation(titles);
      recommendations = gptResponse.split("|");
      if (cnt == 5) {
        console.error("Incorrent format of output from GPT.");
        return;
      }
    }

    // end loading
    popupContent.innerHTML = "";
    const h3 = document.createElement("h3");
    h3.textContent = "Here are your Recommendations:";
    popupContent.appendChild(h3);
    const hr = document.createElement("hr");
    popupContent.appendChild(hr);

    const ol = document.createElement("ol");
    popupContent.appendChild(ol);
    recommendations.forEach((title) => {
      const li = document.createElement("li");
      li.textContent = title;
      ol.appendChild(li);
    });
    // popupContent.textContent = gptResponse;

    // titleList.innerHTML = ""; // Clear the list
    // titles.forEach((title) => {
    //   const li = document.createElement("li");
    //   li.textContent = title;
    //   titleList.appendChild(li);
    // });
  }
});
