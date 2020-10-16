<script>
  import { createEventDispatcher, onMount } from "svelte";
  import * as yup from "yup";

  import Form from "./components/Form.svelte";
  import Footer from "./components/Footer.svelte";
  import states from "./states";

  export let firestore;

  const dispatch = createEventDispatcher();
  const ticketCost = 4000;
  let cardError = false;
  let ccDonate = false;
  let loading = false;
  let purchasePayload = {};
  let ticketCount = 1;

  $: ticketCostTotal = ticketCount * ticketCost + (ccDonate ? 200 : 0);

  const moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const schema = yup.object().shape({
    ticketsPurchased: yup.number().integer().required().positive().lessThan(50),
    referringFamily: yup.string().max(250).trim(),
    name: yup.string().required().min(3).max(250).trim(),
    address: yup.string().required().min(3).max(250).trim(),
    city: yup.string().required().min(3).max(250).trim(),
    state: yup.mixed().oneOf(states.map((s) => s.value)),
    zipCode: yup.string().matches(/[0-9]{5}/),
    email: yup.string().required().email(),
    phone: yup.string().matches(/[0-9]{3}-[0-9]{3}-[0-9]{4}/),
  });

  const paymentForm = new SqPaymentForm({
    applicationId: __sspp.env.SQUARE_APP_ID,
    card: {
      elementId: "sq-card",
    },
    callbacks: {
      cardNonceResponseReceived: async (errors, nonce, cardData) => {
        if (errors) return;

        cardData.nonce = nonce;

        await firestore.collection("raffle_purchases").add({
          address: purchasePayload.address,
          ccDonate: purchasePayload.ccDonate === "on",
          city: purchasePayload.city,
          email: purchasePayload.email,
          name: purchasePayload.name,
          phone: purchasePayload.phone,
          referringFamily: purchasePayload.referringFamily,
          squarePurchase: cardData,
          state: purchasePayload.state,
          ticketsPurchased: +purchasePayload.ticketsPurchased,
          zipCode: purchasePayload.zipCode,
        });

        loading = false;
        dispatch("purchaseSuccess", purchasePayload);
      },
    },
  });

  const handleSubmit = (event) => {
    loading = true;
    purchasePayload = event.detail;
    paymentForm.requestCardNonce();
  };

  const handleTicketIncrease = () => {
    ticketCount = ticketCount + 1;
  };

  const handleTicketDecrease = () => {
    if (ticketCount > 1) {
      ticketCount = ticketCount - 1;
    }
  };

  onMount(() => {
    paymentForm.build();
  });
</script>

<svelte:head>
  <title>SSPP Cash Raffle :: Purchase Tickets</title>
</svelte:head>

<section class="max-w-3xl mx-auto text-center text-christmas-dark-red">
  <div class="my-6 sm:my-10 leading-8">
    Thank you for supporting our school community. Together we can help our
    students, teachers, and staff achieve greatness today, tomorrow, and in the
    days to come.
  </div>
</section>

