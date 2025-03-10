let tab = document.querySelectorAll(".tabs li");
let notificationBtn = document.querySelector(".notificationBtn");
let creatUrl = (id)=> `https://hacker-news.firebaseio.com/v0/item/${id}.json`
let cardsContainer = document.querySelector(".cardsContainer");

notificationBtn.addEventListener("click", () => {
  location.reload();
});

const run = async () => {
  let lastId = await getData(
    "https://hacker-news.firebaseio.com/v0/maxitem.json"
  );

  let lastFetchedId = lastId

  async function loadData() {
    let counter = 0 
    let cards = []
    let loader = document.querySelector(".loading")
    loader.classList.remove("invisible")
    while (counter < 10) {
      let data = await getData(creatUrl(lastFetchedId));
      lastFetchedId--;
      if (data.type !== "comment" && !data.dead){
        cards.push(createCard(data))
        counter++;
      }
    }

    loader.classList.add("invisible")
    cards.forEach(element => {
      cardsContainer.appendChild(element)
    });
    setInterval(async () => {
      let data = await getData(
        `https://hacker-news.firebaseio.com/v0/maxitem.json`
      );
      if (data !== lastId) {
        lastId = data;
        notificationBtn.style.backgroundColor = "green";
      }
    },5000)
  }
  loadData()
document.addEventListener("scroll", () => {
  loadData()
})
  function createCard(data) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("card");
    let title = document.createElement("h3");
    title.textContent = data.title;
    let url = document.createElement("a");
    let type = document.createElement("p");
    type.textContent = data.type
    url.href = data.url;
    url.textContent = data.url;
    card.appendChild(title);
    card.appendChild(url);
    card.appendChild(type);
    return card
    
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