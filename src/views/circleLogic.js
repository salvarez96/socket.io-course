const circle = document.querySelector('#circle');
const circleContainer = document.querySelector('.circle-container');

const circleWidth = circle.clientWidth;
const circleHeight = circle.clientHeight;
const circleContainerPosition = circleContainer.getBoundingClientRect();

const moveCircle = position => {
  if (
    position.top > circleContainerPosition.top - 2 + (circleHeight / 2) &&
    position.top < circleContainerPosition.bottom - (circleHeight / 2)
  ) {
    // calculate position based on client position, content height and its margin
    circle.style.top = position.top - (96 + (20 * 4)) + 'px';
  }

  if (
    position.left > circleContainerPosition.left - 2 + (circleWidth / 2)
    && position.left < circleContainerPosition.right - (circleWidth / 2)
  ) {
    // calculate position based on client position, content width and its margin
    circle.style.left = position.left - 21 + 'px';
  }
}

const dragCircle = e => {
  const position = {
    top: e.clientY,
    left: e.clientX
  }
  moveCircle(position);
}

circle.addEventListener("mousedown", (e) => {
  document.addEventListener("mousemove", dragCircle);
});

document.addEventListener("mouseup", (e) => {
  document.removeEventListener("mousemove", dragCircle);
});
