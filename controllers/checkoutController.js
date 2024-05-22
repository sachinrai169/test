const dotenv = require("dotenv");

const { flatten } = require("safe-flat");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function checkout(req, res) {
  try {
    const { products, successUrl, cancelUrl } = req.body;

    const TAX_RATE = 0.13;

    let totalPrice = 0;

    products.forEach((product) => {
      totalPrice += product.price * product.quantity;
    });

    const taxAmount = totalPrice * TAX_RATE;

    products.push({
      product: {
        title: "Tax",
        price: taxAmount,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: products.map((product) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: product.product.title,
          },

          unit_amount: Math.round(product.product.price * 100),
        },

        quantity: product.quantity,
      })),
      mode: "payment",
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata: flatten(products[0].metadata),
    });

    console.log("session", session);
    res.json({ sessionURL: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
async function getBalance(req, res) {
  try {
    const { products, successUrl, cancelUrl } = req.body;

    const TAX_RATE = 0.13;

    let totalPrice = 0;

    products.forEach((product) => {
      totalPrice += product.price * product.quantity;
    });

    const taxAmount = totalPrice * TAX_RATE;

    products.push({
      product: {
        title: "Tax",
        price: taxAmount,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: products.map((product) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: product.product.title,
          },

          unit_amount: Math.round(product.product.price * 100),
        },

        quantity: product.quantity,
      })),
      mode: "payment",
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata: flatten(products[0].metadata),
    });

    console.log("session", session);
    res.json({ sessionURL: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}

async function getCheckoutSessions(req, res) {



  try {

    console.log('hu')

    const sessions = await stripe.checkout.sessions.list({
      // created: {gte: 1715773434},
      // created:{lte:1715687025}
    });

    console.log('se',sessions)
    res.json(sessions);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}

async function sendInvoice(req, res) {
  try {

    const invoice = await stripe.invoices.create({
      currency:"inr" ,
      description:"invoice for charging session",
      customer:"cus_Q68uDtLG7hXPyM",
      collection_method:"send_invoice",
      due_date:"1718963097",
      default_tax_rates:["txr_1PIpQsSEhU6KCJ1TzxHU6XNw"]
    });

    const invoiceitem=await stripe.invoiceItems.create({
      amount:77000,
      currency:"inr" ,
      description:"invoice for charging session",
      customer:"cus_Q68uDtLG7hXPyM",
     invoice:invoice.id
    });


    const send=await stripe.invoices.sendInvoice(
    invoice.id
    );


    res.json(send);
  } catch (error) {
    console.error("Error creating invoices:", error);
    res.status(500).json({ error: "Failed to send invoices" });
  }
}

async function getInvoices(req, res) {
  try {

    const invoices = await stripe.invoices.list({
      collection_method:"send_invoice",

      limit:1000
    });



    res.json(invoices);
  } catch (error) {
    console.error("Error creating invoices:", error);
    res.status(500).json({ error: "Failed to send invoices" });
  }
}

// app.post('/webhook', express.raw({type: 'application/json'}), (


  async function Webhook(request, response) {
  let event = request.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send(200);
}


module.exports = {
  checkout,
  getCheckoutSessions,
  sendInvoice,
  getInvoices,
  Webhook
};
