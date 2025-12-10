import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../components/commun/BreadCrumb.jsx";
import FormEditEmployee from "../../../components/EmployeePage/EditEmployee/formEdit.jsx";

const EditEmployee = ({ employee }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  //get employee dat
  console.log(id);

  const PageTitle = "Modifier les données";
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
      <FormEditEmployee

        navigate={navigate} />
    </>
  );
};

export default EditEmployee;
