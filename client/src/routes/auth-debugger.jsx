import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { getUserFromDB } from "../dataFetchFunctions";

export default function AuthDebugger() {
  const { user } = useAuth0();
  const { accessToken } = useAuthToken();
  const [userFromDB, setUserFromDB] = useState(null);
  
  useEffect(() => {
    (async () => {
      setUserFromDB(await getUserFromDB(accessToken));
    })();
  }, [accessToken]);

  return (
    <>
    <p className="detail-element  review-content profile-element pre-wrapper">
      <strong>Access Token:</strong>
      <br></br>
      <br></br>
      <pre>{JSON.stringify(accessToken, null, 2)}</pre>
      <br></br>
      <br></br>
    </p>
    <p className="detail-element  review-content profile-element">
      <strong>User Info</strong>
      <br></br>
      <br></br>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <br></br>
      <br></br>
    </p>
    <p className="detail-element  review-content profile-element">
      <strong>User Info from DB</strong>
      <br></br>
      <br></br>
      <pre>{JSON.stringify(userFromDB, null, 2)}</pre>
      <br></br>
      <br></br>
    </p>
  </> 
  );
}