import Header from "../components/Header"
import Banner from "../components/Banner"
import ProductFeed from "../components/ProductFeed"
import { getSession } from "next-auth/react"

export default function Home({ products }) {
  return (
    <div className="bg-gray-100">
      {/* Header */}
      < Header />

      <main className="max-w-screen-2xl mx-auto">
        {/* Banner */}
        <Banner />
        {/* Product Feed */}
        <ProductFeed products={products} />
      </main>
    </div >
  )
}



export async function getServerSideProps(context) {
  const session = await getSession(context) // Switches Server Side Rendering On 
  const products = await fetch("https://fakestoreapi.com/products").then(res => res.json())
  return { props: { products, session } }
}

/// https://fakestoreapi.com/products