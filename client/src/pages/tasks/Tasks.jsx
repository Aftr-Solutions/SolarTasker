import React, { useEffect } from 'react'
import Header from '../../components/Header/Header'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../store/ActionApis/taskApi';
import SearchAndFilterTable from '../../components/filterTable/SearchAndFilterTable';
import { taskColumn } from '../../components/columns/Columns';

const Tasks = () => {

  const dispatch = useDispatch();

  const { tasks } = useSelector((state) => state.task);
  console.log(tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);


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
  return (
    <>
    <div>
      <Header />
    </div>
    <SearchAndFilterTable
  data={tasks}
  columns={taskColumn}
  handleDelete={handleDelete}
  handleEdit={handleEdit}
  tableType= "tasks"
/>
    </>
  )
}

export default Tasks
