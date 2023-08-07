import React from "react";
import { NavLink } from "react-router-dom";

export default function MemberNavBar() {
  return (
    <nav className="row nav-bar">
      <NavLink className="first-row-nav-mob" to="/">
        Home
      </NavLink>
      <NavLink className="first-row-nav-mob" to="/movies/reviewed">
        Reviewed
      </NavLink>
      <NavLink className="first-row-nav-mob" to="movies/recommended">
        Recommended
      </NavLink>
      <NavLink to="/profile">Profile</NavLink>
      <NavLink to="/auth-debugger">AuthDebugger</NavLink>
    </nav>
  );
}
