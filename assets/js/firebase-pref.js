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
let userPreferences = {};


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUserID = user.uid
        currentUserRef = firebase.database().ref("users/" + currentUserID);
        currentUserRef.once("value")
            .then(function (snapshot) {
                currentUser = snapshot.val()
                if (currentUser.newUser === true || currentUser.newUser === false) {
                    $("#input-modal").modal();
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

    $("#nextBtn").on("click", function (e) {
        e.preventDefault();
        console.log("#preferencesSubmit clicked");
        userPreferences.zipCode = $("#zipCode").val();
        //         currentUserRef.update(userPreferences) 
        collectBusData();

    });

    $("#changeSettingsCog").on("click", function () {
        console.log("cog click");
        $("#input-modal").modal();
    });

    function updatePreferences(response) {

        console.log(response);
        //this function needs to store the user's bus route-related preferences in firebase
    }

    function collectBusData() {
        console.log('collectBusData() called.');

        $("#nextBtn").hide()
        return BusTrackerModule.getPrefs(updatePreferences);
    }




})






// Write the new post's data simultaneously in the posts list and the user's post list.
//var updates = {};
//updates['/posts/' + newPostKey] = postData;
//updates['/user-posts/' + uid + '/' + newPostKey] = postData;
//
//return firebase.database().ref().update(updates);



//capture information from new user modal, store in current user object and push the object back up to firebase
