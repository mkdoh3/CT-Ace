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

const database = firebase.database()



const uiConfig = {
    signInSuccessUrl: 'dashboard.html',
    signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  //          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//            firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
//          firebase.auth.PhoneAuthProvider.PROVIDER_ID
        ],
    // Terms of service url.
    tosUrl: '<your-tos-url>'
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);


firebase.auth().onAuthStateChanged(function () {
    var user = firebase.auth().currentUser;
    console.log('user', user);
    currentUserID = user.uid
    console.log("currentUserID = ", currentUserID);
    if (user != null) {
        database.ref("users").child(user.uid).set({
            email: user.email,
            displayName: user.displayName,
            newUser: true
        })
    }
})
