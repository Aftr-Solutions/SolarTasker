import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegions } from '../../store/ActionApis/regionApi';
import SearchAndFilterTable from '../../components/filterTable/SearchAndFilterTable';
import {  regionColumns } from '../../components/columns/Columns';
import Header from '../../components/Header/Header'

const Region = () => {
  const dispatch = useDispatch();

  const { regions } = useSelector((state) => state.region);
  console.log(regions)

  useEffect(() => {
    dispatch(fetchRegions());
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
        data={regions}
        columns={regionColumns}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        tableType="regions"
      />
    </>
  )
};

export default Region;
