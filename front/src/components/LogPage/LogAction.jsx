import PropTypes from 'prop-types';
import {Typography} from "@mui/material";

const LogAction = ({
                       showLogin,
                       showOrders,
                       handleOrderLogsClick,
                       handleLoginLogsClick,
                   }) => {

    return (<div style={{display: "flex", gap: "20px"}}>
        <Typography
            onClick={handleOrderLogsClick}
            sx={{
                cursor: "pointer",
                borderBottom: showOrders ? "2px solid blue" : "none",
                color: showOrders ? "blue" : "inherit",
                paddingBottom: "5px",
            }}
        >
            Commandes Logs
        </Typography>
        <Typography
            onClick={handleLoginLogsClick}
            sx={{
                cursor: "pointer",
                borderBottom: showLogin ? "2px solid blue" : "none",
                color: showLogin ? "blue" : "inherit",
                paddingBottom: "5px",
            }}
        >
            identifiant Logs
        </Typography>
    </div>);
}

LogAction.propTypes = {
    showLogin: PropTypes.bool,
    showOrders: PropTypes.bool,
    handleOrderLogsClick: PropTypes.func,
    handleLoginLogsClick: PropTypes.func,
}

export default LogAction;