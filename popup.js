import { getGPTRecommendation } from "./gptUtil.js";
import { getNetflixTop4 } from "./testing.js";

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

document.addEventListener("DOMContentLoaded", function () {
  const scrapeButton = document.getElementById("scrapeButton");
  const testingButton = document.getElementById("testingButton");
  const feedbackButton = document.getElementById("feedbackButton");
  const popupContent = document.getElementById("popupContent");
  const buttonContainer = document.getElementById("buttonContainer");

  const getNetflixTop4 = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: () => {
          const rows = document.getElementsByClassName("lolomoRow");
          let items = rows[0].getElementsByClassName("slider-refocus");
          let names = Array.from(items).map((element) => {
            return element.getAttribute("aria-label");
          });

          chrome.storage.local.set({ netflixTop4: names.slice(0, 4) });
        },
      });
    });
  };

  getNetflixTop4();

  console.log("top 4:");
  chrome.storage.local.get("netflixTop4", function (result) {
    const res = result.netflixTop4 || [];

    if (res == []) {
      console.error("Error retrieving top 4 Netflix Titles.");
    } else {
      console.log(res);
    }
  });

  const loadRecommendations = async () => {
    // display recommendations
    chrome.storage.local.get("recommendations", function (result) {
      const recommendations = result.recommendations || [];

      // remove spaces from start and end of each title
      // remove special characters from each title such as quotes
      for (let i = 0; i < recommendations.length; ++i) {
        recommendations[i] = recommendations[i].trim();
        recommendations[i] = recommendations[i].replace(/["]+/g, "");
      }

      if (recommendations == []) {
        console.log("No Recommendations Stored");
        popupContent.innerHTML = "";
      } else {
        // get stored titles from storage
        chrome.storage.local.get("titles", function (result) {
          const titleDetails = result.titles || {};

          buttonContainer.style.textAlign = "right";

          scrapeButton.textContent = "Refresh Recommendations";
          scrapeButton.className = "btn btn-primary";

          popupContent.style.fontSize = "16px";
          popupContent.style.display = "block";
          popupContent.textAlign = "center";
          popupContent.innerHTML = "";

          feedbackButton.style = "margin: 0px";

          // make the scrape button color #E50914 (Netflix red)
          scrapeButton.style.backgroundColor = "#E50914";
          scrapeButton.style.borderColor = "#E50914";

          // make the feedback button color grey
          feedbackButton.style.backgroundColor = "#6c757d";
          feedbackButton.style.borderColor = "#6c757d";

          // make the testing button color grey
          testingButton.style.backgroundColor = "#6c757d";
          testingButton.style.borderColor = "#6c757d";

          // header text
          const header = document.createElement("p");
          header.style.fontSize = "20px";
          header.textContent = "Here are your Recommendations:";
          popupContent.appendChild(header);

          // hr under header
          const hr = document.createElement("hr");
          hr.style.borderTop = "2px solid white";
          popupContent.appendChild(hr);

          // Display Netflix Top 4 Recommendations
          const testing = chrome.storage.local.get(
            "testing",
            function (result) {
              return result.testing;
            }
          );
          if (testing) {
            chrome.storage.local.get("netflixTop4", function (result) {
              const res = result.netflixTop4 || [];

              if (res == []) {
                console.error("Error retrieving top 4 Netflix Titles.");
                return [];
              } else {
                return res;
              }
            });
          }

          // title recommendation box
          const recommendationContainer = document.createElement("div");
          recommendationContainer.id = "recommendationContainer";
          recommendationContainer.style.display = "flex";
          recommendationContainer.style.flexWrap = "wrap";
          recommendationContainer.style.justifyContent = "space-evenly";
          recommendationContainer.style.alignItems = "center";
          popupContent.appendChild(recommendationContainer);

          let valid = 0;
          for (let i = 0; i < recommendations.length; ++i) {
            const title = recommendations[i];
            if (title in titleDetails) {
              const recommendation = document.createElement("div");
              recommendation.style.display = "flex";
              recommendation.style.flexDirection = "column";
              recommendation.style.alignItems = "center";
              recommendation.style.margin = "10px";
              recommendation.style.width = "200px";

              recommendationContainer.appendChild(recommendation);

              const titleImage = document.createElement("img");
              titleImage.src = titleDetails[title]["img_link"];
              titleImage.style.maxWidth = "15em";
              titleImage.style.maxHeight = "8.5em";
              titleImage.style.cursor = "pointer";

              titleImage.addEventListener("click", function () {
                chrome.tabs.create({
                  url: titleDetails[title]["watch_link"],
                });
              });
              titleImage.addEventListener("mouseover", function () {
                titleImage.style.opacity = "0.5";
              });
              titleImage.addEventListener("mouseout", function () {
                titleImage.style.opacity = "1";
              });

              const playButton = document.createElement("img");
              playButton.src = chrome.runtime.getURL("assets/art/play2.avif");
              playButton.style.position = "absolute";
              playButton.style.top = "50%";
              playButton.style.left = "50%";
              playButton.style.transform = "translate(-50%, -50%)";
              playButton.style.opacity = "0";
              playButton.style.transition = "opacity 0.3s ease-in-out";

              playButton.addEventListener("click", function () {
                chrome.tabs.create({
                  url: titleDetails[title]["watch_link"],
                });
              });

              titleImage.addEventListener("mouseover", function () {
                playButton.style.opacity = "1";
              });
              titleImage.addEventListener("mouseout", function () {
                playButton.style.opacity = "0";
              });

              recommendation.appendChild(titleImage);
              valid += 1;
            }

            if (valid == 4) {
              break;
            }
          }
        });
      }

      // Display recommendation generation date
      chrome.storage.local.get("recommendation_dt", function (result) {
        const dt_string = result.recommendation_dt || "";
        if (dt_string != "") {
          // const dt = document.getElementById("generationDate");
          const dt = document.createElement("div");
          dt.style = "text-align: right; font-size: 13px; color: white";
          dt.textContent = "Generated " + dt_string;
          popupContent.appendChild(dt);
        }
      });
    });
  };

  loadRecommendations();

  scrapeButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: () => {
          let titleDetails = {};
          const rows = document.getElementsByClassName("lolomoRow");

          for (let i = 0; i < rows.length - 1; ++i) {
            let rowTitle =
              rows[i].getElementsByClassName("row-header-title")[0].innerHTML;

            let items = rows[i].getElementsByClassName("slider-refocus");
            for (let j = 0; j < items.length; ++j) {
              let titleName = items[j].ariaLabel;

              let details = {};
              details["img_link"] = items[j]
                .getElementsByClassName("boxart-container")[0]
                .querySelector("img").src;
              details["watch_link"] = items[j].href;
              details["row_tag"] = rowTitle;

              if (titleName in titleDetails) {
                titleDetails[titleName]["row_tag"] =
                  titleDetails[titleName]["row_tag"] + " and " + rowTitle;
              } else {
                titleDetails[titleName] = details;
              }
            }
          }

          chrome.storage.local.set({ titles: titleDetails });
          console.log(titleDetails);
        },
      });
    });
    displayTitles();
  });

  feedbackButton.addEventListener("click", function () {
    var link = "https://forms.gle/QBTEubgoZp5v4V5z5";
    chrome.tabs.create({ url: link });
  });

  testingButton.addEventListener("click", function () {
    chrome.storage.set({ testing: "true" });
  });

  async function displayTitles() {
    // get titles from local storage
    let titles = [];
    chrome.storage.local.get("titles", async function (result) {
      titles = Object.keys(result.titles);
      console.log(titles);

      // start loading
      popupContent.innerHTML = "";
      popupContent.textContent = "Loading Recommendations...";
      popupContent.style.textAlign = "center";
      popupContent.style.fontSize = "20px";

      scrapeButton.className = "btn btn-secondary disabled";
      // make button grey
      scrapeButton.style.backgroundColor = "#6c757d";
      scrapeButton.style.borderColor = "#6c757d";
      scrapeButton.textContent = "Loading...";

      feedbackButton.style = "display: none";
      // pad under loading text
      const pad = document.createElement("div");
      pad.style = "height: 200px";
      popupContent.appendChild(pad);

      // send request to GPT
      let promptType = "rec_similar_prefs";
      let gptResponse = await getGPTRecommendation(titles, promptType);
      let recommendations = gptResponse.split("|");
      const currentDate = getCurrentDateTime();

      // Save recommendations to local storage
      chrome.storage.local.set({
        recommendations: recommendations,
        recommendation_dt: currentDate,
      });

      loadRecommendations();
    });
  }
});
