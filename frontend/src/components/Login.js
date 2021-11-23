import react,{useState, useEffect, useContext} from 'react'
import ErrorMessage from './ErrorMessage';
import {UserContext} from '../UserContext';
import {Container, Row, Col } from 'react-bootstrap';
import {useHistory}  from "react-router-dom";







const Login = () => {
    let history = useHistory();
   
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);
    const [username, setUsername] = useState("");
    //const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    

    const cleanFormData = ()=> {
        setUsername("");
       // setEmail("");
        setPassword("");
       
    };
    const submitLoginForm = async () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: JSON.stringify(
                `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`
            ),
        };
        const response = await fetch ("http://localhost:8000/token", requestOptions);
        const data = await response.json()
        console.log(data)
        if(!response.ok){
            setErrorMessage(data.detail)
        }else{
            setErrorMessage("you have Successfully Login");
            cleanFormData();
            setToken(data.access_token)
            history.push('/store')
            
           
              
         
        }

    }
     const handleSubmit = (e) =>{
         e.preventDefault();
         submitLoginForm();
     };

    return(
    <Container>
        <Row>
            <Col></Col>
            <Col xs={12} style={{ marginTop:"50px"}}>
            <form onSubmit ={handleSubmit}>
           
                <h1  style={{textAlign:"center"}}>Login</h1>
                <hr/>
                
                <label for="username"><b>Username</b></label>
                <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Enter Username" name="username" id="username" required/>

                {/* <label for="email"><b>Email</b></label>
                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Email" name="email" id="email" required/> */}

                <label for="psw"><b>Password</b></label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Password" name="password" id="psw" required/>

                {/* <label for="psw-repeat"><b>Repeat Password</b></label>
                <input type="password" value={confirm_password} onChange={(e)=>setConfirm_password(e.target.value)} placeholder="Repeat Password" name="confirm_password" id="psw-repeat" required/> */}
                <hr/>
                
                <ErrorMessage message={errorMessage}/>
                {/* <p>By creating an account you agree to our <a href="#">Terms & Privacy</a>.</p> */}
               
                <Row>
                    <Col></Col>
                    <Col xs={2}><button type="submit" class="registerbtn">Login</button></Col>
                    <Col></Col>
                </Row>
            <div class="container signin">
                <p>Yet to have an account? <a href="Register">Register</a>.</p>
            </div>
        </form>

            </Col>
            <Col></Col>
        </Row>
    </Container>
      
    );
}
export default Login;