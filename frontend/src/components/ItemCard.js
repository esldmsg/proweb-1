import react, {useContext, useState} from 'react';
import { Card,Button } from 'react-bootstrap'
import {UserContext} from '../UserContext';
import ErrorMessage from './ErrorMessage';






const ItemCard = (props) => {
    const [token] = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState("");


    const addItem = async (title, price, description) => {
        console.log(title, price, description)
        const requestOptions = {
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                title: title,
                price:price,
                description:description,
             }),
             
        };
        const response = await fetch ("http://localhost:8000/users/items/{title}/{price}/{description}/", requestOptions);
        const data = await response.json()
        console.log(data)
        if(!response.ok){
            setErrorMessage(data.detail)
        }else{
            setErrorMessage("Item successfully Added");
     
        }

    }

    return(
        <div className="col-11 col-md-6 col-lg-3 mx-0 mb-4">
            <Card style={{ width: '18rem', p:0, overflow:'hidden', h:'100 shadow'}}>
                    <Card.Img variant="top" src="data:image/jpeg;base64,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" />
                    <Card.Body>
                        <Card.Title>{props.title}</Card.Title>
                        <Card.Text>
                        {props.description}
                        </Card.Text>
                        <Card.Text>
                        {props.price}
                        </Card.Text>
                        <Button variant="success" 
                        onClick={()=>addItem(props.title, props.price, props.description) }
                        >Add to Cart </Button>
                    </Card.Body>
            </Card>
        </div>
    )
}
export default ItemCard;