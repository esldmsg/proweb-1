import React, {useContext} from "react";
import {ProductProvider} from '../ProductContext';
import {
  BrowserRouter as Router,
  Switch,
  Route,
 
} from "react-router-dom";
import Admin from "./Admin";
import Store from "./Store";
import Cart from "./Cart";
import Register from "./Register"
import Login from "./Login";


function Main() {
    return(
      
       <Router>
         <ProductProvider>
          <Switch>
              <Route path="/Admin">
                <Admin />
              </Route>
              <Route path="/Store">
                <Store />
              </Route>
              <Route path="/Cart">
                <Cart />
              </Route>
              <Route path="/Register">
                <Register />
              </Route>
              <Route exact path="/">
                <Login />
              </Route>
          </Switch>
         </ProductProvider>
    </Router>
    )
}

export default Main;
