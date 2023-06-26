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
            <NavLink to='/movies/reviewed'>Reviewed Movies</NavLink>
          </li>
          <li>
            <NavLink to='movies/recommended'>recommended movies</NavLink>
          </li>
          <li>
            <NavLink to='/profile'>profile</NavLink>
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
