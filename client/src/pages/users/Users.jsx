import React, { useEffect } from "react";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../store/ActionApis/userApi";
import SearchAndFilterTable from "../../components/filterTable/SearchAndFilterTable";
import { userColumn } from "../../components/columns/Columns";

const Users = () => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.user);
  console.log(users);

  useEffect(() => {
    dispatch(fetchUsers());
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
  data={users}
  columns={userColumn}
  handleDelete={handleDelete}
  handleEdit={handleEdit}
  tableType= "Users"
/>
    </>
  );
};

export default Users;
