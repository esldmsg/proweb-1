import react,{useState, useEffect, useContext} from 'react';
import {Container, Row, Col } from 'react-bootstrap';
import ErrorMessage from './ErrorMessage';
import {UserContext} from '../UserContext'





const Register = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirm_password] = useState("");

    const cleanFormData = ()=> {
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirm_password("");
    };
    const submitRegisration = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({username:username, email:email, password:password }),
        };
        const response = await fetch (`http://localhost:8000/signUp/${username}/${email}/${password}`, requestOptions);
        const data = await response.json()
        console.log(data)
        if(!response.ok){
            setErrorMessage(data.detail)
        }else{
            setErrorMessage("you have Successfully Register");
            cleanFormData();
              
         
        }

    }
     const handleSubmit = (e) =>{
         e.preventDefault();
         if (password == confirm_password && password.length > 5){
             submitRegisration();
         }else{
             setErrorMessage(
                 "Ensure that the password match and greater than 5 characters"
             );
         }
     };

    return(
    <Container>
        <Row>
            <Col ></Col>
           
            <Col xs={12} style={{ marginTop:"50px"}}>
            <form onSubmit ={handleSubmit}>
                <h1 style={{textAlign:"center"}}>Register</h1>
                <p style={{textAlign:"center"}}>Please fill in this form to create an account.</p>
                <hr/>
                
                <label for="username"><b>Username</b></label>
                <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Enter Username" name="username" id="username" required/>

                <label for="email"><b>Email</b></label>
                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Email" name="email" id="email" required/>

                <label for="psw"><b>Password</b></label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Password" name="password" id="psw" required/>

                <label for="psw-repeat"><b>Repeat Password</b></label>
                <input type="password" value={confirm_password} onChange={(e)=>setConfirm_password(e.target.value)} placeholder="Repeat Password" name="confirm_password" id="psw-repeat" required/>
                <hr/>
                
                <ErrorMessage message={errorMessage}/>
                <Row>
                    <Col></Col>
                    <Col xs={2}><button type="submit" class="registerbtn">Register</button></Col>
                    <Col></Col>
                </Row>
            

            <div class="container signin">
                <p>Already have an account? <a href="/">Sign in</a>.</p>
            </div>
        </form>
        
            </Col>
            
            <Col ></Col>
        </Row>
    </Container>   
    );
}
export default Register;