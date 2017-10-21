const resetModal = "<div class='modal-dialog'><div class='modal-content'><div class='modal-header' id='modalText'><h3>Please Enter Zip Code for Weather Updates</h3></div><div class='modal-body'><form role='form'><div class='form-group' id='dropDowns'><input type='text' class='form-control' id='zipCode' placeholder='6-digit zip'></div><button class='btn btn-default btn-block' id='nextBtn'>Next</button></form></div></div></div>"

const validZips = ["60007", "60018", "60068", "60076", "60077", "60106", "60131", "60171", "60176", "60189", "60201", "60202", "60301", "60302", "60304", "60305", "60406", "60419", "60440", "60453", "60456", "60459", "60501", "60504", "60515", "60517", "60532", "60540", "60555", "60563", "60564", "60565", "60585", "60601", "60602", "60603", "60604", "60605", "60606", "60607", "60608", "60609", "60610", "60611", "60612", "60613", "60614", "60615", "60616", "60617", "60618", "60619", "60620", "60621", "60622", "60623", "60624", "60625", "60626", "60628", "60629", "60630", "60631", "60632", "60633", "60634", "60635", "60636", "60637", "60638", "60639", "60640", "60641", "60642", "60643", "60644", "60645", "60646", "60647", "60649", "60651", "60652", "60653", "60654", "60655", "60656", "60657", "60659", "60660", "60661", "60666", "60674", "60690", "60699", "60706", "60707", "60712", "60714", "60803", "60804", "60805", "60827"
]




const config = {
    apiKey: "AIzaSyBoDzxA09zepIWCD9INLvERA63qHwd_oZ4",
    authDomain: "ct-ace.firebaseapp.com",
    databaseURL: "https://ct-ace.firebaseio.com",
    projectId: "ct-ace",
    storageBucket: "ct-ace.appspot.com",
    messagingSenderId: "310061683501"
}; //Mike's firebase

// const config = {
//     apiKey: "AIzaSyCivRfgDQux9l4K9QGWsNuMnDy-zD0QAaw",
//     authDomain: "cta-dash.firebaseapp.com",
//     databaseURL: "https://cta-dash.firebaseio.com",
//     projectId: "cta-dash",
//     storageBucket: "",
//     messagingSenderId: "195672621360"
//   };//Dennis' firebase

firebase.initializeApp(config);

const database = firebase.database();

var currentUserRef;
let currentUserID;
let currentUser;
let userName;
let userPreferences = {};


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUserID = user.uid
        currentUserRef = firebase.database().ref("users/" + currentUserID);
        currentUserRef.once("value")
            .then(function (snapshot) {
                currentUser = snapshot.val();
                console.log('currentUser', currentUser);
                userName = currentUser.displayName;
                main();
                if (currentUser.newUser === true) {
                    $("#welcomeUser").html("Welcome " + currentUser.displayName + "!");
                    $("#input-modal").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                }
            })

    } else {
        window.location = "index.html"; //redirect if not logged in
    }
});



