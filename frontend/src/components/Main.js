import React, {useContext} from "react";
import {ProductProvider} from '../ProductContext';
import {ProductContext} from '../ProductContext';
import {
  BrowserRouter as Router,
  Switch,
  Route,
 
} from "react-router-dom";
import Admin from "./Admin";
import Store from "./Store";
// import Cart from "./Cart";
// import Login from "./Login";


function Main() {
  const [products, setProducts] = useContext(ProductContext)
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
                {/* <Cart /> */}
              </Route>
              <Route path="/Login">
                {/* <Login /> */}
              </Route>
          </Switch>
         </ProductProvider>
    </Router>
    )
}

export default Main;
