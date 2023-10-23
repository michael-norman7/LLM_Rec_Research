// const loadTitles = () => {
//   const elements = [...document.getElementsByClassName("fallback-text")];

//   // elements.forEach((title, idx) => {
//   //   console.log(idx + 1, title.innerHTML);
//   // });

//   const netflixTitles = elements.map((element) => element.textContent);

//   chrome.runtime.sendMessage({ netflixTitles });

//   // sessionStorage.setItem("netflixTitles", JSON.stringify(netflixTitles));
//   // console.log("Titles scraped");

//   // const netflixTitles2 = JSON.parse(sessionStorage.getItem("netflixTitles"));
//   // console.log(netflixTitles2);
// };

// setTimeout(loadTitles, 2000);
// loadTitles();

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("content");
  if (message.action === "scrapeNetflixTitles") {
    const elements = [...document.getElementsByClassName("fallback-text")];
    const netflixTitles = elements.map((element) => element.textContent);
    chrome.runtime.sendMessage({
      action: "netflixTitles",
      data: netflixTitles,
    });
  }
});
