import React, { useEffect } from 'react'
import Header from '../../components/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkers } from '../../store/ActionApis/workerApi';

const Workers = () => {
  const dispatch = useDispatch();
  
  const { workers, loading } = useSelector((state) => state.worker);

  console.log(workers);

  useEffect(() => {
    dispatch(fetchWorkers());
  }, []);

  return (
    <div>
      <Header />
    </div>
  )
}

export default Workers
