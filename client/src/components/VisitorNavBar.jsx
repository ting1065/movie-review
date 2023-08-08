import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function VisitorNavBar() {
  const { loginWithRedirect } = useAuth0();

  return (
    <>
      <div className="row greeting-row">
        <p className="welcome-slogan">Login for more features!</p>
      </div>
      <div className="row">
        <button className="log-button" onClick={loginWithRedirect}>
          Log In / Sign Up
        </button>
      </div>
    </>
  );
}
