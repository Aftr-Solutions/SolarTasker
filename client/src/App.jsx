import { useState } from "react";
import "./App.css";
import AppSidebar from "./AppSidebar";
import Navbar from "./components/AppBar";
import ResposniveSidebar from "./ResponsiveSidebar";
import Routing from "./Routing";

function App() {
  const [isCollapse, setIsCollapse] = useState(false);

  return ( 
    <>
    <div className="flex">
    <div className="large-screens">
        <AppSidebar isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
       </div>
       <div className="small-screens small-screen-nav-width">
        <ResposniveSidebar isCollapse={isCollapse} setIsCollapse={setIsCollapse} />
       </div> 
       <div className={`${!isCollapse? `nav-width` : "nav-width-collapse"}`}>
        <Navbar isCollapse={isCollapse} setIsCollapse={setIsCollapse} />
        <Routing />
       </div>

    </div>
    
     
    </>
  );
}

export default App;
