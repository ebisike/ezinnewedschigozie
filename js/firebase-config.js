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

  var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
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