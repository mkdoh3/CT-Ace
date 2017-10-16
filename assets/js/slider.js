$(document).ready(function(){

  // Set default of slider to autoplay
  $(".autoplay").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    dots: true
  });


  // Event listner for toggling autoplay
  $("#mainContent").on("dblclick", function(){
    var state = $("#mainContent").attr("data-state");

    if(state == "true"){
      $(".autoplay").slick("slickPause");
      $("#mainContent").attr("data-state", "false");
      console.log("yes");
    }

    if(state == "false") {
      $(".autoplay").slick("slickPlay");
      $("#mainContent").attr("data-state", "true");
      console.log("no");

    }

  }); // End of Event listner

});
