import React, { useState } from 'react'
import ReusableTable from '../../components/reusebaleTable/ReuseableTable';
import {message} from 'antd'
import Header from '../../components/Header/Header';

const Clients = () => {
  const [data, setData] = useState(
    Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      name: `User ${index + 1}`,
      age: Math.floor(Math.random() * 50) + 20,
    }))
  );
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name',  width: 200,
      sorter: (a, b) => a.name.length - b.name.length,
      render: (row) => <span className="text-primary">{row}</span>,
    },
    { title: 'Age', dataIndex: 'age', key: 'age', width: 200,  sorter: (a, b) => a.name.length - b.name.length,
      render: (row) => <span className="text-primary">{row}</span>, },
  ];

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
    <div>
      <Header />
    </div>
    {/* <ReusableTable
      columns={columns}
      data={data}
      onDelete={handleDelete}
      onEdit={handleEdit}
      paginationConfig={{
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} items`,
      }}
    /> */}
  </div>
  )
}

export default Clients
