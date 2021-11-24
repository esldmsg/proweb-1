import react, { useState } from 'react'
import { Form, Button, Card, Container, Row, Col} from 'react-bootstrap'
import AdminStore from './AdminStore'
import ErrorMessage from './ErrorMessage'
import S3 from 'react-aws-s3';



const Admin = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [productInfo, setProductInfo] = useState(
        {
            title: "",
            description: "",
            url:"https://storedev.s3-us-west-2.amazonaws.com/Image/7XVTp5fCQih2PEA4LxvAbx.jpeg",
            price: "",
        }
    )

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
            setProductInfo({
                url: data.location
            });
        })

        .catch(err => console.error(err))
    }
    
    const postData = async (e) => {
        console.log(productInfo.url)
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
                "url":productInfo['url']
            }),
        }

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
                url:"",
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
                        <Form.Control type="file"  onChange = {upload}  placeholder="Upload Image" />
                    </Form.Group>

                    <Button style={{marginTop:"10px"}} variant="primary" type="submit">
                        Add to Store
                    </Button>
                    <ErrorMessage message={errorMessage}/>
                </Form>
            </Card.Body>
        </Card>
    </Container>
    );
}


export default Admin;