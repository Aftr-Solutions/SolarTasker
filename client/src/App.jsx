import "./App.css";
import AppSidebar from "./AppSidebar";
import ResposniveSidebar from "./ResponsiveSidebar";

function App() {
  return ( 
    <>
       <div className="large-screens">
        <AppSidebar />
       </div>
       <div className="small-screens">
        <ResposniveSidebar />
       </div>  
    </>
  );
}

export default App;
