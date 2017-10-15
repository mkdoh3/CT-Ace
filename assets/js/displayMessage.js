$(document).ready(function() {
//////////// Function for determinng the time of the day //////////////////////

var name = "Ryan";
function getTime(){
console.log("displayMessage Function is Running");

var data = [
  [22, 'Working late'],
  [18, 'Good evening'],
  [12, 'Good afternoon'],
  [5,  'Good morning'],
  [0,  'Whoa, early bird']
]

hr = new Date().getHours();

for (var i = 0; i < data.length; i++) {
    if (hr >= data[i][0]) {
        var displayMessage = $("<div>").addClass("center")
        displayMessage.html(data[i][1]+ " "+name);
        $(".greeting").html(displayMessage)
        break;
    }
}

}

getTime();

});
