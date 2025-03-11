let tab = document.querySelectorAll(".tabs li");
let tabValue = 'story'
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

tab.forEach((li) => {
  li.addEventListener("click", () => {
    cardsContainer.innerHTML = ""
    tabValue = li.id
    run();
  })
})

// Fixed throttle function
function throttle(func, wait) {
  let lastCall = 0;
  return function (...args) {
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
    console.log("fetching....");

    let counter = 0;
    let loader = document.querySelector(".loading");
    loader.classList.remove("invisible");

    while (!windowHasScroll || counter < 10) {
      let data = await getData(creatUrl(lastFetchedId));
      lastFetchedId--;

      if (data && data.type === tabValue && !data.dead) {
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
    let url = document.createElement("a");
    let title = document.createElement("h3");
    let cmtBtn = document.createElement("button")
    let cmtContainer = document.createElement("div")
    let time = document.createElement("p");
    let type = document.createElement("p");
    card.classList.add("card");
    title.textContent = data.title;
    url.textContent = data.url;
    url.href = data.url;
    url.setAttribute('target', '_blank');
    url.style.display = "block"
    cmtBtn.classList.add('cmtBtn')
    cmtBtn.textContent = "Show Comments"
    cmtContainer.classList.add('cmtsContainer')
    time.textContent = convertTime(data.time);
    type.textContent = data.type;
    card.setAttribute('data-id', data.id);
    card.setAttribute('data-kids', data.kids?.join(','))
    card.appendChild(title);
    card.appendChild(url);
    card.appendChild(cmtBtn);
    card.appendChild(cmtContainer);
    card.appendChild(type);
    card.appendChild(time);
    cardsContainer.appendChild(card);

    cmtBtn.addEventListener("click", () => {
      fetchComments(card)
    })
  }

  function fetchComments(card) {
    let cardId = card.dataset.id
    let commentsIds = card.dataset.kids === "undefined" ? undefined : card.dataset.kids.split(",")
    let cmtContainer = card.querySelector('.cmtsContainer')
    let cmtClassList = cmtContainer.classList
    cmtContainer.textContent = "No Comments ..."
    if (!commentsIds) cmtClassList.add('show');
    if (cmtClassList.contains('hide')){
      cmtClassList.replace('hide', 'show')
      card.querySelector('.cmtBtn').textContent = "Hide Comments"
    } else if (cmtClassList.contains('show')){
      cmtClassList.replace('show', 'hide')
      card.querySelector('.cmtBtn').textContent = "Show Comments"
    } else {
      commentsIds.forEach(async cmtId => {
        let res = await getData(creatUrl(cmtId))
        if (res.parent === cardId && !res.dead && !res.deleted) {
          // if (cmtContainer.textContent === "No Comments ...") cmtContainer.innerHTML = ""; 
          let comment = document.createElement('div')
          comment.classList.add('comment')
          comment.innerHTML = res.text
          cmtContainer.append(comment)
        }
        console.log(res)
      });
      cmtClassList.add('hide')
    }
  }

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
