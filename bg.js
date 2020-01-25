const body = document.querySelector('body');

const IMG_NUMBER = 7;

function paintImage(imgNumber) {
  const image = new Image();
  image.src = `images/${imgNumber + 1}.jpg`;
  image.classList.add('bgImage');

  // const div = document.createElement('div');
  // div.classList.add('bg');
  // body.appendChild(div);

  // div.appendChild(image);
  const page1 = document.querySelector('#page-1');
  //page1.setBackgroundImage(image);
  console.log(`url(${image.src})`);

  page1.style.backgroundImage = `url(${image.src})`;
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
