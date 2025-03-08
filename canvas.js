(function() {
  let canvas, ctx, drawing_active = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false,
    movement_count = 0;

  let colour = "black",
    line_width = 5;

  function init() {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height; 

    canvas.addEventListener("mousemove", function (e) {
      findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
      findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
      findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
      findxy('out', e)
    }, false);

    canvas.addEventListener("touchmove", function (e) {
      findxy('move', e)
    }, false);
    canvas.addEventListener("touchstart", function (e) {
      findxy('down', e)
    }, false);
    canvas.addEventListener("touchend", function (e) {
      findxy('up', e)
    }, false);
    canvas.addEventListener("touchcancel", function (e) {
      findxy('out', e)
    }, false);

    document.querySelector(".clear-button").addEventListener("click", erase);
    save();
    console.log("init complete",canvas);
  }

  function color(obj) {
    switch (obj.id) {
      case "green":
        colour = "green";
        break;
      case "blue":
        colour = "blue";
        break;
      case "red":
        colour = "red";
        break;
      case "yellow":
        colour = "yellow";
        break;
      case "orange":
        colour = "orange";
        break;
      case "black":
        colour = "black";
        break;
      case "white":
        colour = "white";
        break;
    }
    if (x == "white") line_width = 14;
    else line_width = 5;

  }

  function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = colour;
    ctx.lineWidth = line_width;
    ctx.stroke();
    ctx.closePath();
    save();
  }

  function erase() {
    //var m = confirm("Want to clear");
    if (true) {
      ctx.clearRect(0, 0, w, h);
      //document.getElementById("canvasimg").style.display = "none";
    }
    save();
  }

  function save() {
    var dataURL = canvas.toDataURL();
    storage.setItem("data-url", dataURL);
    /*
        document.getElementById("canvasimg").style.border = "2px solid";
        document.getElementById("canvasimg").src = dataURL;
        document.getElementById("canvasimg").style.display = "inline";
        */
  }

  function findxy(res, e) {
    if (res == 'down') {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;

      drawing_active = true;
      dot_flag = false;
      if (dot_flag) {
        ctx.beginPath();
        ctx.fillStyle = colour;
        ctx.fillRect(currX, currY, 2, 2);
        ctx.closePath();
        dot_flag = false;
      }
      movement_count = 0;
    }
    if (res == 'up' || res == "out") {
      drawing_active = false;
      movement_count = 0;
    }
    if (res == 'move') {
      if (drawing_active) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;
        let dist = Math.sqrt((currX - prevX)**2 + (currY - prevY)**2)

        if (movement_count < 5 && dist > 15) return;

        draw();
      }
      movement_count += 1;
    }
  }

  setTimeout(init, 50);
})();
