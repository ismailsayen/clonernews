const defaultData = {
  tabs: "Stories",
  items: [],
};

const run = async () => {
  let tab = document.querySelectorAll(".tabs li");
  let lastId = await getData(
    "https://hacker-news.firebaseio.com/v0/maxitem.json"
  );
  console.log(lastId);

  tab.forEach((li) => {
    li.addEventListener("click", () => {
      defaultData.tabs = li.textContent;
      fetchData();
    });
  });

  async function fetchData() {
    switch (defaultData.tabs) {
      case "Stories":
        getData("https://hacker-news.firebaseio.com/v0/topstories.json");
      case "Jobs":
        getData("https://hacker-news.firebaseio.com/v0/jobstories.json");
    }
  }

  async function getData(url) {
    let resp = await fetch(url);
    const json = await resp.json();
    return json;
  }
};
run();
