import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { getUserFromDB } from "../functions";

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
    <div>
      <div>
        <p>Access Token:</p>
        <pre>{JSON.stringify(accessToken, null, 2)}</pre>
      </div>
      <div>
        <p>User Info</p>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
      <div>
        <p>User Info from DB</p>
        <pre>{JSON.stringify(userFromDB, null, 2)}</pre>
      </div>
    </div>
  );
}