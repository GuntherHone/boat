(() => {
  const needle = document.querySelector(".needle");
  const arcLeft = document.querySelector(".arc.left");
  const arcRight = document.querySelector(".arc.right");
  const compassDisc = document.querySelector("#compass-disc");
  const compassHeadings = document.querySelectorAll("#compass-headings text");
  const heading = document.querySelector("#heading");

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
  addEventListener("deviceorientation", function(event) {
    const headingValue = event.webkitCompassHeading || 0;

    window.requestAnimationFrame(() => {
      compassDisc.setAttribute("transform", `rotate(-${headingValue})`);

      compassHeadings.forEach((heading, i) =>
        heading.setAttribute(
          "transform",
          `rotate(${i * 30}) rotate(${-(i * 30 - headingValue)},0,140)`
        )
      );

      heading.innerHTML = `${headingValue | 0}&deg;`;
    });
  });

  const ws = new WebSocket(`ws://${location.host}`);
  ws.onmessage = event => {
    let data = JSON.parse(event.data);
    window.requestAnimationFrame(() => {
      needle.setAttribute("transform", `rotate(${data.heading})`);
    });
  }

})();
