import React from "react";
import { Avatar, Tag } from "antd";




// Clients Columns


// Function to generate a random light color
const getRandomLightColor = () => {
  const colors = [
    "#FFC0CB", // Light Pink
    "#FFDAB9", // Peach Puff
    "#FFB6C1", // Light Pink 2
    "#E6E6FA", // Lavender
    "#D8BFD8", // Thistle
    "#FFFACD", // Lemon Chiffon
    "#F5F5DC", // Beige
    "#ADD8E6", // Light Blue
    "#E0FFFF", // Light Cyan
    "#F0E68C", // Khaki
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Function to generate a random slightly dark color for the text
const getRandomDarkColor = () => {
  const colors = [
    "#4B0082", // Indigo
    "#6A5ACD", // Slate Blue
    "#8B4513", // Saddle Brown
    "#2F4F4F", // Dark Slate Gray
    "#800000", // Maroon
    "#556B2F", // Dark Olive Green
    "#4B5320", // Army Green
    "#483D8B", // Dark Slate Blue
    "#708090", // Slate Gray
    "#2E8B57", // Sea Green
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Function to assign colors to different plan statuses
const getPlanTagColor = (plan) => {
  switch (plan) {
    case 0:
      return "#5D87FF"; // Shipped-like color
    case 1:
      return "#13DEB9"; // Delivered-like color
    case "Trial":
      return "orange"; // Pending-like color
    default:
      return "default"; // Default color for undefined plans
  }
};
export const clientColumns = [
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
    width: 150,
    fixed: "left",
    sorter: (a, b) => a.name.length - b.name.length,
    render: (_, record) => {
      const backgroundColor = getRandomLightColor();
      const textColor = getRandomDarkColor();

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{
              backgroundColor,
              color: textColor, // Apply random dark text color
              verticalAlign: "middle",
              marginRight: "10px",
            }}
            size="large"
          >
            {record.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </Avatar>
          <div>
            <div
              style={{
                fontWeight: "600",
                fontSize: "12px",
                color: "black", // Apply random dark text color
              }}
            >
              {record.name}
            </div>
          </div>
        </div>
      );
    },
  },

  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 200,
    sorter: (a, b) => a.email.length - b.email.length,
    render: (row) => <span className="">{row}</span>,
  },

  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    width: 200,
    sorter: (a, b) => a.address.length - b.address.length,
    render: (row) => <span className="">{row}</span>,
  },

  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    width: 120,
    sorter: (a, b) => a.amount - b.amount,
    render: (value) => `$${value}`,
  }, // Format as currency

  {
    title: "Plan",
    dataIndex: "plan",
    key: "plan",
    width: 150,
    sorter: (a, b) => a.plan - b.plan,
    render: (plan) => (
      <Tag
        color={getPlanTagColor(plan)}
        style={{
          fontSize: "12px",
          padding: "2px 2px",
          borderRadius: "10px",
          textAlign: "center",
          width: "100px",
          color: "white",
        }}
        
      >
        {plan === 0 ? "Basic" : "Premium"}
      </Tag>
    ),
  },
  {
    title: "Service Plan Duration",
    dataIndex: "service_plan_duration",
    key: "service_plan_duration",
    width: 200,
    sorter: (a, b) =>
      a.service_plan_duration - b.service_plan_duration,
    render: (row) => <span className="">{row}</span>,
  },
  {
    title: "Region Preference",
    dataIndex: "region_preference",
    key: "region_preference",
    width: 180,
    sorter: (a, b) => a.region_preference - b.region_preference,
    render: (row) => <span className="">{row}</span>,
  },
];


// Region Columns 


export const regionColumns = [
  
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      width: 200,
      sorter: (a, b) => a.area.length - b.area.length,
      render: (row) => <span className="">{row}</span>,
    },

    {
      title: "Region",
      dataIndex: "region",
      key: "region",
      width: 200,
      sorter: (a, b) => a.region.length - b.region.length,
      render: (row) => <span className="">{row}</span>,
    },
  
  
]


// Users Column 

