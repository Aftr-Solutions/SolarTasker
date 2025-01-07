import React, { useEffect, useState } from "react";
import { Input, Select,} from "antd";
import ReusableTable from "../reusebaleTable/ReuseableTable";

const { Search } = Input;
const { Option } = Select;

const SearchAndFilterTable = ({ data , columns, handleDelete, handleEdit , tableType}) => {
  console.log("tableType==>", tableType)
  console.log("Data as props ===>", data )

  //Table Sates
  const [tableData, setTableData]= useState([])

// Client States
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermName, setSearchTermName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("")

// Region States
  const [searchTermByArea, setSearchTermByArea] = useState("");
  const [searchTermByRegion, setSearchTermByRegion] = useState("");


  // Filter data based on search name, email, and selected plan
  useEffect(() => {
    let filteredData = data;

    if (tableType === "clients") {
      filteredData = data.filter((item) => {
        const matchesSearch = item.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesSearchName = item.name
          .toLowerCase()
          .includes(searchTermName.toLowerCase());
        const matchesPlan = selectedPlan ? item.plan === selectedPlan : true;
        return matchesPlan && matchesSearch && matchesSearchName;
      });
    } else if (tableType === "regions") {
      filteredData = data.filter((item) => {
        const matchesSearchArea = item.area
          .toLowerCase()
          .includes(searchTermByArea.toLowerCase());
        const matchesSearchRegion = item.region
          .toLowerCase()
          .includes(searchTermByRegion.toLowerCase());
        return matchesSearchArea && matchesSearchRegion;
      });
    }

    setTableData(filteredData);
  }, [
    data,
    tableType,
    searchTerm,
    searchTermName,
    selectedPlan,
    searchTermByArea,
    searchTermByRegion,
  ]);
 

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


        {tableType=== "clients"? (
          <>
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
        </Select></>
        ):(
          <>

<Search
          placeholder="Search By Area"
          onChange={(e) => setSearchTermByArea(e.target.value)}
          style={{ width: "200px" }}
          allowClear
        />

<Search
          placeholder="Search By Region"
          onChange={(e) => setSearchTermByRegion(e.target.value)}
          style={{ width: "200px" }}
          allowClear
        />

          </>
        ) 
        }
      


      </div>



      {/* Filtered data table */}
      <ReusableTable
      columns={columns}
      data={tableData}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
    </div>
  );
};

export default SearchAndFilterTable;
