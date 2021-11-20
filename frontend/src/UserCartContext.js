import react, {useState, createContext} from 'react'

export const UserCartContext = createContext();

export const UserCartProvider = (props) => {
    let [carts, setCarts] = useState({"data": []});

    const increase = async (price) => {
        //const newItems = [carts];
       // newItems[id].cart.price++;
        let rate = price + price
        setCarts(rate)
        console.log(rate)
    }

    return(
        <UserCartContext.Provider value = {[carts, setCarts]}>
            {props.children}
        </UserCartContext.Provider>
    );

}
