import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import MemberNavBar from '../components/MemberNavBar'
import VisitorNavBar from '../components/VisitorNavBar'
import { useAuth0 } from "@auth0/auth0-react";

export default function Root() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isAuthenticated } = useAuth0();
  
  return (
    <>
    <div>
      <h1>Movie Review</h1>
    </div>

    <div>
      {isAuthenticated ? <MemberNavBar /> : <VisitorNavBar />}
    </div>

    <div>
      <Outlet />
    </div>
    </>

  )
}
