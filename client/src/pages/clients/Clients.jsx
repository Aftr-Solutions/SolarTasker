import React, { useEffect, useState } from "react";
import { message } from "antd";
import { clientColumns } from "../../components/columns/Columns";
import SearchAndFilterTable from "../../components/filterTable/SearchAndFilterTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients } from '../../store/ActionApis/clientApi';

const Clients = () => {
  const dispatch = useDispatch();

  const { clients } = useSelector((state) => state.client);

  console.log(clients);

  useEffect(() => {
    dispatch(fetchClients());
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
    <div className="">
      <SearchAndFilterTable
        data={clients}
        columns={clientColumns}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default Clients;
