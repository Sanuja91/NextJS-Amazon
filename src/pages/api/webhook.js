import { buffer } from "micro"
import * as admin from "firebase-admin"
import { doc, collection, getFirestore, Timestamp, FieldValue, setDoc } from "firebase-admin/firestore"
// Secure a connection to Firebase from the backend
const serviceAccount = require("../../utilities/firebase/permissions.json");
// Prevent double initlization of firebase
const app = !admin.apps.length ? admin.initializeApp({ credential: admin.credential.cert(serviceAccount) }) : admin.app()
const db = getFirestore()

// Establish connection to Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_SIGNING_SECRET

const fulfillOrder = async (session) => {
    console.log('Fulfilling order', session.metadata)
    console.log('Firestore', {
        amount: session.amount_total / 100, // Because Stripe keeps things in cents
        amount_shipping: session.total_details.amount_shipping / 100,
        images: JSON.parse(session.metadata.images),
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    })

    try {
        db.collection('users').doc(session.metadata.uid).collection('orders').doc(session.id).set({
            amount: session.amount_total / 100, // Because Stripe keeps things in cents
            amount_shipping: session.total_details.amount_shipping / 100,
            images: JSON.parse(session.metadata.images),
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        })

        // app.firestore.collection('users').doc(uid).collection('orders').doc(session.id).set({
        //     amount: session.amount_total / 100, // Because Stripe keeps things in cents
        //     amount_shipping: session.total_details.amount_shipping / 100,
        //     images: JSON.parse(session.metadata.images),
        //     timestamp: admin.firestore.FieldValue.serverTimestamp()
        // })
    }
    catch (error) { console.log('Firestore Error', error) }
    // return
    //     // const docRef = db.collection('users').doc(uid).collection('orders').doc(session.id)
    //     // // doc(db, `users/${uid}/orders`)
    //     // return setDoc(docRef, {
    //     //     amount: session.amount_total / 100, // Because Stripe keeps things in cents
    //     //     amount_shipping: session.total_details.amount_shipping / 100,
    //     //     images: JSON.parse(session.metadata.images),
    //     //     timestamp: admin.firestore.FieldValue.serverTimestamp()
    //     // })


    //     // return doc(db, `users/${uid}/orders`
    //     //     .collection('orders').doc(session.id).set({
    //     //         amount: session.amount_total / 100, // Because Stripe keeps things in cents
    //     //         amount_shipping: session.total_details.amount_shipping / 100,
    //     //         images: JSON.parse(session.metadata.images),
    //     //         timestamp: admin.firestore.FieldValue.serverTimestamp()
    //     //     })
    //     .then(() => { console.log(`SUCCESS: Order ${session.id}`) })
    // .catch((error) => { console.log(`Firebase Error : ${error}`) })
}

export default async (req, res) => {
    if (req.method === 'POST') {
        const requestBuffer = await buffer(req)
        const payload = requestBuffer.toString()
        const sig = req.headers["stripe-signature"]

        let event
        // Verify that the EVENT posted came from Stripe
        try { event = stripe.webhooks.constructEvent(payload, sig, endpointSecret) }
        catch (error) { return res.status(400).send(`Webhook error: ${err.message}`) }

        // Handle the checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object

            // Fullfill the order...
            return fulfillOrder(session).then(() => res.status(200)).catch((error) => res.status(400).send(`Webhook Error: ${error.message}`))
        }
    }

}

// Disables Body Parser when handling the web hook
export const config = {
    api: {
        bodyParser: false,
        externalResolver: true
    }
}