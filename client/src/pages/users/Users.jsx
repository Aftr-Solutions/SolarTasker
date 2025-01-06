import React, { useEffect } from "react";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../store/ActionApis/userApi";

const Users = () => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.user);
  console.log(users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <div>
      <Header />
    </div>
  );
};

export default Users;
