let needle;
let arcLeft;
let arcRight;
let compassDisc;
let compassHeadings;
let heading;

/***********/
function setRotationValue(event) {
  window.requestAnimationFrame(() => {
    needle.setAttribute("transform", `rotate(${event.target.value})`);
  });
}

/***********/
function setDangerAngle(event) {
  const deg = +event.target.value;
  const x = -180.0 * Math.sin((deg * Math.PI) / 180.0);
  const y = -180.0 * Math.cos((deg * Math.PI) / 180.0);

  arcLeft.setAttribute("d", `M${x} ${y} A180 180 0 0 1 -61.56 -169.14`);

  arcRight.setAttribute("d", `M61.56 -169.14 A180 180 0 0 1 ${-x} ${y}`);
}

/***********/
addEventListener("load", function(e) {
  needle = document.querySelector(".needle");

  arcLeft = document.querySelector(".arc.left");

  arcRight = document.querySelector(".arc.right");

  compassDisc = document.querySelector("#compass-disc");

  compassHeadings = document.querySelectorAll("#compass-headings text");

  heading = document.querySelector("#heading");

  console.log(compassHeadings.length);

  /*setRotationValue({target:document.querySelector(".direction-input")})

setDangerAngle({target:document.querySelector(".danger-input")})*/
});

/***********/
addEventListener("deviceorientation", function(event) {
  const headingValue = event.webkitCompassHeading;

  compassDisc.setAttribute("transform", `rotate(-${headingValue})`);

  compassHeadings.forEach((heading, i) =>
    heading.setAttribute(
      "transform",
      `rotate(${i * 30}) rotate(${-(i * 30 - headingValue)},0,140)`
    )
  );

  heading.innerHTML = `${headingValue | 0}&deg;`;
});
