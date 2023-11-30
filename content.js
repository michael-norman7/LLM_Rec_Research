// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// delay(2000).then(() => {
//   let titleDetails = {};

//   const rows = document.getElementsByClassName("lolomoRow");

//   for (let i = 0; i < rows.length - 1; ++i) {
//     let rowTitle =
//       rows[i].getElementsByClassName("row-header-title")[0].innerHTML;

//     let items = rows[i].getElementsByClassName("slider-refocus");
//     for (let j = 0; j < items.length; ++j) {
//       let titleName = items[j].ariaLabel;

//       let details = {};
//       details["img_link"] = items[j]
//         .getElementsByClassName("boxart-container")[0]
//         .querySelector("img").src;
//       details["watch_link"] = items[j].href;
//       details["row_tag"] = rowTitle;

//       if (titleName in titleDetails) {
//         titleDetails[titleName]["row_tag"] =
//           titleDetails[titleName]["row_tag"] + " and " + rowTitle;
//       } else {
//         titleDetails[titleName] = details;
//       }
//     }
//   }

//   console.log(titleDetails);
//   chrome.storage.local.set({ titles: titleDetails });
// });