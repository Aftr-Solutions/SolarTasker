import React, { useState } from "react";
import { Input, Select,} from "antd";
import ReusableTable from "../reusebaleTable/ReuseableTable";

const { Search } = Input;
const { Option } = Select;

const SearchAndFilterTable = ({ data , columns, handleDelete, handleEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

 

  // Filter data based on search term and selected plan
  const filteredData = data.filter((item) => {
    const matchesSearch = item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan ? item.plan === selectedPlan : true;
    return matchesSearch && matchesPlan;
  });


  return (
    <div  className="shadow-md p-6 bg-gray-100 rounded mt-2">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {/* Search input */}
        <Search
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "200px" }}
          allowClear
        />

        {/* Select dropdown */}
        <Select
          placeholder="Select Plan"
          onChange={(value) => setSelectedPlan(value)}
          style={{ width: "150px" }}
          allowClear
        >
          <Option value="Basic">Basic</Option>
          <Option value="Premium">Premium</Option>
        </Select>

      </div>

      {/* Filtered data table */}
      <ReusableTable
      columns={columns}
      data={filteredData}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
    </div>
  );
};

export default SearchAndFilterTable;
