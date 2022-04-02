<script lang="ts">
  import { initFirebase } from "$lib/firebase";
  import "../app.css";

  const squareEndpointUrl = import.meta.env
    .VITE_SQUARE_PAYMENT_ENDPOINT as string;

  initFirebase({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env
      .VITE_FIREBASE_MESSAGING_SENDING_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
  });
</script>

<svelte:head>
  <script type="text/javascript" src={squareEndpointUrl}></script>
</svelte:head>

<slot />
