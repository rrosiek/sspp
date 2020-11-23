<script>
  // import PurchaseForm from "./PurchaseForm.svelte";
  // import ThankYou from "./ThankYou.svelte";
  import ThankYouYearEnd from "./ThankYouYearEnd.svelte";
  // import Welcome from "./Welcome.svelte";

  export let firestore;

  // let email;
  let page = "yearend";

  /*
  const squareEndpointUrl = __sspp.env.SQUARE_PAYMENT_ENDPOINT;

  const handlePurchaseNavigate = () => {
    page = "purchase";
    window.scrollTo(0, 0);
  };

  const handlePurchaseSuccess = (event) => {
    email = event.detail.email;
    page = "thankyou";
    window.scrollTo(0, 0);
  };
  */
</script>

<svelte:head>
  <!--<script type="text/javascript" src={squareEndpointUrl}> -->
  <!-- </script>-->
</svelte:head>

<main>
  <header class="mb-2 px-4 bg-christmas-red">
    <div class="max-w-6xl mx-auto mb-2 pb-2 px-4 xl:w-2/3">
      <picture>
        <source srcset="/header.webp 1x" type="image/webp" />
        <source srcset="/header.png 1x" type="image/png" />
        <img
          src="/header.png"
          alt="Welcome to SSPP 2020 Christmas Raffle"
          title="SSPP Raffle Header" />
      </picture>
      <img
        class="mx-auto mb-2 w-2/3"
        src="/horizontal_seperator.png"
        alt="Gold bar separator"
        title="Horizontal separator" />
    </div>
  </header>
  <div class="h-2 bg-christmas-gold" />
  {#if page === 'welcome'}
    <!-- <Welcome on:buyTickets={handlePurchaseNavigate} /> -->
    <div />
  {:else if page === 'purchase'}
    <!-- <PurchaseForm {firestore} on:purchaseSuccess={handlePurchaseSuccess} /> -->
    <div />
  {:else}
    <!-- <ThankYou {email} /> -->
    <ThankYouYearEnd />
  {/if}
</main>
