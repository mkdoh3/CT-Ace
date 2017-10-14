$(document).ready(function() {
  console.log("Clock is running");
  ////////////////////////// MomentJS Logic //////////////////////////////////////

  // Function to get Current Time
  // function currentTime(){
  //   //Grab the current TIME
  //   let timeVariable = moment().format('MMMM Do YYYY, h:mm:ss a');
  //   //Display current date and time on the document
  //   let timeHTML = $("<div>").addClass("center");
  //   timeHTML.html(timeVariable);
  //   $(".time").html(timeHTML).css("color", "yellow");
  // }

  // Updates the time on HTML
  // setInterval(currentTime, 1000);

  function time(){

    function updateClock(){
        var now = moment();
            second = now.seconds() * 6;
            minute = now.minutes() * 6 + second / 60;
            hour = ((now.hours() % 12) / 12) * 360 + 90 + minute / 12;

        $('#hour').css("transform", "rotate(" + hour + "deg)");
        $('#minute').css("transform", "rotate(" + minute + "deg)");
        $('#second').css("transform", "rotate(" + second + "deg)");
    }

    function timedUpdate () {
        updateClock();
        setTimeout(timedUpdate, 1000);
    }

    timedUpdate();
  };

  //////////////////////// End of Moment JS ///////////////////////////////////////

time();



});
