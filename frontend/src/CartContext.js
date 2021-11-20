import react, {useState, createContext} from 'react'

export const CartContext = createContext();

export const CartProvider = (props) => {
    const [carts, setCarts] = useState({"data": []});

    increase =() =>{
        setCarts(carts.price + carts.price)
    }

    return(
        <CartContext.Provider value = {[carts, setCarts], increase}>
            {props.children}
        </CartContext.Provider>
    );

}
