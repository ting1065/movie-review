import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { getUserFromDB } from "../dataFetchFunctions";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router-dom";

export default function UserProfile() {
  const { accessToken } = useAuthToken();
  const [userFromDB, setUserFromDB] = useState(null);
  const { user } = useAuth0();

  useEffect(() => {
    (async () => {
      setUserFromDB(await getUserFromDB(accessToken));
    })();
  }, [accessToken]);

  return (
    <>
      <p className="detail-element profile-element">
        <strong>Author:</strong>
        {`     ${userFromDB ? userFromDB.name : ""}`}
      </p>
      <p className="detail-element profile-element">
        <strong>Email:</strong>
        {`     ${userFromDB ? userFromDB.email : ""}`}
      </p>
      <p className="detail-element profile-element">
        <strong>Email Verification:</strong>
        {`     ${user ? (user.email_verified ? "✅" : "❎") : "❎"}`}
      </p>
      <p className="detail-element  review-content profile-element">
        <strong>Self-intro:</strong>
        <br></br>
        <br></br>
        {userFromDB ? userFromDB.selfIntroduction : ""}
        <br></br>
        <br></br>
      </p>
      <NavLink
        className="detail-element detail-prompt profile-element"
        to="/profile/edit"
      >
        <button>Edit</button>
      </NavLink>
    </>
  );
}
