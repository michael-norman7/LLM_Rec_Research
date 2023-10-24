document.addEventListener("DOMContentLoaded", function () {
  const scrapeButton = document.getElementById("scrapeButton");
  const titleList = document.getElementById("titleList");
  let netflixTitles = [];

  scrapeButton.addEventListener("click", function () {
    console.log("click");
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

  function displayNetflixTitles(titles) {
    titleList.innerHTML = ""; // Clear the list
    titles.forEach((title) => {
      const li = document.createElement("li");
      li.textContent = title;
      titleList.appendChild(li);
    });
  }
});
