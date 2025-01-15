import React, { useEffect } from 'react'
import Header from '../../components/Header/Header'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpcommingTasks } from '../../store/ActionApis/upcommingTaskApi';

const UpcomingTasks = () => {
  
  const dispatch = useDispatch();
  const { upcommingTasks } = useSelector((state) => state.upcommingTask);
  console.log(upcommingTasks);

  
    useEffect(() => {
      dispatch(fetchUpcommingTasks());
    }, []);
  return (
    <div>
      <Header />
    </div>
  )
}

export default UpcomingTasks
