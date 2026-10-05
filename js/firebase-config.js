/* =================================================================
   Firebase configuration — Ezinne & Chigozie Wedding Prototype
   ----------------------------------------------------------------
   1. Go to https://console.firebase.google.com → Add project
   2. In the project: Build → Firestore Database → Create database
   3. Project settings (gear icon) → Your apps → Web (</>) → Register
   4. Copy the firebaseConfig values into the placeholders below
   5. Paste the rules from firestore.rules into
      Firestore → Rules → Publish
================================================================= */

(function () {
  "use strict";

//  var firebaseConfig = {
//   apiKey: "YOUR_API_KEY", // See instructions below to retrieve this
//   authDomain: "ezichi2026.firebaseapp.com",
//   projectId: "ezichi2026",
//   storageBucket: "ezichi2026.appspot.com",
//   messagingSenderId: "349447907893",
//   appId: "YOUR_APP_ID" // Unique to your registered Web App
// };

var firebaseConfig = {
  apiKey: "AIzaSyCuPbJr2mfPkk8VEb6XkPPXf3FaxAGfaWE",
  authDomain: "ezichi2026.firebaseapp.com",
  projectId: "ezichi2026",
  storageBucket: "ezichi2026.firebasestorage.app",
  messagingSenderId: "349447907893",
  appId: "1:349447907893:web:978654096020ea255d9f7c",
  measurementId: "G-B2HVFSTYMK"
};

  window.WED_FIREBASE_READY = false;

  var configured =
    firebaseConfig.apiKey.indexOf("YOUR_") === -1 &&
    firebaseConfig.projectId.indexOf("YOUR_") === -1;

  try {
    if (typeof firebase !== "undefined" && configured) {
      firebase.initializeApp(firebaseConfig);
      window.WED_FIREBASE_READY = true;
    } else if (!configured) {
      console.warn(
        "[wedding] Firebase is not configured yet — edit js/firebase-config.js with your project values."
      );
    }
  } catch (e) {
    console.error("[wedding] Firebase failed to initialise:", e);
  }
})();