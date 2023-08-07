import React, { useEffect, useState, useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import MemberNavBar from "../components/MemberNavBar";
import VisitorNavBar from "../components/VisitorNavBar";
import WelcomeBar from "../components/WelcomeBar";
import { useAuth0 } from "@auth0/auth0-react";
import BackToTopButton from "../components/BackToTopButton";
import { useAuthToken } from "../AuthTokenContext";
import { getUserFromDB } from "../dataFetchFunctions";


export default function Root() {
  const { accessToken } = useAuthToken();
  const [userFromDB, setUserFromDB] = useState(null);
  const [searchedName, setSearchedName] = useState(""); 
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

  function searchHandler() {
    console.log("searched name: ",searchedName);
    if (!searchedName) {
      navigate("/");
      return;
    }
    if (searchedName.length > 30) {
      alert("search name too long, no more than 30 characters");
      setSearchedName("");
      navigate("/");
      return;
    }
    const nameToSearch = searchedName;
    setSearchedName("");
    navigate(`search/${nameToSearch}`);
  }

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
        <div className="search-form" method="post">
          <input
            className="search-input"
            type="text"
            placeholder="search a movie"
            value={searchedName}
            onChange={(e) => setSearchedName(e.target.value)}
          />
          <button className="search-button" onClick={() => searchHandler()}>
            search
          </button>
          <button
            className="search-button"
            type="button"
            onClick={() => navigate("/")}
          >
            home
          </button>
        </div>
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
