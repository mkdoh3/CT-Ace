


    function setup() {
     var canvas = createCanvas(400, 400);
      angleMode(DEGREES);
      canvas.parent('clock');
      $("#defaultCanvas0").css({"height": "100%", "width":"50%"}).addClass("center")
    }


    function draw() {
      clear();
      translate(200, 200);
      rotate(-90);

      let hr = hour();
      let mn = minute();
      let sc = second();

      strokeWeight(8);
      stroke(79, 183, 31);
      noFill();
      let secondAngle = map(sc, 0, 60, 0, 360);
      arc(0, 0, 300, 300, 0, secondAngle);

      stroke(2, 196, 255);
      let minuteAngle = map(mn, 0, 60, 0, 360);
      arc(0, 0, 280, 280, 0, minuteAngle);

      stroke(255, 199, 0);
      let hourAngle = map(hr % 12, 0, 12, 0, 360);
      arc(0, 0, 260, 260, 0, hourAngle);

      push();
      rotate(secondAngle);
      stroke(79, 183, 31)
      line(0, 0, 100, 0);
      pop();

      push();
      rotate(minuteAngle);
      stroke(2, 196, 255);
      line(0, 0, 75, 0);
      pop();

      push();
      rotate(hourAngle);
      stroke(255, 199, 0);
      line(0, 0, 50, 0);
      pop();

      stroke(255);
      point(0, 0);


    //   fill(255);
    //   noStroke();
    //   text(hr + ':' + mn + ':' + sc, 10, 200);


    }
