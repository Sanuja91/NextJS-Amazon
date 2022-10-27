import Image from "next/image"
import { StarIcon } from "@heroicons/react/24/solid"
import { useDispatch } from "react-redux"
import { addToBasket, removeFromBasket } from "../slices/basketSlice"
import formatCurrency from "../utilities/currency"

export default ({ id, title, price, rating, description, category, image, hasPrime }) => {
    const dispatch = useDispatch()

    const addItemToBasket = () => {
        const product = { id, title, price, description, category, image, rating, hasPrime }
        dispatch(addToBasket(product))
    }

    const removeItemFromBasket = () => {
        console.log('CHECKOUT PRODUCT', id)
        dispatch(removeFromBasket({ id }))
    }

    return (
        <div className="grid grid-cols-5">
            {/* Left */}
            <Image src={image} width={200} height={200} objectFit="contain" />
            {/* Middle */}
            <div className="col-span-3 ,x-5">
                <p>{title}</p>
                <div>
                    <div className="flex">
                        {Array(rating).fill().map((_, i) => (
                            <StarIcon key={i} className="h-5 text-yellow-500 " />
                        ))}
                    </div>
                </div>
                <p className="text-xs my-2 line-clamp-3">{description}</p>
                <p> {formatCurrency.format(price)}</p>
                {hasPrime && (
                    <div className="flex items-center space-x-2 -mt-5">
                        <img className="w-12" src="https://links.papareact.com/fdw" />
                        <p className="text-xs texy-gray-500">FREE Next-day Delivery</p>
                    </div>
                )}
            </div>
            {/* Right */}
            <div className="flex flex-col space-y-2 my-auto justify-self-end">
                <button onClick={addItemToBasket} className="button mt-auto">Add to Basket</button>
                <button onClick={removeItemFromBasket} className="button mt-auto">Remove from Basket</button>
            </div>
        </div>
    )
}