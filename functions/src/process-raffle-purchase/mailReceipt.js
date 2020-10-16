const AWS = require("aws-sdk");
const functions = require("firebase-functions");
const emailTemplate = require("../email-templates/raffle-purchase-receipt");

module.exports = async (purchaseId, purchase, squareCharge) => {
  AWS.config.update({
    credentials: new AWS.Credentials(
      functions.config().aws.ses_key,
      functions.config().aws.ses_secret
    ),
    region: "us-east-1",
  });

  const moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const html = emailTemplate({
    address: `${purchase.address} ${purchase.city}, ${purchase.state} ${purchase.zipCode}`,
    amount: moneyFormatter.format(
      squareCharge.payment.amount_money.amount / 100
    ),
    chargedTo: `${squareCharge.payment.card_details.card.card_brand} ending in ${squareCharge.payment.card_details.card.last_4}`,
    email: purchase.email,
    id: purchaseId,
    name: purchase.name,
    phone: purchase.phone,
    referringFamily: purchase.referringFamily,
    ticketsPurchased: purchase.ticketsPurchased,
  }).html;

  return new AWS.SES()
    .sendEmail({
      Destination: { ToAddresses: [purchase.email] },
      Source: functions.config().raffle.from_email,
      Message: {
        Body: { Html: { Charset: "UTF-8", Data: html } },
        Subject: {
          Charset: "UTF-8",
          Data: "SSPP Christmas Raffle Purchase Confirmation",
        },
      },
    })
    .promise();
};
