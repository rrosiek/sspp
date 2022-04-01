<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import * as yup from "yup";
  import states from "$lib/states";

  const dispatch = createEventDispatcher();
  const ticketCost = 5000;
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
    phone: yup.string().matches(/^\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4}$/),
  });

  const paymentForm = new SqPaymentForm({
    applicationId: __sspp.env.SQUARE_APP_ID,
    card: {
      elementId: "sq-card",
      inputStyle: {
        backgroundColor: "#fefefe",
        borderRadius: "2px",
        fontFamily: "futura",
        placeholderFontWeight: 200,
        details: {
          color: "#eeeeee",
          fontFamily: "futura",
          fontSize: "14px",
          error: {
            color: "#9b2c2c",
          },
        },
      },
    },
    callbacks: {
      cardNonceResponseReceived: async (errors, nonce, cardData) => {
        if (errors) return;
        cardData.nonce = nonce;
        await firestore.collection("raffle_purchases").add({
          address: purchasePayload.address,
          ccDonate,
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

<section class="bg-mr-green text-gray-100">
  <div class="max-w-6xl mx-auto py-6 px-4 lg:py-8 xl:w-2/3">
    <div
      class="font-display font-medium tracking-wide text-4xl text-center text-mr-gold uppercase mb-3"
    >
      Purchase Tickets
    </div>
  </div>
</section>
