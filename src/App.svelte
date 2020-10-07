<script>
  import PurchaseForm from "./PurchaseForm.svelte";
  import RaffleInfo from "./RaffleInfo.svelte";
  import ThankYou from "./ThankYou.svelte";

  export let firestore;

  let email;
  let formComplete = false;

  const handlePurchaseSuccess = (event) => {
    email = event.detail.email;
    formComplete = true;
  };
</script>

<main class="container mx-auto">
  <header class="my-4">
    <div class="flex flex-col items-center justify-center">
      <img
        src="/sspp_logo.png"
        alt="Church of SS. Peter and Paul graphic logo" />
      <div class="tracking-wide font-semibold text-4xl">
        <div>2020 Cash Raffle</div>
      </div>
    </div>
  </header>
  {#if !formComplete}
    <section class="max-w-xl mx-auto">
      <RaffleInfo />
    </section>
    <section class="my-4 max-w-xl mx-auto">
      <PurchaseForm {firestore} on:purchaseSuccess={handlePurchaseSuccess} />
    </section>
  {:else}
    <section class="max-w-xl mx-auto">
      <ThankYou {email} />
    </section>
  {/if}
</main>
