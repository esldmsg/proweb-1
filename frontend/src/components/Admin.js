import react, { useState } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import AdminStore from './AdminStore'
import ErrorMessage from './ErrorMessage'



const Admin = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [productInfo, setProductInfo] = useState(
        {
            title: "",
            description: "",
            price: "",
        }
    )

    const updateForm = (e) => {
        setProductInfo(
            {...productInfo, [e.target.name] : e.target.value}
        )
    }


    const postData = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                   
                "title": productInfo['title'],
                "description": productInfo['description'],
                "price": productInfo['price'],
            }),
        };
        const response = await fetch ("http://localhost:8000/admin/items", requestOptions);
        console.log(response)
        if(!response.ok){
            setErrorMessage("somethin went wrong")
        }else{
            setErrorMessage("Items successfully Added");
            setProductInfo({
                title: "",
                description: "",
                price: "",
            });
        }

    }

    // const postData = async (e) => {
    //     e.preventDefault();
    //     console.log(productInfo)
    
    //     const url = "http://localhost:8000/admin/items"

    //     const response = await fetch(
    //         url, {
    //             method: 'POST',
    //             mode: 'cors',
    //             cache: 'no-cache',
    //             credentials: 'same-origin', 
    //             headers: {
    //             'Content-Type': 'application/json'
    //             },
    //             redirect: 'follow',
    //             referrerPolicy: 'no-referrer', 
    //             body: JSON.stringify({
                   
    //                 "title": productInfo['title'],
    //                 "description": productInfo['description'],
    //                 "price": productInfo['price'],
    //             }) 
    //         });
    //     response.json().then(response => {
            
    //         if (response.status === 'ok') {
    //             alert("Product added successfully")
    //         } else {
    //             console.log(response.status)
    //             alert("Failed to add product")
    //         }
    //     });
    //     setProductInfo({
    //         title: "",
    //         description: "",
    //         price: "",
    //     });
    // }


    return (
    <div>
        <AdminStore>
        </AdminStore>
        <Card>
            <Card.Body>
                <Form onSubmit = {postData}>
                    <Form.Group controlId="ProductName">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type="text" name="title" 
                            value={productInfo.title} onChange = {updateForm} placeholder="Product title" />
                    </Form.Group>
                    <Form.Group controlId="Description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" name="description" value={productInfo.description} onChange = {updateForm}  placeholder="Description" />
                    </Form.Group>
                    <Form.Group controlId="UnitPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" name="price" value={productInfo.price} onChange = {updateForm}  placeholder="Price" />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    <ErrorMessage message={errorMessage}/>
                </Form>
            </Card.Body>
        </Card>
    </div>
    );
}


export default Admin;