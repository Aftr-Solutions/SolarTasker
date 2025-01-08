import React, { useEffect } from 'react'
import Header from '../../components/Header/Header'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpcommingTasks } from '../../store/ActionApis/upcommingTaskApi';
import SearchAndFilterTable from '../../components/filterTable/SearchAndFilterTable';
import { taskColumn, upcommingTaskColumn } from '../../components/columns/Columns';

const UpcomingTasks = () => {
  
  const dispatch = useDispatch();
  const { upcommingTasks } = useSelector((state) => state.upcommingTask);
  console.log(upcommingTasks);

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
      dispatch(fetchUpcommingTasks());
    }, []);
  return (
    <>
    <div>
      <Header />
    </div>
    <SearchAndFilterTable
  data={upcommingTasks}
  columns={upcommingTaskColumn}
  handleDelete={handleDelete}
  handleEdit={handleEdit}
  tableType= "UpcommingTask"
/>
    </>
  )
}

export default UpcomingTasks
