import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkers } from '../../store/ActionApis/workerApi';
import SearchAndFilterTable from '../../components/filterTable/SearchAndFilterTable';
import { workerColumns } from '../../components/columns/Columns';

const Workers = () => {
  const dispatch = useDispatch();
  
  const { workers, loading } = useSelector((state) => state.worker);

  console.log(workers);

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
    dispatch(fetchWorkers());
  }, []);

  return (
    <>
    <div className="">
      <SearchAndFilterTable
        data={workers}
        columns={workerColumns}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        tableType="workers"
      />
    </div>
    </>
  )
}

export default Workers
