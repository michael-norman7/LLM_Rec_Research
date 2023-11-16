import { getGPTRecommendation } from "./gptUtil.js";

function getCurrentDateTime() {
  function padZero(value) {
    return value < 10 ? `0${value}` : value;
  }

  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = padZero(currentDate.getMonth() + 1);
  const day = padZero(currentDate.getDate());
  const hours = padZero(currentDate.getHours());
  const minutes = padZero(currentDate.getMinutes());
  const seconds = padZero(currentDate.getSeconds());

  const currentDateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return currentDateTimeString;
}

function openFeedbackForm() {
  let link = "https://forms.gle/QBTEubgoZp5v4V5z5";
  window.open(link, "_blank");
}

document.addEventListener("DOMContentLoaded", function () {
  const scrapeButton = document.getElementById("scrapeButton");
  const feedbackButton = document.getElementById("feedbackButton");
  const popupContent = document.getElementById("popupContent");
  const buttonContainer = document.getElementById("buttonContainer");

  const loadRecommendations = async () => {
    // display recommendations
    chrome.storage.local.get("recommendations", function (result) {
      const recommendations = result.recommendations || [];

      if (recommendations == []) {
        console.log("No Recommendations Stored");
        popupContent.innerHTML = "";
      } else {
        scrapeButton.className = "btn btn-secondary my-3 me-1";
        buttonContainer.style = "text-align: right";
        scrapeButton.textContent = "Refresh List";

        popupContent.innerHTML = "";
        const header = document.createElement("p");
        header.style = "font-size: 20px";
        header.textContent = "Here are your Recommendations:";
        popupContent.appendChild(header);
        const hr = document.createElement("hr");
        popupContent.appendChild(hr);

        const ol = document.createElement("ol");
        popupContent.appendChild(ol);

        recommendations.forEach((title) => {
          const li = document.createElement("li");
          li.style = "text-align: left; font-size: 16px;";
          li.textContent = title;
          ol.appendChild(li);
        });
      }
    });

    // Display recommendation generation date
    chrome.storage.local.get("recommendation_dt", function (result) {
      const dt_string = result.recommendation_dt || "";
      if (dt_string != "") {
        // const dt = document.getElementById("generationDate");
        const dt = document.createElement("div");
        dt.style = "text-align: right; font-size: 13px";
        dt.textContent = "Generated " + dt_string;
        popupContent.appendChild(dt);
      }
    });
  };

  loadRecommendations();

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
          if (result) {
            const netflixTitles = result[0].result;
            displayNetflixTitles(netflixTitles);
          }
        }
      );
    });
  });

  feedbackButton.addEventListener("click", function () {
    var link = "https://forms.gle/QBTEubgoZp5v4V5z5";
    chrome.tabs.create({ url: link });
  });

  async function displayNetflixTitles(titles) {
    // start loading
    popupContent.innerHTML = "";
    popupContent.textContent = "Loading Recommendations...";

    // send request to GPT
    let gptResponse = await getGPTRecommendation(titles);
    let recommendations = gptResponse.split("|");
    const currentDate = getCurrentDateTime();

    // Save recommendations to local storage
    chrome.storage.local.set({
      recommendations: recommendations,
      recommendation_dt: currentDate,
    });

    loadRecommendations();
  }
});
