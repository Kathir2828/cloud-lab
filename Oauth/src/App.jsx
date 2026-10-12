
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { loginWithRedirect, isAuthenticated, user, logout } =
    useAuth0();

  return (
    <div className="container">
      <div className="login-card">
        {isAuthenticated ? (
          <>
            <h2>Welcome!</h2>
            <p>{user.name}</p>
            <p>{user.email}</p>

            <button
              onClick={() =>
                logout({
                  logoutParams: {
                    returnTo: window.location.origin,
                  },
                })
              }
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <h2>Login</h2>
            <p>Welcome back! Please sign in.</p>

            <button onClick={() => loginWithRedirect()}>
              Login with Auth0
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
