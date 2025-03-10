let tab = document.querySelectorAll(".tabs li");
let notificationBtn = document.querySelector(".notificationBtn");
let creatUrl = (id) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
let cardsContainer = document.querySelector(".cardsContainer");
const container = document.querySelector(".cardsContainer");
const windowHasScroll = () =>
  document.documentElement.scrollHeight > document.documentElement.clientHeight;
notificationBtn.addEventListener("click", () => {
  location.reload();
});
const convertTime = (time) => {
  let secondes = Math.floor(time / 1000);

  if (secondes < 60) return `${secondes} secondes ago.`;

  let minutes = Math.floor(secondes / 60);
  if (minutes < 60) return `${minutes} minutes ago.`;

  let heures = Math.floor(minutes / 60);
  if (heures < 24) return `${heures} hours ago.`;

  let jours = Math.floor(heures / 24);
  return `${jours} days ago.`;
};

const run = async () => {
  let lastId = await getData(
    "https://hacker-news.firebaseio.com/v0/maxitem.json"
  );

  let lastFetchedId = lastId;

  async function loadData() {
    let counter = 0;
    let loader = document.querySelector(".loading");
    loader.classList.remove("invisible");
    while (!windowHasScroll() || counter < 10) {
      let data = await getData(creatUrl(lastFetchedId));
      lastFetchedId--;
      if (data.type !== "comment" && !data.dead) {
        createCard(data);
        counter++;
      }
    }
    loader.classList.add("invisible");
    setInterval(async () => {
      let data = await getData(
        `https://hacker-news.firebaseio.com/v0/maxitem.json`
      );
      if (data !== lastId) {
        lastId = data;
        notificationBtn.style.backgroundColor = "green";
      }
    }, 5000);
  }
  loadData();
  // document.addEventListener("scroll", () => {
  //   loadData();
  // });
  function createCard(data) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("card");
    let title = document.createElement("h3");
    title.textContent = data.title;
    let url = document.createElement("a");
    let type = document.createElement("p");
    let time = document.createElement("p");
    time.textContent = convertTime(data.time);
    type.textContent = data.type;
    url.href = data.url;
    url.textContent = data.url;
    card.appendChild(title);
    card.appendChild(url);
    card.appendChild(type);
    card.appendChild(time);
    container.append(card);
  }

  tab.forEach((li) => {
    li.addEventListener("click", () => {
      defaultData.tabs = li.textContent;
    });
  });

  async function getData(url) {
    let resp = await fetch(url);
    const json = await resp.json();
    return json;
  }
};
run();
