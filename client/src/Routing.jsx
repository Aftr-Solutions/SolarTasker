import React from 'react'
import Clients from './pages/clients/Clients'
import Region from './pages/region/Region'
import Workers from './pages/workers/Workers'
import Team from './pages/team/Team'
import Tasks from './pages/tasks/Tasks'
import UpcomingTasks from './pages/upcoming-tasks/UpcomingTasks'
import MissedTasks from './pages/missed-tasks/MissedTasks'
import Users from './pages/users/Users'
import { Route, Routes } from 'react-router'

const Routing = React.memo(() => {
  return (
    <div className=' mx-3 text-lightBlackText font-jakarta'>
          <Routes>
            <Route path="/" element={<Clients />} />  
            <Route path="/region" element={<Region />} />
            <Route path="/worker" element={<Workers />} />
            <Route path="/team" element={<Team />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/upcoming-tasks" element={<UpcomingTasks />} />
            <Route path="/missed-tasks" element={<MissedTasks />} />
            <Route path="/user" element={<Users />} />
          </Routes>
      </div>
  )
})

export default Routing
