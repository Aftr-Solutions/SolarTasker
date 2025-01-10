import React, { useState } from 'react'
import {message} from 'antd'
import { clientColumns } from '../../components/columns/Columns';
import SearchAndFilterTable from '../../components/filterTable/SearchAndFilterTable';

const Clients = () => {
  const [data, setData] = useState(
    Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      address: `Address ${index + 1}`,
      amount: Math.floor(Math.random() * 10000) + 100, // Random amount between 100 and 10000
      plan: index % 2 === 0 ? 'Premium' : 'Basic', // Alternating between 'Premium' and 'Basic'
      servicePlanDuration: `${Math.floor(Math.random() * 12) + 1} months`, // Random duration between 1 and 12 months
      regionPreference: index % 3 === 0 ? 'North America' : index % 3 === 1 ? 'Europe' : 'Asia', // Alternating regions
    }))
  );


  // const columns = [
  //   { title: 'Name', dataIndex: 'name', key: 'name',  width: 200,
  //     sorter: (a, b) => a.name.length - b.name.length,
  //     render: (row) => <span className="">{row}</span>,
  //   },
  //   { title: 'Age', dataIndex: 'age', key: 'age', width: 200,  sorter: (a, b) => a.name.length - b.name.length,
  //     render: (row) => <span className="">{row}</span>, },
  // ];

  const handleDelete = (record) => {
    console.log(record)
    setData((prevData) => prevData.filter((item) => item.id !== record.id));
    message.success('Record deleted successfully!');
  };

  const handleEdit = (updatedRecord) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === updatedRecord.id ? updatedRecord : item
      )
    );
  };
  return (
    <div className=''>
      <SearchAndFilterTable data = {data} columns={clientColumns} handleDelete={handleDelete} handleEdit={handleEdit} />
  </div>
  )
}

export default Clients
