import React from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../components/commun/BreadCrumb.jsx";
import FormAddEmployee from "../../../components/EmployeePage/AddEmployee/formAdd.jsx";

const AddEmployee = () => {
  const navigate = useNavigate();

  const PageTitle = "Ajouter Employée";
  const breadcrumb = [
    { name: "Employee", path: "/admin/employee" },
    { name: "Ajouter Employee", path: "/admin/employee/add" },
  ];




  return (
    <>
      <Breadcrumb
        breadcrumb={breadcrumb}
        PageTitle={PageTitle}
        navigate={navigate}
      />
      <FormAddEmployee navigate={navigate} />
    </>
  );
};

export default AddEmployee;
