import react, {useContext, useState } from 'react'
import { Form, Button, Card, Container, Row, Col} from 'react-bootstrap'
import AdminStore from './AdminStore'
import ErrorMessage from './ErrorMessage'
import SuccessMessage from './SuccessMessage'
import S3 from 'react-aws-s3';
import {UserContext} from '../UserContext';



const Admin = () => {
    const [token] = useContext(UserContext);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [productInfo, setProductInfo] = useState(
        {
            title: "",
            description: "",
            price: "",
        }
    )
    const [urlInfo, setUrlInfo] = useState ("");

    const updateForm = (e) => {
        setProductInfo(
            {...productInfo, [e.target.name] : e.target.value}
        )
    }

    const config ={
        bucketName:"storedev",
        dirName:"Image",
        region:"us-west-2",
        accessKeyId:"AKIATYQCI4ZNQB2HRXNW",
        secretAccessKey:"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",
        s3Url:""
    }

    const ReactS3Client = new S3(config)
    const upload = (e) => {
        ReactS3Client.uploadFile(e.target.files[0])
        .then((data)=>{
            console.log(data.location)
            
            setUrlInfo(data.location)
        })

        .catch(err => console.error(err))
    }
    
    const postData = async (e) => {
        console.log(productInfo.url)
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                   
                title: productInfo.title,
                description: productInfo.description,
                price: productInfo.price,
                url:urlInfo,
            }),
        }

        const response = await fetch ("http://localhost:8000/admin/items/", requestOptions);
        const data = await response.json()
        console.log(data.detail)
        if(!response.ok){
            setErrorMessage(data.detail)
        }else{
            setSuccessMessage("Items successfully Added");
            setProductInfo({
                title: "",
                description: "",
                price: "",
            });
        }

    }

    return (
    <Container>
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
                    <Form.Group controlId="UploadFile">
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control type="file" name="url" value = {productInfo.url} onChange ={upload}  placeholder="Upload Image" />
                    </Form.Group>

                    <Button style={{marginTop:"10px"}} variant="primary" type="submit">
                        Add to Store
                    </Button>
                    <ErrorMessage message={errorMessage}/>
                    <SuccessMessage message={successMessage}/>
                </Form>
            </Card.Body>
        </Card>
    </Container>
    );
}


export default Admin;