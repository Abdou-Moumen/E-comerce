import {useNavigate} from "react-router-dom";
import colorPalette from "../../../components/commun/color.jsx";
import Box from "@mui/material/Box";
import Breadcrumb from "../../../components/commun/BreadCrumb.jsx";
import BackButton from "../../../components/commun/BackButton.jsx";

const EditOrder = () => {
    const navigate = useNavigate();

    const breadcrumb = [
        {name: "Commende", path: "/admin/order"},
        {name: "Commende", path: "/admin/order"},
    ];

    return (<>
        <Breadcrumb
            breadcrumb={breadcrumb}
            navigate={navigate}
            PageTitle={"Modifier Commende"}
        />
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                borderRadius: "8px",
                background: "white",
                padding: "20px",
            }}
        >
            <BackButton navigate={navigate} />
        </Box>
    </>)
}

export default EditOrder;