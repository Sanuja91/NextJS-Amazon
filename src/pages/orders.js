import { useContext } from "react"
import { UserContext } from "../context/user"
import { useRouter } from "next/router"
import Header from "../components/Header"
import { db } from "../utilities/firebase/firebase"


export default ({ orders }) => {
    const { currentUser } = useContext(UserContext)
    const router = useRouter()

    console.log(orders)
    return (
        <div className="bg-gray-100 h-screen">
            <Header />
            <main className="max-w-screen-lg mx-auto p-10">
                <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">Your Orders</h1>
                {currentUser ? (<h2>X Orders</h2>) : (<h2>Please sign in to see your orders</h2>)}
                <div className="mt-5 space-y-4"></div>
            </main >
        </div >
    )
}

// Initiates Server Side Rendering.. Basically runs a node js function before loading the page
export async function getServerSideProps(context) {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

    console.log(context)
    // Get the users logged in credentials
    const { currentUser } = useContext(UserContext)
    console.log(currentUser)
    const session = getSession(context)
    if (!session) return { props: {} }

    // Firebase DB
    const stripeOrders = await db
        .collection('users')
        .doc(session.user.uid)
        .collection('orders')
        .doc(session.id)
        .orderBy("timestamp", "desc")
        .get()

    // Stripe orders
    const orders = await Promise.all(
        stripeOrders.docs.map(async order => ({
            id: order.id,
            amount: order.data().amount,
            amountShipping: order.data().amount_shipping,
            images: order.data().images,
            timestamp: moment(order.data().timestamp.toDate()).unix(),
            items: (await stripe.check.sessions.listLineItems(order.id, { limit: 100 })).data
        }))
    )

    return { props: { orders } }
}