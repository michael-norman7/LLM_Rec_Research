chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const text = message.text;
  const textContainer = document.getElementById("textContainer");

  text.forEach((element) => {
    let newText = document.createElement("p");
    newText.textContent = element;

    textContainer.appendChild(newText);
  });
});
