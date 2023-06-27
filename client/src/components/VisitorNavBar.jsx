import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function VisitorNavBar() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="row">
      <button className="log-button" onClick={loginWithRedirect}>
        Log In / Sign Up
      </button>
    </div>
  );
}
