chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  console.log(info.status);
  if (info.url || info.status === "loading") {
    const url = info.url || tab.pendingUrl || tab.url;
    console.log(url); // prints in the *background* console
  }
});
