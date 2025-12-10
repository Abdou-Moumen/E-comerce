import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Paper, Stack } from "@mui/material";
import Breadcrumb from "../../../components/commun/BreadCrumb.jsx";
import EmployeeList from "../../../components/EmployeePage/EmployeeList/EmployeeList.jsx";
import EmployeeSearch from "../../../components/EmployeePage/EmployeeList/EmployeeSearch.jsx";
import EmployeeAction from "../../../components/EmployeePage/EmployeeList/EmployeeActions.jsx";

const EmployeePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("all");

  const breadcrumb = [{ name: "Employees", path: "/admin/employee" }];

  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        <Breadcrumb
          breadcrumb={breadcrumb}
          navigate={navigate}
          PageTitle="Employees"
        />

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider"
          }}
        >
          <EmployeeSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </Paper>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider"
          }}
        >
          <Box sx={{ p: 3 }}>
            <EmployeeAction />
          </Box>
          <Box sx={{ px: 3, pb: 3 }}>
            <EmployeeList searchQuery={searchQuery} />
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};

export default EmployeePage;