document.addEventListener("DOMContentLoaded", function () {
  const scrapeButton = document.getElementById("scrapeButton");
  const titleList = document.getElementById("titleList");
  let netflixTitles = [];

  scrapeButton.addEventListener("click", function () {
    console.log("click");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: () => {
          const elements = [
            ...document.getElementsByClassName("fallback-text"),
          ];
          netflixTitles = elements.map((element) => element.textContent);
          console.log(netflixTitles);
        },
      });
    });

    displayNetflixTitles(netflixTitles);
  });

  function displayNetflixTitles(titles) {
    console.log("display");
    titleList.innerHTML = ""; // Clear the list
    titles.forEach((title) => {
      const li = document.createElement("li");
      li.textContent = title;
      titleList.appendChild(li);
    });
  }

  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (message.action === "netflixTitles") {
      console.log("return");
      displayNetflixTitles(message.data);
    }
  });
});
