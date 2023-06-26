import React, { useEffect } from 'react'
import { Outlet, Form, redirect } from 'react-router-dom'
import MemberNavBar from '../components/MemberNavBar'
import VisitorNavBar from '../components/VisitorNavBar'
import { useAuth0 } from "@auth0/auth0-react";

export async function action({request}) {
  const formData = await request.formData();
  const searchedName = formData.get('search');
  if (!searchedName) {
    return redirect('/')
  };
  return redirect(`search/${searchedName}`);
}

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
      <Form method='post'>
        <input type='text' name='search' placeholder='search a movie' defaultValue=""/>
        <button type='submit'>search</button>
      </Form>
    </div>

    <div>
      <Outlet />
    </div>
    </>

  )
}
