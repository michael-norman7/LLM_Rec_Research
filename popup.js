document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    const text = message.text;
    const textContainer = document.getElementById("textContainer");

    let newText = document.createElement("strong");
    newText.style.fontSize = "16px";
    newText.style.textAlign = "center";
    newText.textContent = text.length + " Titles found";
    textContainer.appendChild(newText);

    text.forEach((element) => {
      newText = document.createElement("p");
      newText.textContent = element;

      textContainer.appendChild(newText);
    });
  });

  function saveSettings(event) {
    event.preventDefault();

    const option1 = document.getElementById("option1").checked;
    const option2 = document.getElementById("option2").checked;

    const settings = {
      option1,
      option2,
    };

    chrome.storage.sync.set({ settings });
  }

  document
    .getElementById("settingsForm")
    .addEventListener("submit", saveSettings);

  chrome.storage.sync.get(["settings"], function (result) {
    const settings = result.settings;

    if (settings) {
      document.getElementById("option1").checked = settings.option1 || false;
      document.getElementById("option2").checked = settings.option2 || false;
      chrome.storage.sync.remove("settings");
    } 
    // else {
    //   let newText = document.createElement("p");
    //   newText.textContent = "No Settings Found";
    //   textContainer.appendChild(newText);
    // }
  });
});