function main() {
    $(document).ready(function () {
        quoteGenerator();

        function setTimer(nSeconds) {
            let timer = setInterval(function () {
                updateWeather();
                updateArrivals();
            }, nSeconds * 1000);
        }

        function getBusInfo() {
            let busInfo = currentUser.preferences.busInfo
            //            database.ref("users").child(currentUserID).child("preferences").on("value", function (snapshot) {
            //                busInfo = snapshot.val().busInfo;
            if (busInfo === undefined) {
                return null;
            }

            return busInfo;
            // return busInfo;
            //should return the busInfo portion of the user's stored preferences (an object)
        }

        function refreshArrivals(predictions) {
            console.log(predictions);
            getTime();
            $("#arrivalTable").empty();
            if ((predictions[0]) === "error") {
                // console.log("error = ", predictions[1][0].msg);
                let emptyCol = $("<td>");
                let errorCol = $("<td>").html(predictions[1][0].msg);
                let errorRow = $("<tr>").append(errorCol).append(emptyCol);
                let stopName = (predictions[2].stpnm);
                let routeNumber = (predictions[2].routeNumber);
                $("#arrivalTable").append(errorRow);
                $("#stopInfo").html(stopName);
                $("#busNumber").html("Route# " + routeNumber);
                return;
            }
            let stopName = predictions[0].stpnm;
            let routeNumber = predictions[0].rt;
            let direction = predictions[0].rtdir;
            let destination = predictions[0].des;
            predictions.forEach(function (prediction) {
                let time = (prediction.prdctdn === "DUE") ? "Arriving" : prediction.prdctdn + " min";
                time = (prediction.dly) ? "Delayed" : time;
                let delay = prediction.dly;
                let vehicleId = prediction.vid;
                var row = $("<tr>");
                var arrivalCol = $("<td class='busArrivalTime'>").html(time);
                var vidAndDest = $("<span class='vehicleId'>#" + vehicleId + "</span><br><span class='destination'>" + direction + " to " + destination + "</span>");
                var destinationCol = $("<td class = 'busDestinationAndNumber'>").html(vidAndDest);
                $(row).append(destinationCol).append(arrivalCol);
                $("#arrivalTable").append(row);
            });
            $("#stopInfo").html(stopName);
            $("#busNumber").html("Route #" + routeNumber);
        }

        function updateArrivals() {
            let busInfo = getBusInfo();
            if (busInfo === undefined) {
                // console.log("busInfo undefined");
                return;
            }
            let routeNumber = busInfo.routeNumber;
            let stopId = busInfo.stopId;
            return BusTrackerModule.getPredictions(routeNumber, stopId, refreshArrivals);
        }

        $(document).on("click", "#nextBtn", function (e) {
            e.preventDefault();
            if (validZips.indexOf($("#zipCode").val()) > -1) {
                userPreferences.zipCode = $("#zipCode").val();
                //add code to modify display name here?
                //ask if they want to use default? 
                collectBusData();

            } else {
                $("#modalText").empty()
                    .html("Please Enter A Valid Chicago Area Zip Code")

            }
        });

        $("#changeSettingsCog").on("click", function () {
            $("#input-modal").empty()
                .append(resetModal)
                .modal();
        });

        function collectBusData() {
            $("#nextBtn").hide()
            return BusTrackerModule.getPrefs(updatePreferences);
        }

        function updatePreferences(response) {
            userPreferences.busInfo = response;
        }

        $(document).on("click", "#submitBtn", function () {
            $("#input-modal").modal("toggle")
            currentUserRef.update({
                newUser: false
            });
            database.ref("users").child(currentUserID).child("preferences").set(userPreferences);
            currentUserRef.once("value")
                .then(function (snapshot) {
                    currentUser = snapshot.val();
                    updateArrivals();
                    updateWeather();
                    updateNews();
                    setTimer(30);
                });

        })

        //    --- Greetings Function  --- //
        ////////// Function for determinng the time of the day //////////////////////

        function getTime() {
            var name = userName;
            var data = [
				[22, 'Working late,'],
				[18, 'Good evening,'],
				[12, 'Good afternoon,'],
				[5, 'Good morning,'],
				[0, 'Go to bed,']
			]

            let hr = new Date().getHours();

            for (var i = 0; i < data.length; i++) {
                if (hr >= data[i][0]) {
                    //                    if ($(window).width() < 376) {
                    //                        $("#greeting-div").html(data[i][1] + "<br>" + name + "!");
                    //                    } else {
                    $("#greeting-div").html("<p>" + data[i][1] +
                        "</p>&nbsp<p>" + name + "!</p");
                    break;
                    //                    }

                }
            }
        }
        getTime();


        // --- Quote Generator -- //

        function quoteGenerator() {
            var url = "https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous&count=1";


            $.ajax({
                url: url,
                method: 'GET',
                headers: {
                    'X-Mashape-Key': 'a1BCkvQWslmshGKud614cQI6JbRyp1DVOZNjsnsNfaVOrdTSuU'
                },
            }).done(function (data) {
                var quote = data.quote;
                var author = data.author;
                $("#quote-content").append(quote);
                $("#quote-author").append(author);
            }).fail(function (err) {
                throw err;
            });
        }

        if (currentUser.newUser === false) {
            updateArrivals();
            updateWeather();
            updateNews();
            setTimer(30);
        }
    }) //end of long $(document).ready
} //end of main
