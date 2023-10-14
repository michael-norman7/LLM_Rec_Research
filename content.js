(async () => {
  async function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  window.scrollTo(0, document.body.scrollHeight);
  await delay(2000);
  window.scrollTo(0, document.body.scrollHeight);
  window.scrollTo(0, -document.body.scrollHeight);

  let currentTitles = [...document.getElementsByClassName("fallback-text")];

  // currentTitles.forEach((title) => {
  //   console.log(title.innerHTML);
  // });

  // console.log(document.getElementsByClassName("fallback-text")[0].innerHTML);
})();
