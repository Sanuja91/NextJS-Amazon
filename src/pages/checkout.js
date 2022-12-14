import axios from "axios"
import Image from "next/image"
import { useSelector } from "react-redux"
import Header from "../components/Header"
import CheckoutProduct from "../components/CheckoutProduct"
import { selectItems, selectTotal } from "../slices/basketSlice"
import formatCurrency from "../utilities/currency"
import { loadStripe } from '@stripe/stripe-js'
import { useSession } from "next-auth/react"

export default () => {
    const items = useSelector(selectItems)
    const total = useSelector(selectTotal)
    const { data: session } = useSession()

    const createCheckoutSession = async () => {
        console.log('CHECKOUT!')
        // const [clientSecret, setClientSecret] = useState("")
        const checkoutSession = await axios.post("/api/stripe-payment-intent", { items, email: session.user.email })

        // Redirect user to Stripe Checkout
        const stripePromise = await loadStripe(process.env.stripe_public_key)
        const result = await stripePromise.redirectToCheckout({
            sessionId: checkoutSession.data.id
        })

        if (result.error) alert(result.error.message)
    }


    return (
        <div className="bg-gray-100">
            <Header />
            <main className="lg:flex max-w-screen-2xl mx-auto">
                {/* Left */}
                <div className="flex-grow m-5 shadow-sm">
                    <Image src="https://links.papareact.com/ikj" width={1020} height={250} objectFit="contain" />
                    <div className="flex flex-col p-5 space-y-10 bg-white">
                        <h1 className="text-3xl border-b pb-4">{items.length === 0 ? "Your Amazon Basket is empty." : "Shopping Basket"}</h1>
                        {items.map((item, i) => (
                            <CheckoutProduct
                                key={i}
                                id={item.id}
                                title={item.title}
                                price={item.price}
                                rating={item.rating}
                                description={item.description}
                                category={item.category}
                                image={item.image}
                                hasPrime={item.hasPrime}
                            />
                        ))}
                    </div>
                </div>
                {/* Right */}
                <div className="flex flex-col bg-white p-10 shadow-md" >
                    {items.length > 0 && (
                        <div>
                            <h2 className="whitespace-nowrap">Subtotal ({items.length} items):{" "}
                                <span className="font-bold">
                                    {formatCurrency.format(total)}
                                </span>
                            </h2>
                        </div>
                    )}
                    <button
                        role="link"
                        onClick={createCheckoutSession}
                        className={`button mt-2 ${!session && 'from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed'}`}
                        disabled={!session}
                    >
                        {!session ? "Sign in to checkout" : "Proceed to checkout"}
                    </button>
                </div>
            </main>
        </div >
    )
}