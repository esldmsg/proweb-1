import React, {useContext} from "react";
import {ProductProvider} from '../ProductContext';
import {UserContext} from '../UserContext';
import {
  BrowserRouter as Router,
  Switch,
  Route,
 Redirect,
} from "react-router-dom";
import Admin from "./Admin";
import Store from "./Store";
import Cart from "./Cart";
import Shipped from "./Shipped";
import Register from "./Register"
import Login from "./Login";
//import Logout from "./Logout";


function Main() {
  const[token]  = useContext(UserContext);

    return(
      
       <Router>
         <ProductProvider>
          <Switch>
              <Route path="/Admin" component={Admin}/>
              <Route path="/Store" component={Store} />
              <Route path="/Cart" component={Cart}/>
              <Route path="/Shipped" component={Shipped}/>
              <Route path="/Register" component={Register}/>
              <Route exact path="/" component={Login}/>
          </Switch>
         </ProductProvider>
    </Router>
    )
}

export default Main;
