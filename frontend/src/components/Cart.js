
import react, {useEffect, useContext} from 'react'
import {CartContext} from '../CartContext';
import CartItem from './CartItem'



const Cart = () => {
    const [carts, setCartts]  =  useContext(CartContext)

    
    useEffect( () => {
        fetch('http://localhost:8000/allitems/?skip=0&limit=100')
           .then(resp => {
               console.log(resp)
               return resp.json();
        }).then(results => {
            console.log(results)
            setProducts({"data": [...results] })
        })
    }, [])
    console.log(products.data)

    return(
        <section className="py-4 container">
        <div className = "row justify-content-center">
            {products.data.map((item, index) => (
                        <CartItem
                                id = {item.id}
                                title = {item.title}
                                description = {item.description}
                                price = {item.price}
                                key={index}
                                item={item}
                        />
            ))}
        </div>
    </section>
   
    );

}
export default Cart;