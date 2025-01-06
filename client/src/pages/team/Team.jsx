import React, { useEffect } from 'react'
import Header from '../../components/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeams } from '../../store/ActionApis/teamApi';

const Team = () => {
  const dispatch = useDispatch();

  const { teams } = useSelector((state) => state.team);
  console.log(teams);
  

  useEffect(() => {
    dispatch(fetchTeams());
  }, []);

  return (
    <div>
      <Header />
    </div>
  )
}

export default Team
