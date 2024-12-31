import { Route, Routes } from "react-router";
import "./App.css";
import AppSidebar from "./AppSidebar";
import Clients from "./pages/clients/Clients";
import Region from "./pages/region/Region";
import MissedTasks from "./pages/missed-tasks/MissedTasks";
import Workers from "./pages/workers/Workers";
import UpcomingTasks from "./pages/upcoming-tasks/UpcomingTasks";
import Tasks from "./pages/tasks/Tasks";
import Team from "./pages/team/Team";
import Users from "./pages/users/Users";
import ResposniveSidebar from "./ResponsiveSidebar";
import Navbar from "./components/AppBar";

function App() {
  return ( 
    <>
      <div className="flex">
       <div className="large-screens">
        <AppSidebar />
       </div>
       <div className="small-screens">
        <ResposniveSidebar />
       </div>
 
        <div className=" w-full  text-lightBlackText font-jakarta">
          <Navbar />
          <Routes>
            <Route path="/" element={<Clients />} />  
            <Route path="/region" element={<Region />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/team" element={<Team />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/upcoming-tasks" element={<UpcomingTasks />} />
            <Route path="/missed-tasks" element={<MissedTasks />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
