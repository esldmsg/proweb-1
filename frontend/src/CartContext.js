import react, {useState, createContext} from 'react'

export const CartContext = createContext();

export const CartProvider = (props) => {
    const [carts, setCarts] = useState({"data": []});

    return(
        <CartContext.Provider value = {[carts, setCarts]}>
            {props.children}
        </CartContext.Provider>
    );

}
