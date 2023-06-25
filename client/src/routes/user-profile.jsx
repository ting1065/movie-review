import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { getUserFromDB } from "../functions";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from 'react-router-dom'

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
    <div>
      <div>
        <p>Name: {userFromDB ? userFromDB.name : ""}</p>
      </div>
      <div>
        <p>Email: {userFromDB ? userFromDB.email : ""}</p>
      </div>
      <div>
        <p>Email verified: {user? user.email_verified?.toString() : ""}</p>
      </div>
      <div>
        <p>Self-intro: {userFromDB ? userFromDB.selfIntroduction ? userFromDB.selfIntroduction : "<no intro yet...>" : ""}</p>
      </div>
      <div>
        <NavLink to="/profile/edit">
          <button>Edit</button>
        </NavLink>
      </div>
    </div>
  )
}
