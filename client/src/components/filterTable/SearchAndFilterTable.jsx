import React, { useState } from "react";
import { Input, Select,} from "antd";
import ReusableTable from "../reusebaleTable/ReuseableTable";

const { Search } = Input;
const { Option } = Select;

const SearchAndFilterTable = ({ data , columns, handleDelete, handleEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  console.log(searchTerm)
  const [searchTermName, setSearchTermName] = useState("");
  console.log(searchTermName)
  const [selectedPlan, setSelectedPlan] = useState("");

 

  // Filter data based on search term and selected plan
  const filteredData = data.filter((item) => {
    const matchesSearch = item.email.toLowerCase().includes(searchTerm.toLowerCase());
    console.log(matchesSearch)
    const matchesSearchName = item.name.toLowerCase().includes(searchTermName.toLowerCase());
    const matchesPlan = selectedPlan ? item.plan === selectedPlan : true;
    return  matchesPlan && matchesSearch && matchesSearchName; 
  });
  console.log(filteredData)


  return (
    <div  className="shadow-md p-6 bg-gray-50 rounded mt-2">
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
          placeholder="Search By Name"
          onChange={(e) => setSearchTermName(e.target.value)}
          style={{ width: "200px" }}
          allowClear
        />

<Search
          placeholder="Search By Email"
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
          <Option value={0}>Basic</Option>
          <Option value={1}>Premium</Option>
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
