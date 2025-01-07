import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeams } from '../../store/ActionApis/teamApi';
import SearchAndFilterTable from '../../components/filterTable/SearchAndFilterTable';
import { teamColumn } from '../../components/columns/Columns';

const Team = () => {
  const dispatch = useDispatch();

  const { teams } = useSelector((state) => state.team);
  console.log(teams);

  const handleDelete = (record) => {
    console.log(record);
    setData((prevData) => prevData.filter((item) => item.id !== record.id));
    message.success("Record deleted successfully!");
  };

  const handleEdit = (updatedRecord) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === updatedRecord.id ? updatedRecord : item
      )
    );
  };
  

  useEffect(() => {
    dispatch(fetchTeams());
  }, []);

  return (
    <>
    <div className="">
      <SearchAndFilterTable
        data={teams}
        columns={teamColumn}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        tableType="teams"
      />
    </div>
    </>
  )
}

export default Team
