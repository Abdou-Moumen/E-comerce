import PropTypes from 'prop-types';
import {Grid, MenuItem, TextField} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";

const LogOrderList = ({
                          rowsOrder,
                          columnsOrder,
                          handleOrderRowItemClick,
                          setPaginationModel,
                          isLoading,
                          userOrder,
                          statusOrder,
                          handleUserOrderChange,
                          handleStatusOrderChange,
                          uniqueUsers,
                          hardcodedOrderAction,
                          orderLength,
                      }) => {

    return (<>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
                <TextField
                    fullWidth
                    id="select-condition"
                    label="Nom d'utilisateur"
                    select
                    value={userOrder}
                    onChange={handleUserOrderChange}
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
                    label="Action de commande"
                    select
                    value={statusOrder}
                    onChange={handleStatusOrderChange}
                >
                    {hardcodedOrderAction.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                            {option.value}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
        </Grid>
        <DataGrid
            rows={rowsOrder}
            columns={columnsOrder}
            pageSize={10}
            onRowClick={handleOrderRowItemClick}
            sx={{height: 650, width: "100%"}}
            loading={isLoading}
            initialState={{
                pagination: {
                    paginationModel: {page: 0, pageSize: 10},
                },
            }}
            pageSizeOptions={[10]}
            onPaginationModelChange={setPaginationModel}
            rowCount={orderLength}
            paginationMode={"server"}
        />
    </>);
}

LogOrderList.propTypes = {
    rowsOrder: PropTypes.array.isRequired,
    columnsOrder: PropTypes.array.isRequired,
    handleOrderRowItemClick: PropTypes.func.isRequired,
    setPaginationModel: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    userOrder: PropTypes.number.isRequired,
    statusOrder: PropTypes.string.isRequired,
    handleUserOrderChange: PropTypes.func.isRequired,
    handleStatusOrderChange: PropTypes.func.isRequired,
    uniqueUsers: PropTypes.array.isRequired,
    hardcodedOrderAction: PropTypes.array.isRequired,
    orderLength: PropTypes.number.isRequired,
};

export default LogOrderList;