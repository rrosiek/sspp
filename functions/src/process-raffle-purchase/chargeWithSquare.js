const functions = require("firebase-functions");
const crypto = require("crypto");
const SquareConnect = require("square-connect");

module.exports = async (purchaseSnap) => {
  let response;
  const idempotencyKey = crypto.randomBytes(22).toString("hex");
  const purchase = purchaseSnap.data();
  const squareAccessToken = functions.config().square.token;
  const squareBasePath = functions.config().square.base_path;
  const squareClient = SquareConnect.ApiClient.instance;
  const squareOauth2 = squareClient.authentications["oauth2"];
  const ticketCost = functions.config().raffle.ticket_cost;

  squareClient.basePath = squareBasePath;
  squareOauth2.accessToken = squareAccessToken;

  const paymentsApi = new SquareConnect.PaymentsApi();

  const amount =
    purchase.ticketsPurchased * ticketCost + (purchase.ccDonate ? 200 : 0);

  const payload = {
    source_id: purchase.squarePurchase.nonce,
    amount_money: {
      amount,
      currency: "USD",
    },
    idempotency_key: idempotencyKey,
    buyer_email_address: purchase.email,
  };

  try {
    response = await paymentsApi.createPayment(payload);
  } catch (error) {
    console.error(error.response.text);

    throw error;
  }

  const tempResp = JSON.stringify(response);

  await purchaseSnap.ref.update({
    createdAt: new Date(),
    squarePurchase: JSON.parse(tempResp),
  });

  return JSON.parse(tempResp);
};
