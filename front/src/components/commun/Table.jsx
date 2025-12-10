import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import CustomizedMenus from "./CustomButtonMenu";

// Define your columns
const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  // Add a new column for the action button
  {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params) => <CustomizedMenus />,
  },
];

// Define your rows
const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon" },
  { id: 2, lastName: "Lannister", firstName: "Cersei" },
  { id: 3, lastName: "Lannister", firstName: "Jaime" },
  // more rows...
];

export default function DataGridDemo() {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </div>
  );
}
