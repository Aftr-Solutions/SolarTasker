import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Pagination, message } from 'antd';

const ReusableTable = ({ columns, data, onDelete, onEdit, paginationConfig, scrollHeight = 350  }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);

  // Pagination logic
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Open Edit Modal
  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditModalOpen(true);
  };

  // Open Delete Modal
  const handleDelete = (record) => {
    setSelectedRecord(record);
    setDeleteModalOpen(true);
  };

  // Add Edit and Delete buttons to columns
  const enhancedColumns = [
    ...columns,
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
    <div className='paper-shadow'>

      <Table
      // style={{width: "99%"}}    
      className=' table-height w-full mt-5 '
        columns={enhancedColumns}
        dataSource={paginatedData}
        rowKey="id"
        pagination={false} // Disable built-in pagination
        scroll={{
            y: scrollHeight, // Vertical scrolling with fixed height
            x: '100%', // Horizontal scrolling for larger tables
          }}
        
        rowClassName={() => 'small-row'} // Custom class for small row height
        />
        
      

      {/* Pagination */}
      <Pagination
      className=' p-3'
      current={currentPage}
      pageSize={pageSize}
      total={data.length}
      onChange={handlePageChange}
      showSizeChanger
      onShowSizeChange={(_, size) => setPageSize(size)}
      {...paginationConfig} 
      />
      </div>

      {/* Edit Modal */}
      <Modal
        title="Edit Record"
        open={isEditModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
      >
        <EditModalContent
          record={selectedRecord}
          onEdit={(updatedRecord) => {
            onEdit(updatedRecord);
            setEditModalOpen(false);
          }}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={() => {
          onDelete(selectedRecord);
          setDeleteModalOpen(false);
        }}
        okText="Delete"
        cancelText="Cancel"
      >
        Are you sure you want to delete this record?
      </Modal>
    </>
  );
};

const EditModalContent = ({ record, onEdit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onEdit({ ...record, ...values });
    message.success('Record updated successfully!');
  };

  return (
    <Form form={form} initialValues={record} onFinish={handleFinish}>
      {Object.keys(record || {}).map((key) => (
        <Form.Item key={key} label={key} name={key}>
          <Input />
        </Form.Item>
      ))}
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
};

export default ReusableTable;
