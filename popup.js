const addTitles = (titles, title) => {
  const titleElement = document.createElement("div");

  titleElement.textContent = title.desc;
  // titleElement.className = "bookmark-title";

  titles.appendChild(titleElement);
};

const viewTitles = (currentTitles = []) => {
  const titlesElement = document.getElementById("titles");
  titlesElement.innerHTML = "";

  if (currentTitles.length > 0) {
    for (let i = 0; i < currentTitles.length; i++) {
      const title = currentTitles[i];
      addNewBookmark(titlesElement, title);
    }
  } else {
    titlesElement.innerHTML = '<i class="row">No titles to show</i>';
  }

  return;
};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();

  console.log("RUN");

  if (activeTab.url.includes("netflix.com/browse")) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : [];

      viewBookmarks(currentVideoBookmarks);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML =
      '<div class="title">This is not a youtube video page.</div>';
  }
});
