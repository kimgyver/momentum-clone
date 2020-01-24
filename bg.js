const body = document.querySelector('body');

const IMG_NUMBER = 7;

function paintImage(imgNumber) {
  const image = new Image();
  image.src = `images/${imgNumber + 1}.jpg`;
  image.classList.add('bgImage');

  const div = document.createElement('div');
  div.classList.add('bg');
  body.appendChild(div);

  //body.appendChild(image);
  div.appendChild(image);
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
