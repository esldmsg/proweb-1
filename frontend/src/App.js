import React, {useState, useContext} from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import Main from "./components/Main";
import {ProductProvider} from './ProductContext';
import {UserCartProvider} from './UserCartContext';
import {UserContext} from './UserContext';
import{ Redirect} from "react-router-dom";




function App() {
  const[token, setToken]  = useContext(UserContext);
  const [products, setProducts] = useState({"data": []});

 const logout = () => {
  localStorage.setItem("passToken", 'null');
    return <Redirect to = '/'/>

  };
  return (
      <ProductProvider>
      <UserCartProvider>
        <Navbar bg="primary" variant="dark" className ="nav-grid">
          <Container >
                <Nav className="me-auto">
                     <Nav.Link href="Admin" style={{color:'white'}}>Admin</Nav.Link>
                     <Nav.Link href="Store" style={{color:'white'}}>Store</Nav.Link>
                     <Nav.Link href="Cart" style={{color:'white'}}>Cart</Nav.Link>
                    <Nav.Link href="Register" style={{color:'white'}}>Register</Nav.Link>
                    <Nav.Link href="/" style={{color:'white'}}>Login</Nav.Link>

              </Nav> 
              <Nav className="mr-auto">            
                <Nav.Link href="Shipped" style={{color:'white'}}>Shipped</Nav.Link>
                <Nav.Link href="/" onClick={logout} style={{color:'white'}}>Logout</Nav.Link>

              </Nav>
            </Container>
        </Navbar>
  
        <Main />
        </UserCartProvider>
      </ProductProvider>
      
    
  );
}

export default App;
