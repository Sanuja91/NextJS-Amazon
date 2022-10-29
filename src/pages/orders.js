import moment from 'moment'
import { useSession, getSession } from "next-auth/react"
import Header from "../components/Header"
import Order from "../components/Order"
import { getDocsFromFirestore } from "../utilities/firebase/firebase"

export default ({ orders }) => {
    const { data: session } = useSession()

    console.log(orders)
    return (
        <div className="bg-gray-100 h-screen">
            <Header />
            <main className="max-w-screen-lg mx-auto p-10">
                <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">Your Orders</h1>
                {session ? (<h2>{orders.length} Orders</h2>) : (<h2>Please sign in to see your orders</h2>)}
                <div className="mt-5 space-y-4">
                    {orders?.map(({ id, amount, amountShipping, items, timestamp, images }) =>
                    (<Order
                        key={id}
                        id={id}
                        amount={amount}
                        amountShipping={amountShipping}
                        items={items}
                        timestamp={timestamp}
                        images={images}
                    />))}
                </div>
            </main >
        </div >
    )
}

// Initiates Server Side Rendering.. Basically runs a node js function before loading the page
export async function getServerSideProps(context) {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

    // Get the users logged in credentials
    const session = await getSession(context)
    if (!session) return { props: {} }

    const stripeOrders = await getDocsFromFirestore(`users/${session.user.email}/orders`)

    // Stripe orders
    const orders = await Promise.all(
        stripeOrders.map(async order => ({
            id: order.id,
            amount: order.amount,
            amountShipping: order.amount_shipping,
            images: order.images,
            timestamp: moment(order.timestamp.toDate()).unix(),
            items: (await stripe.checkout.sessions.listLineItems(order.id, { limit: 100 })).data
        }))
    )

    return { props: { orders, session } }
}