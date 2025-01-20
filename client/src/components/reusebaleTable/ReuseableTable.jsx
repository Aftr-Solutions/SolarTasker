import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Pagination, message } from "antd";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import { Tooltip } from "antd";
import CreateDialog from "../createDialog/CreateDialog";
import { useLocation } from "react-router";

const ReusableTable = ({
  columns,
  data,
  onDelete,
  onEdit,
  paginationConfig,
}) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [btnName, setBtnName] = React.useState(null);

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
      title: "Action",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <div className="flex space-x-3">
          {/* View Action */}
          <Tooltip title="Edit">
            <button
              onClick={() => handleEdit(record)}
              className="flex items-center justify-center two-icons w-10 h-10 rounded-full transition duration-300 hover:bg-[#13DEB9] hover:text-white"
            >
              <DriveFileRenameOutlineRoundedIcon
                className="icons"
                style={{ fontSize: "20px", color: "#13DEB9" }}
              />
            </button>
          </Tooltip>

          {/* Delete Action */}
          <Tooltip title="Delete">
            <button
              onClick={() => handleDelete(record)}
              className="flex items-center justify-center w-10 h-10 two-icons  rounded-full transition duration-300 hover:bg-[#FA896B] hover:text-white"
            >
              <DeleteSweepRoundedIcon
                className="icons"
                style={{ fontSize: "20px", color: "#FA896B" }}
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const location = useLocation();
  useEffect(() => {
    const btnName = location.pathname.replace("/", ""); // remove / from url
    const capitalName = btnName.charAt(0).toUpperCase() + btnName.slice(1); // make first word cap
    setBtnName(capitalName);
  }, [location]);

  return (
    <>
      <div>
        <Table
          className=" table-height custom-scroll-table mt-5 "
          columns={enhancedColumns}
          dataSource={paginatedData}
          pagination={false} // Disable built-in pagination
          rowClassName={() => "small-row"} // Custom class for small row height
          scroll={{
            x: "max-content", // Set horizontal scrolling width
            y: 380, // Set vertical scrolling height
          }}
        />

        {/* Pagination */}
        <Pagination
          className=" p-3"
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
      {/* <Modal
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
      </Modal> */}

      {/* Edit Dialog */}
      <CreateDialog
        title={
          location.pathname === "/users"
            ? "Reset Password"
            : `Edit ${location.pathname === "/" ? "Client" : btnName}`
        }
        isDialogOpen={isEditModalOpen}
        handleDialogClose={() => setEditModalOpen(false)}
        path={location.pathname}
        record={selectedRecord} // pass row data which can edit
      />

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
    message.success("Record updated successfully!");
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