export const workerColumns = [
  
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
    width: 150,
    fixed: "left",
    sorter: (a, b) => a.name.length - b.name.length,
    render: (_, record) => {
      const backgroundColor = getRandomLightColor();
      const textColor = getRandomDarkColor();

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{
              backgroundColor,
              color: textColor, // Apply random dark text color
              verticalAlign: "middle",
              marginRight: "10px",
            }}
            size="large"
          >
            {record.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </Avatar>
          <div>
            <div
              style={{
                fontWeight: "600",
                fontSize: "12px",
                color: "black", // Apply random dark text color
              }}
            >
              {record.name}
            </div>
          </div>
        </div>
      );
    },
  },

  {
    title: "CNIC",
    dataIndex: "cnic_number",
    key: "cnic_number",
    width: 200,
    sorter: (a, b) => a.cnic_number.length - b.cnic_number.length,
    render: (row) => <span className="">{row}</span>,
  },

  {
    title: "Number",
    dataIndex: "number",
    key: "number",
    width: 200,
    sorter: (a, b) => a.number.length - b.number.length,
    render: (row) => <span className="">{row}</span>,
  },

  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    width: 200,
    sorter: (a, b) => a.address.length - b.address.length,
    render: (row) => <span className="">{row}</span>,
  },


]


export const teamColumn = [
  {
    title: "Team Name",
    dataIndex: "team_name",
    key: "team_name",
    width: 200,
    sorter: (a, b) => a.team_name.length - b.team_name.length,
    render: (row) => <span className="">{row}</span>,
  },
  {
    title: "Team Lead",
    dataIndex: "team_lead",
    key: "team_lead",
    width: 200,
    sorter: (a, b) => a.team_lead.length - b.team_lead.length,
    render: (row) => <span className="">{row}</span>,
  },
  {
    title: "Team Member 1",
    dataIndex: "member1",
    key: "member1",
    width: 200,
    sorter: (a, b) => a.member1.length - b.member1.length,
    render: (row) => <span className="">{row}</span>,
  },
  {
    title: "Team Member 2",
    dataIndex: "member2",
    key: "member2",
    width: 200,
    sorter: (a, b) => a.member2.length - b.member2.length,
    render: (row) => <span className="">{row}</span>,
  },
 

]


export const userColumn = [
  {
    title: "User Name",
    dataIndex: "user_name",
    key: "user_name",
    width: 200,
    sorter: (a, b) => a.user_name.length - b.user_name.length,
    render: (row) => <span className="">{row}</span>,
  },
  {
    title: "User Email",
    dataIndex: "email",
    key: "email",
    width: 200,
    sorter: (a, b) => a.email.length - b.email.length,
    render: (row) => <span className="">{row}</span>,
  },
 
  {
    title: "User Role",
    dataIndex: "role",
    key: "role",
    width: 200,
    sorter: (a, b) => a.role.length - b.role.length,
    render: (row) => <span className="">{row}</span>,
  },

]

export const taskColumn = [
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Client ID',
    dataIndex: 'client_id',
    key: 'client_id',
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_at',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Is Active',
    dataIndex: 'isactive',
    key: 'isactive',
    render: (value) => (value ? 'Yes' : 'No'), // Optional: Format the value
  },
  {
    title: 'Last Service Date',
    dataIndex: 'last_service_date',
    key: 'last_service_date',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Number',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: 'Plan',
    dataIndex: 'plan',
    key: 'plan',
  },
  {
    title: 'Region Preference',
    dataIndex: 'region_preference',
    key: 'region_preference',
  },
  {
    title: 'Response',
    dataIndex: 'response',
    key: 'response',
  },
  {
    title: 'Service Date',
    dataIndex: 'service_date',
    key: 'service_date',
  },
  {
    title: 'Service Plan Duration',
    dataIndex: 'service_plan_duration',
    key: 'service_plan_duration',
  },
  {
    title: 'Task ID',
    dataIndex: 'task_id',
    key: 'task_id',
  },
  {
    title: 'Task Status',
    dataIndex: 'task_status',
    key: 'task_status',
  },
  {
    title: 'Team ID',
    dataIndex: 'team_id',
    key: 'team_id',
  },
  {
    title: 'Upcoming Service Date',
    dataIndex: 'upcoming_service_date',
    key: 'upcoming_service_date',
  },
];

