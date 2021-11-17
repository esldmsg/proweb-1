import react,{useState, useEffect, useContext} from 'react'
import ErrorMessage from './ErrorMessage';
import {UserContext} from '../UserContext'





const Login = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);
    const [username, setUsername] = useState("");
    //const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    

    const cleanFormData = ()=> {
        setUsername("");
        setEmail("");
        setPassword("");
       
    };
    const submitLoginForm = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({username: username, email: email, password:password }),
        };
        const response = await fetch ("http://localhost:8000/signUp/{username}/{email}/{password}", requestOptions);
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
     };

    return(
    <div>
        <form onSubmit ={handleSubmit}>
             <div class="container">
                <h1>Login</h1>s
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
                <button type="submit" class="registerbtn">Register</button>
            </div>

            <div class="container signin">
                <p>Yet to have an account? <a href="#">Register</a>.</p>
            </div>
        </form>
    </div>   
    );
}
export default Login;