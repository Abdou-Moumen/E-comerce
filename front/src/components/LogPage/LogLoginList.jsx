import PropTypes from 'prop-types';
import {Grid, MenuItem, TextField} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";

const LogLoginList = ({
                          rowsAuth,
                          columnsAuth,
                          handleLoginRowItemClick,
                          setPaginationModel,
                          isLoading,
                          userLogin,
                          statusLogin,
                          handleUserLoginChange,
                          handleStatusLoginChange,
                          uniqueUsers,
                          hardcodedLoginAction,
                          loginLength,
                      }) => {

    return (<>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
                <TextField
                    fullWidth
                    id="select-condition"
                    label="Nom d'utilisateur"
                    select
                    value={userLogin}
                    onChange={handleUserLoginChange}
                >
                    {uniqueUsers.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                            {option.fullName}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    fullWidth
                    id="select-condition"
                    label="Action d'identifiant"
                    select
                    value={statusLogin}
                    onChange={handleStatusLoginChange}
                >
                    {hardcodedLoginAction.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                            {option.value}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
        </Grid>
        <DataGrid
            rows={rowsAuth}
            columns={columnsAuth}
            pageSize={10}
            onRowClick={handleLoginRowItemClick}
            sx={{height: 650, width: "100%"}}
            loading={isLoading}
            initialState={{
                pagination: {
                    paginationModel: {page: 0, pageSize: 10},
                },
            }}
            pageSizeOptions={[10]}
            onPaginationModelChange={setPaginationModel}
            rowCount={loginLength}
            paginationMode={"server"}
        />
    </>);
}

LogLoginList.propTypes = {
    rowsAuth: PropTypes.array.isRequired,
    columnsAuth: PropTypes.array.isRequired,
    handleLoginRowItemClick: PropTypes.func.isRequired,
    setPaginationModel: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    userLogin: PropTypes.number.isRequired,
    statusLogin: PropTypes.string.isRequired,
    handleUserLoginChange: PropTypes.func.isRequired,
    handleStatusLoginChange: PropTypes.func.isRequired,
    uniqueUsers: PropTypes.array.isRequired,
    hardcodedLoginAction: PropTypes.array.isRequired,
    loginLength: PropTypes.number.isRequired,
};

export default LogLoginList;