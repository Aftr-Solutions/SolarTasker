import React, { useEffect } from 'react'
import Header from '../../components/Header/Header'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../store/ActionApis/taskApi';

const Tasks = () => {

  const dispatch = useDispatch();

  const { tasks } = useSelector((state) => state.task);
  console.log(tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  return (
    <div>
      <Header />
    </div>
  )
}

export default Tasks
