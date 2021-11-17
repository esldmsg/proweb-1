import react, {useState, createContext} from 'react'

export const UserCartContext = createContext();

export const UserCartProvider = (props) => {
    const [carts, setCarts] = useState({"data": []});

    return(
        <UserCartContext.Provider value = {[carts, setCarts]}>
            {props.children}
        </UserCartContext.Provider>
    );

}
