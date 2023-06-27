import { useAuth0 } from "@auth0/auth0-react";

export default function WelcomeBar() {
  const { logout } = useAuth0();

  return (
    <>
      <div className="row greeting-row">
        <p className="welcome-slogan">Greetings, esteemed member!</p>
      </div>
      <div className="row">
        <button
          className="log-button"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Log Out
        </button>
      </div>
    </>
  );
}
