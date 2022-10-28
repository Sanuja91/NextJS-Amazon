const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
  const { items, email } = req.body
  console.log(items, email)

  const transformedItems = items.map(({ description, price, title, image }) => {
    return {
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: price * 100,
        product_data: {
          name: title,
          description,
          images: [image]
        }
      }
    }
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    shipping_options: [{ shipping_rate: 'shr_1LxS4MIV0cF3xNbYSsyzgX1e' }],
    shipping_address_collection: {
      allowed_countries: ['US', 'GB', 'CA']
    },
    line_items: transformedItems,
    mode: 'payment',
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/checkout`,
    metadata: {
      email,
      images: JSON.stringify(items.map(item => item.image))
    }
  })

  console.log('SESSION', session)
  res.status(200).json({ id: session.id })
  // // Create a PaymentIntent with the order amount and currency
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: calculateOrderAmount(items),
  //   currency: 'usd',
  //   automatic_payment_methods: {
  //     enabled: true,
  //   },
  // })

  // res.send({
  //   clientSecret: paymentIntent.client_secret,
  // })
}