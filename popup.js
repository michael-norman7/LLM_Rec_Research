chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const text = message.text;
  const textContainer = document.getElementById("textContainer");

  // Display the retrieved text in the popup
  textContainer.appendChild()
  textContainer.textContent = text.join("\n");
});
