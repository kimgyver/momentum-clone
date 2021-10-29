const body = document.querySelector("body");

const IMG_NUMBER = 14;

function paintImage(imgNumber) {
  const image = new Image();
  image.src = `images/${imgNumber + 1}.jpg`;
  image.classList.add("bgImage");

  const page1 = document.querySelector("#page-1");
  //console.log(`url(${image.src})`);

  if (localStorage.getItem("prevent-image") !== "true") {
    page1.style.backgroundImage = `url(${image.src})`;
  }
}

function genRandom() {
  const number = Math.floor(Math.random() * IMG_NUMBER);
  return number;
}

function init() {
  const randomNumber = genRandom();
  paintImage(randomNumber);
}

init();
