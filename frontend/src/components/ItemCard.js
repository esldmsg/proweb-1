import react, {useContext, useState} from 'react';
import { Card,Button } from 'react-bootstrap'
import {UserContext} from '../UserContext';
import ErrorMessage from './ErrorMessage';






const ItemCard = (props) => {
    const [token] = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState("");


    const addItem = async (title, price, url, description) => {
        console.log(title, url, description, price  )
        const requestOptions = {
            method: "POST",
            headers:{
                "Content-Type":"www-form-urlencoded",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                title,
                url,
                description,
                price,   
             }),
             
        };
        const response = await fetch ("http://localhost:8000/users/items/{title}/{url}/{description}/{price}", requestOptions);
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
                    <Card.Img variant="top" src={props.url} />
                    <Card.Body>
                        <Card.Title>{props.title}</Card.Title>
                        <Card.Text>{props.description}</Card.Text>
                        <Card.Text>{props.price}</Card.Text>
                        <Button variant="success" onClick={()=>addItem(props.title, props.price, props.url, props.description) }>Add to Cart </Button>
                    </Card.Body>
            </Card>
        </div>
    )
}
export default ItemCard;