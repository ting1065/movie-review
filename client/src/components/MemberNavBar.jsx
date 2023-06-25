import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";

export default function MemberNavBar() {

  const { logout } = useAuth0();

  return (
    <nav>
        <ul>
          <li>
            <NavLink to='/'>Home</NavLink>
          </li>
          <li>
            <NavLink to='/movies/reviewed/userid1234'>Reviewed Movies</NavLink>
          </li>
          <li>
            <NavLink to='/movies/recommended/userid1234'>recommended movies</NavLink>
          </li>
          <li>
            <NavLink to='/review/reviewid123'>review</NavLink>
          </li>
          <li>
            <NavLink to='/review/reviewid123/edit'>edit review</NavLink>
          </li>
          <li>
            <NavLink to='/review/reviewid123/delete'>delete review</NavLink>
          </li>
          <li>
            <NavLink to='/profile'>profile</NavLink>
          </li>
          <li>
            <NavLink to='/profile/userid123/edit'>edit profile</NavLink>
          </li>
          <li>
            <NavLink to="/auth-debugger">auth degugger</NavLink>
          </li>
          <li>
            <button onClick={() => logout({ returnTo: window.location.origin })}>logout</button>
          </li>  
        </ul>
      </nav>
  )
}
