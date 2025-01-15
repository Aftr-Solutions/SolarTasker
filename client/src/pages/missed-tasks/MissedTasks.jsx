import React, { useEffect } from 'react'
import Header from '../../components/Header/Header'
import { useDispatch, useSelector } from 'react-redux';
import SearchAndFilterTable from '../../components/filterTable/SearchAndFilterTable';
import { fetchMissedTasks } from '../../store/ActionApis/missedTasksApi';
import { missedTaskColumn, taskColumn } from '../../components/columns/Columns';

const MissedTasks = () => {

  const dispatch = useDispatch();
  const { missedTasks } = useSelector((state) => state.missedTask);
  console.log(missedTasks);

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
      dispatch(fetchMissedTasks());
    }, []);
  return (
    <>
    <div>
      <Header />
    </div>
    <SearchAndFilterTable
  data={missedTasks}
  columns={missedTaskColumn}
  handleDelete={handleDelete}
  handleEdit={handleEdit}
  tableType= "UpcommingTask"
/>
    </>
  )
}

export default MissedTasks
