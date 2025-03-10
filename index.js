let tab = document.querySelectorAll(".tabs li");
let notificationBtn = document.querySelector(".notificationBtn");
let creatUrl = (id) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
let cardsContainer = document.querySelector(".cardsContainer");

notificationBtn.addEventListener("click", () => {
  location.reload();
});

// Fixed throttle function
function throttle(func, wait) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

const run = async () => {
  let lastId = await getData(
    "https://hacker-news.firebaseio.com/v0/maxitem.json"
  );
  
  let lastFetchedId = lastId;
  let isLoading = false; 
  
  async function loadData() {
    if (isLoading) return;
    isLoading = true;
    console.log('fetching....')
    
    let counter = 0;
    let loader = document.querySelector(".loading");
    loader.classList.remove("invisible");
    
    while (counter < 10) {
      let data = await getData(creatUrl(lastFetchedId));
      lastFetchedId--;
      
      if (data && data.type !== "comment" && !data.dead) {
        createCard(data);
        counter++;
      }
    }
    
    loader.classList.add("invisible");
    isLoading = false;
  }
  
  await loadData();
  
  setInterval(async () => {
    let data = await getData(
      `https://hacker-news.firebaseio.com/v0/maxitem.json`
    );
    if (data !== lastId) {
      lastId = data;
      notificationBtn.style.backgroundColor = "green";
    }
  }, 5000);
  
  document.addEventListener("scroll", throttle(loadData, 300));
  
  function createCard(data) {
    let card = document.createElement("div");
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
    
    cardsContainer.appendChild(card);
  }
  
  tab.forEach((li) => {
    li.addEventListener("click", () => {
      defaultData.tabs = li.textContent;
    });
  });
  
  async function getData(url) {
    try {
      let resp = await fetch(url);
      const json = await resp.json();
      return json;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
};

run();