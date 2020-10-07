import firebase from "@firebase/app";
import "@firebase/firestore";

import App from "./App.svelte";

const firebaseConfig = {
  apiKey: __sspp.env.FIREBASE_API_KEY,
  authDomain: __sspp.env.FIREBASE_AUTH_DOMAIN,
  projectId: __sspp.env.FIREBASE_PROJECT_ID,
  storageBucket: __sspp.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: __sspp.env.FIREBASE_MESSAGING_SENDING_ID,
  appId: __sspp.env.FIREBASE_APP_ID,
};

const firebaseApp = firebase.default.initializeApp(firebaseConfig);

const app = new App({
  target: document.body,
  props: {
    firestore: firebaseApp.firestore(),
  },
});

export default app;
