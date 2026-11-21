import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import AppSidebar from "./AppSidebar";
import Navbar from "./components/AppBar";
import ResposniveSidebar from "./ResponsiveSidebar";
import Routing from "./Routing";
import Login from "./pages/login/Login";

// A stored token counts only if it decodes and has not expired; otherwise it is
// cleared so the login page is shown instead of a crashed (blank) dashboard.
function hasValidToken() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    if (exp && exp * 1000 < Date.now()) throw new Error("expired");
    return true;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
}

function App() {
  const [isCollapse, setIsCollapse] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(hasValidToken);

  return (
    <>
      {isAuthenticated ? (
        <div className="flex">
          <div className="large-screens">
            <AppSidebar isCollapse={isCollapse} setIsCollapse={setIsCollapse} />
          </div>
          <div className="small-screens small-screen-nav-width">
            <ResposniveSidebar
              isCollapse={isCollapse}
              setIsCollapse={setIsCollapse}
            />
          </div>
          <div
            className={`${!isCollapse ? `nav-width` : "nav-width-collapse"}`}
          >
            <Navbar isCollapse={isCollapse} setIsCollapse={setIsCollapse} />

            <Routing />
          </div>
        </div>
      ) : (
        <Login setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
}

export default App;
