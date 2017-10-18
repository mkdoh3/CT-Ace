const resetModal = "<div class='modal-dialog'><div class='modal-content'><div class='modal-header' id='modalText'><h3>Please Enter Zip Code for Weather Updates</h3></div><div class='modal-body'><form role='form'><div class='form-group' id='dropDowns'><input type='text' class='form-control' id='zipCode' placeholder='6-digit zip'></div><button class='btn btn-default btn-block' id='nextBtn'>Next</button></form></div></div></div>"

const config = {
    apiKey: "AIzaSyBoDzxA09zepIWCD9INLvERA63qHwd_oZ4",
    authDomain: "ct-ace.firebaseapp.com",
    databaseURL: "https://ct-ace.firebaseio.com",
    projectId: "ct-ace",
    storageBucket: "ct-ace.appspot.com",
    messagingSenderId: "310061683501"
};
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
                userName = currentUser.displayName;
                console.log("user fb reference: ", currentUserRef)
                console.log("user fb ID: ", currentUserID)
                console.log("user fb object: ", currentUser)
                console.log("user display name: ", userName)
                if (currentUser.newUser === true) {
                    $("#input-modal").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    currentUserRef.update({
                        newUser: false
                    });
                } else {
                    console.log("currentUser, new user false", currentUser);
                }
            })
        //else statement in case a user isnt logged in??
    }
});



$(document).ready(function () {

    console.log("made it this far...");

    $(document).on("click", "#nextBtn", function (e) {
        e.preventDefault();
        console.log("#preferencesSubmit clicked");
        userPreferences.zipCode = $("#zipCode").val();

        //         currentUserRef.update(userPreferences) 
        collectBusData();

    });

    $("#changeSettingsCog").on("click", function () {
        console.log("cog click");
        $("#input-modal").empty()
            .append(resetModal)
            .modal({
                backdrop: 'static',
                keyboard: false
            });
    });






    function updatePreferences(response) {
        console.log(response);
        userPreferences.busInfo = response;
        console.log(userPreferences);
        //this function needs to store the user's bus route-related preferences in firebase
    }

    function collectBusData() {
        console.log('collectBusData() called.');

        $("#nextBtn").hide()
        return BusTrackerModule.getPrefs(updatePreferences);
    }

    $(document).on("click", "#submitBtn", function () {
        $("#input-modal").modal("toggle")
        //***this might be a bad idea!**//
        //is it easiest to reload/remake our calls after all the prefs are saved/updated.. it kinda looks bad?
        location.reload();
        console.log("submit click")
        database.ref("users").child(currentUserID).child("preferences").set(userPreferences)

    })

})


//    --- Greetings Function  --- //

$(document).ready(function () {
    ////////// Function for determinng the time of the day //////////////////////


    function getTime() {
        var name = currentUser;
        console.log("displayMessage Function is Running");

        var data = [
  [22, 'Working late, '],
  [18, 'Good evening, '],
  [12, 'Good afternoon, '],
  [5, 'Good morning, '],
  [0, 'Go to bed, ']
]

        let hr = new Date().getHours();

        for (var i = 0; i < data.length; i++) {
            console.log(i);
            if (hr >= data[i][0]) {

                $("#greeting-div").text(data[i][1] + name + "!");
                break;
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
            console.log(data);
            var quote = data.quote;
            console.log(quote);
            var author = data.author;
            console.log(author);
            $("#quote-content").append(quote);
            $("#quote-author").append(author);
        }).fail(function (err) {
            throw err;
        });

    }
    quoteGenerator();





});
