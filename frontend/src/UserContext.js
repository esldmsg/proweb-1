import React, { createContext, useEffect, useState } from "react";
import{ Redirect} from "react-router-dom";
export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("passToken"));

  useEffect(() => {
    const fetchUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      const response = await fetch("http://localhost:8000/api/users/me", requestOptions);

      if (!response.ok) {
        setToken(null);
        return <Redirect to = '/'/>
      }
      localStorage.setItem("passToken", token);
    };
    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={[token, setToken]}>
      {props.children}
    </UserContext.Provider>
  );
};