window.initialiseCanvas = function(query) {
  let canvas, ctx, drawing_active = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false,
    movement_count = 0
    strokes = [];

  query = query ?? "canvas";

  let colour = "black",
    line_width = 15;

  function init() {
    canvas = document.querySelector(query);
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

    document.querySelector(".clear-button").addEventListener("click", clear);
    document.querySelector(".undo-button").addEventListener("click", undo);
    save();
    console.log("init complete",canvas);
  }

  function checkCanvasExists() {
    if (!canvas) {
      console.log("Didn't find canvas, going to try reinitialising...");
      init();
    }
  }

  setInterval(checkCanvasExists, 500);

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

  function draw(stroke) {
    /*
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = colour;
    ctx.lineWidth = line_width;
    ctx.stroke();
    ctx.closePath();
    save();
    */
    ctx.beginPath();
    stroke = stroke ?? strokes[strokes.length - 1]
    let initial_point = stroke[0];
    ctx.strokeStyle = colour;
    ctx.lineWidth = line_width;
    ctx.moveTo(initial_point.x, initial_point.y);
    for (point of stroke) {
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
    save();
  }

  function smooth_stroke(stroke, depth) {
    depth = depth ?? 1;
    if (depth === 0) return stroke;

    let new_stroke = [stroke[0]];
    for (let [ix, point] of Array.from(stroke.entries()).slice(1)) {
      let prev_point = stroke[ix-1];
      new_stroke.push({
        x: prev_point.x * 2 / 3 + point.x / 3,
        y: prev_point.y * 2 / 3 + point.y / 3,
      });
      new_stroke.push({
        x: prev_point.x / 3 + point.x * 2 / 3,
        y: prev_point.y / 3 + point.y * 2 / 3,
      });
    }
    new_stroke.push(stroke[stroke.length - 1]);
    return smooth_stroke(new_stroke, depth - 1);
  }

  function smooth_draw() {
    erase();
    let last_stroke = strokes[strokes.length - 1]
    strokes[strokes.length - 1] = smooth_stroke(last_stroke, 2);
    strokes.forEach(draw);
  }

  function erase() {
    //var m = confirm("Want to clear");
    if (true) {
      ctx.clearRect(0, 0, w, h);
      //document.getElementById("canvasimg").style.display = "none";
    }
    save();
  }

  function undo() {
    erase();
    strokes.pop();
    smooth_draw();
  }

  function clear() {
    erase();
    strokes = [];
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
    let canvasRect = canvas.getBoundingClientRect();
    let touch_ev;
    if (e.touches !== undefined) {
      console.log("Touch event: ", e);
      touch_ev = e;
      console.log(e.touches.length);
      if (e.touches.length > 1) return;
      e = e.touches[0];
      console.log("Single touch: ", e);
      if (e === undefined) {
        res = "out";
      }
    }
    if (res !== "out" && (e.clientX < canvasRect.left || e.clientX > canvasRect.right || e.clientY < canvasRect.top || e.clientY > canvasRect.bottom)) {
      res = "out";
    } else if (touch_ev !== undefined && res !== "down") {
      console.log("Preventing default");
      touch_ev?.preventDefault();
    }
    if (res == 'down') {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvasRect.left;
      currY = e.clientY - canvasRect.top;

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

      strokes.push([]);
    }
    if (res == 'up' || res == "out") {
      drawing_active = false;
      movement_count = 0;
      smooth_draw();
    }
    if (res == 'move') {
      if (drawing_active) {
        strokes[strokes.length - 1]?.push(
          {
            x: (e.clientX - canvasRect.left) * canvas.width / canvasRect.width,
            y: (e.clientY - canvasRect.top) * canvas.height / canvasRect.height
          }
        );
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvasRect.left;
        currY = e.clientY - canvasRect.top;
        let dist = Math.sqrt((currX - prevX)**2 + (currY - prevY)**2)

        if (movement_count < 2 && dist > 20 && touch_ev === undefined) return;

        draw();
      }
      movement_count += 1;
    }
  }

  setTimeout(init, 50);
}
