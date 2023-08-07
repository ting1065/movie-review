import React, { useEffect, useState, useLayoutEffect } from "react";
import { Outlet, Form, redirect, useNavigate } from "react-router-dom";
import MemberNavBar from "../components/MemberNavBar";
import VisitorNavBar from "../components/VisitorNavBar";
import WelcomeBar from "../components/WelcomeBar";
import { useAuth0 } from "@auth0/auth0-react";
import BackToTopButton from "../components/BackToTopButton";
import { useAuthToken } from "../AuthTokenContext";
import { getUserFromDB } from "../dataFetchFunctions";

export async function action({ request }) {
  const formData = await request.formData();
  const searchedName = formData.get("search");
  if (!searchedName) {
    return redirect("/");
  }
  if (searchedName.length > 30) {
    alert("search name too long, no more than 30 characters");
    return redirect("/");
  }
  return redirect(`search/${searchedName}`);
}

export default function Root() {
  const { accessToken } = useAuthToken();
  const [userFromDB, setUserFromDB] = useState(null);
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setUserFromDB(await getUserFromDB(accessToken));
    })();
  }, [accessToken]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="row header">
        <h1>Movie Review</h1>
      </div>

      {isAuthenticated ? (
        <>
          <WelcomeBar userName={userFromDB ? `, ${userFromDB.name}` : ""} />
          <MemberNavBar />
        </>
      ) : (
        <VisitorNavBar />
      )}

      <div className="row search-bar">
        <Form className="search-form" method="post">
          <input
            className="search-input"
            type="text"
            name="search"
            placeholder="search a movie"
          />
          <button className="search-button" type="submit">
            search
          </button>
          <button
            className="search-button"
            type="button"
            onClick={() => navigate("/")}
          >
            home
          </button>
        </Form>
      </div>

      <div className="row">
        <Outlet />
      </div>
      <div className="row footer">
        <BackToTopButton />
      </div>
    </>
  );
}
