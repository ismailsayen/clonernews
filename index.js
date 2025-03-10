const defaultData = {
  tabs: "Stories",
  items: [],
};
let tab = document.querySelectorAll(".tabs li");

tab.forEach((li) => {
  li.addEventListener("click", () => {
    defaultData.tabs = li.textContent;
    fetchData();
  });
});
const fetchData = () => {
  switch (defaultData.tabs) {
    case "Stories":
      fetchStories("https://hacker-news.firebaseio.com/v0/topstories.json");
    case "Jobs":
      fetchStories("https://hacker-news.firebaseio.com/v0/jobstories.json");
  }
};

const fetchStories = async (url) => {
  let ids = [];
  try {
    let resp = await fetch(url);
    const json = await resp.json();
    ids = json;
    console.log(defaultData.tabs, ids);
  } catch {
    console.log("error");
  }
};
