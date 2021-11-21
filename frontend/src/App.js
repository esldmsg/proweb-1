import React, {useState, useContext} from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import Main from "./components/Main";
import {ProductProvider} from './ProductContext';
import {UserCartProvider} from './UserCartContext';
import {UserContext} from './UserContext';



function App() {
  const[token]  = useContext(UserContext);
     
  return (
     
      <ProductProvider>
      <UserCartProvider>
        <Navbar bg="primary" variant="dark" className ="nav-grid">
          <Container >
          {token && <div>
                <Nav className="me-auto">
                     <Nav.Link href="Admin" style={{color:'white'}}>Admin</Nav.Link>
                     <Nav.Link href="Store" style={{color:'white'}}>Store</Nav.Link>
                     <Nav.Link href="Cart" style={{color:'white'}}>Cart</Nav.Link>
                 </Nav>
                    </div>
              }
            {token && <div>
              <Nav className="me-auto">
                <Nav.Link href="Register" style={{color:'white'}}>Register</Nav.Link>
                {/* <Nav.Link href="Login" style={{color:'white'}}>Login</Nav.Link> */}
              </Nav>
            </div>
            } 
              <Nav className="mr-auto">            
                <Badge className="mt-2" variant="black">Products In stock </Badge>
              </Nav>
            </Container>
        </Navbar>
  
        <Main />
        </UserCartProvider>
      </ProductProvider>
      
    
  );
}

export default App;