<Form on:validated={handleSubmit} {schema} let:hasError>
  <div class="my-4">
    <label
      for="ticketsPurchased"
      class="block font-medium leading-5 text-gray-700">
      Number of Tickets
    </label>
    <div class="mt-1 grid grid-cols-6 gap-4">
      <div class="col-start-1 col-end-3 rounded-md shadow-sm">
        <input
          bind:value={ticketCount}
          id="ticketsPurchased"
          name="ticketsPurchased"
          class="text-center text-2xl form-input px-2 py-3 block w-full border rounded-md focus:border-green-400 transition duration-150 ease-in-out sm:leading-5"
          type="number"
          min="1"
          max="50" />
      </div>
      <div
        class="col-span-2 text-red-600 text-sm {hasError('ticketsPurchased') ? 'block' : 'hidden'}">
        Please enter a valid ticket number.
      </div>
      <button
        on:click={handleTicketIncrease}
        class="col-start-5 inline-flex justify-center items-center bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-indigo active:bg-green-700 transition ease-in-out duration-150 rounded-md shadow-md"
        type="button"><svg
          class="w-8 h-8 text-gray-100"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></button>
      <button
        on:click={handleTicketDecrease}
        class="inline-flex justify-center items-center bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-indigo active:bg-green-700 transition ease-in-out duration-150 rounded-md shadow-md"
        type="button"><svg
          class="w-6 h-6 text-gray-100"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 12H4" /></svg></button>
    </div>
  </div>
  <div class="my-4">
    <label
      for="referringFamily"
      class="block font-medium leading-5 text-gray-700">
      Referring Family
    </label>
    <div class="mt-1 rounded-md shadow-sm">
      <input
        id="referringFamily"
        name="referringFamily"
        class="form-input px-2 py-4 block w-full border rounded-md focus:border-green-400 transition duration-150 ease-in-out sm:leading-5" />
    </div>
    <div class="text-sm text-gray-500">
      If purchasing tickets from a specific family, please enter their last name
      to credit the sale.
    </div>
  </div>
  <h3 class="mt-4 sm:mt-8 mb-2 sm:mb-4 text-xl tracking-wide">
    Your Information
  </h3>
  <div class="my-4">
    <label for="name" class="block font-medium leading-5 text-gray-700">
      Name
    </label>
    <div class="mt-1 rounded-md shadow-sm">
      <input
        id="name"
        name="name"
        class="form-input px-2 py-4 block w-full border rounded-md focus:border-green-400 transition duration-150 ease-in-out sm:leading-5" />
    </div>
    <div
      class="mt-1 text-red-600 text-sm {hasError('name') ? 'block' : 'hidden'}">
      Your name is required.
    </div>
  </div>
  <div class="my-4">
    <label for="address" class="block font-medium leading-5 text-gray-700">
      Mailing Street Address
    </label>
    <div class="mt-1 rounded-md shadow-sm">
      <input
        id="address"
        name="address"
        class="form-input px-2 py-4 block w-full border rounded-md focus:border-green-400 transition duration-150 ease-in-out sm:leading-5" />
    </div>
    <div
      class="mt-1 text-red-600 text-sm {hasError('address') ? 'block' : 'hidden'}">
      Your mailing address is required.
    </div>
  </div>
  <div class="my-4 grid grid-cols-6 gap-2">
    <div class="col-span-3">
      <label for="city" class="block font-medium leading-5 text-gray-700">
        City
      </label>
      <div class="mt-1 rounded-md shadow-sm">
        <input
          id="city"
          name="city"
          class="form-input px-2 py-4 block w-full border rounded-md focus:border-green-400 transition duration-150 ease-in-out sm:leading-5" />
      </div>
      <div
        class="mt-1 text-red-600 text-sm {hasError('city') ? 'block' : 'hidden'}">
        Your city is required.
      </div>
    </div>
    <div class="col-span-2">
      <label for="state" class="block font-medium leading-5 text-gray-700">
        State
      </label>
      <div class="mt-1 rounded-md shadow-sm">
        <select
          id="state"
          name="state"
          class="form-select px-2 py-4 block w-full border rounded-md focus:border-green-400 transition duration-150 ease-in-out sm:leading-5">
          {#each states as { label, value }}
            <option {value} selected={value === 'NY'}>
              {label.toUpperCase()}
            </option>
          {/each}
        </select>
      </div>
      <div
        class="mt-1 text-red-600 text-sm {hasError('state') ? 'block' : 'hidden'}">
        State is required.
      </div>
    </div>
    <div>
      <label for="state" class="block font-medium leading-5 text-gray-700">
        Zip Code
      </label>
      <div class="mt-1 rounded-md shadow-sm">
        <input
          id="zipCode"
          name="zipCode"
          class="form-input px-2 py-4 block w-full border rounded-md focus:border-green-400 transition duration-150 ease-in-out sm:leading-5"
          type="number"
          maxlength="5" />
      </div>
      <div
        class="mt-1 text-red-600 text-sm {hasError('zipCode') ? 'block' : 'hidden'}">
        Zip code is required.
      </div>
    </div>
  </div>
  <div class="my-4 grid grid-cols-2 gap-2">
    <div>
      <label for="email" class="block font-medium leading-5 text-gray-700">
        E-Mail Address
      </label>
      <div class="mt-1 rounded-md shadow-sm">
        <input
          id="email"
          name="email"
          class="form-input px-2 py-4 block w-full border rounded-md focus:border-green-400 transition duration-150 ease-in-out sm:leading-5"
          type="email" />
      </div>
      <div
        class="mt-1 text-red-600 text-sm {hasError('email') ? 'block' : 'hidden'}">
        Valid e-mail address is required.
      </div>
    </div>
    <div>
      <label for="phone" class="block font-medium leading-5 text-gray-700">
        Phone Number
      </label>
      <div class="max-w-sm mt-1 rounded-md shadow-sm">
        <input
          id="phone"
          name="phone"
          class="form-input px-2 py-4 block w-full border rounded-md focus:border-green-400 transition duration-150 ease-in-out sm:leading-5"
          type="tel" />
      </div>
      <div class="text-sm text-gray-500">716-555-1234</div>
      <div
        class="mt-1 text-red-600 text-sm {hasError('phone') ? 'block' : 'hidden'}">
        Valid phone number address is required.
      </div>
    </div>
  </div>
  <div class="flex justify-between items-center mt-4 sm:mt-8 mb-2 sm:mb-4">
    <h3 class="text-xl tracking-wide">Payment</h3>
    <div class="text-sm">
      Processing by
      <a
        href="https://squareup.com"
        target="_blank"
        class="text-green-800 hover:text-green-500">Square</a>
    </div>
  </div>
  <div id="sq-card" />
  <div class="mt-1 text-red-600 text-sm {cardError ? 'block' : 'hidden'}">
    There was a problem processing your card, please try again.
  </div>
  <div class="flex items-center my-6">
    <input
      bind:checked={ccDonate}
      id="ccDonate"
      name="ccDonate"
      type="checkbox"
      class="form-checkbox h-6 w-6 text-green-600 transition duration-150 ease-in-out" />
    <label for="donate" class="ml-2 block leading-5 text-gray-900">
      Donate
      <span class="font-bold">$2.00</span>
      to help cover credit card processing charges.
    </label>
  </div>
  <div class="mt-6 sm:mt-8 mb-2 sm:mb-4 text-xl tracking-wide">
    {#if !loading}
      <span class="block w-full rounded-md shadow-md">
        <button
          type="submit"
          class="w-full flex justify-center px-6 py-3 border border-transparent text-lg leading-6 font-semibold rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition ease-in-out duration-150">
          Pay
          {moneyFormatter.format(ticketCostTotal / 100)}
        </button>
      </span>
    {:else}
      <span class="block w-full rounded-md shadow-md">
        <div
          class="w-full flex justify-center px-6 py-3 border border-transparent text-lg leading-6 font-semibold rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition ease-in-out duration-150">
          <svg class="animate-spin h-6 w-6" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              stroke-width="4" />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </span>
    {/if}
  </div>
</Form>

<Footer />
