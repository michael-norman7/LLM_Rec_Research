export const getNetflixTop4 = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];

    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: () => {
        
        const rows = document.getElementsByClassName("lolomoRow");
        let items = rows[0].getElementsByClassName("slider-refocus");
        console.log(items)

        return items;
      },
    });
  });
};
