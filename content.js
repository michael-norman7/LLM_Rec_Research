const loadTitles = () => {
  const elements = [...document.getElementsByClassName("fallback-text")];

  elements.forEach((title, idx) => {
    console.log(idx + 1, title.innerHTML);
  });

  const text = elements.map((element) => element.textContent);
  chrome.runtime.sendMessage({ text });
};

setTimeout(loadTitles, 2000);

// loadTitles()