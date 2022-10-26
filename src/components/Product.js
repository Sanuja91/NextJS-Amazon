import Image from "next/image";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid"
import { useDispatch } from "react-redux";
import { addToBasket } from "../slices/basketSlice"

const MAX_RATING = 5
const MIN_RATING = 1

const formatCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

export default function Product({ title, price, description, category, image }) {
    // Send Actions to Reduce
    const dispatch = useDispatch()

    const [rating] = useState(Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING)
    const [hasPrime] = useState(Math.random() < 0.5)

    // Sending the product as an action to the REDUX store... the basket slice
    const addItemToBasket = () => {
        const product = { title, price, description, category, image }
        dispatch(addToBasket(product))
    }

    return (
        <div className="relative flex flex-col m-5 bg-white z-30 p-10">
            <p className="absolute top-2 right-2 text-xs italic text-gray-400 ">{category}</p>
            <Image src={image} height={200} width={200} objectFit="contain" />
            <h4 className="my-3">{title}</h4>
            <div className="flex">
                {Array(rating).fill().map((i, _) => (
                    <StarIcon key={i} className="h-5 text-yellow-500 " />
                ))}
            </div>
            <p className="text-xs my-2 line-clamp-2">{description}</p>
            <div className="mb-5">
                <p> {formatCurrency.format(price)}</p>
            </div>
            {hasPrime && (
                <div className="flex items-center space-x-2 -mt-5">
                    <img className="w-12" src="https://links.papareact.com/fdw" />
                    <p className="text-xs texy-gray-500">FREE Next-day Delivery</p>
                </div>
            )}
            <button onClick={addItemToBasket} className="mt-auto button">Add to Basket</button>
        </div>
    )
}