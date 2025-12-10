import React from 'react';
import { useNavigate } from "react-router-dom";
import { Typography, Box, Container, Grid, Paper, Chip, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Breadcrumb from "../../components/commun/BreadCrumb.jsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();

    const breadcrumb = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/admin/" },
    ];

    const recentOrders = [
        { id: 1, createdAt: '2024-02-08', user: 'Mohamed Ali', orderId: 'OR783', status: 'Pending', total: 150.99 },
        { id: 2, createdAt: '2024-02-10', user: 'John Doe', orderId: 'OR784', status: 'Shipped', total: 89.99 },
        { id: 3, createdAt: '2024-02-12', user: 'Jane Smith', orderId: 'OR785', status: 'Delivered', total: 200.50 },
        { id: 4, createdAt: '2024-02-14', user: 'Emily Johnson', orderId: 'OR786', status: 'Processing', total: 75.25 },
        { id: 5, createdAt: '2024-02-15', user: 'Michael Brown', orderId: 'OR787', status: 'Cancelled', total: 120.00 },
    ];

    const salesData = [
        { month: 'Jan', sales: 4000 },
        { month: 'Feb', sales: 3000 },
        { month: 'Mar', sales: 5000 },
        { month: 'Apr', sales: 4500 },
        { month: 'May', sales: 6000 },
        { month: 'Jun', sales: 5500 },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'success';
            case 'Shipped': return 'info';
            case 'Pending': return 'warning';
            case 'Processing': return 'secondary';
            case 'Cancelled': return 'error';
            default: return 'default';
        }
    };

    const columns = [
        {
            field: 'createdAt',
            headerName: 'Date',
            flex: 1,
            valueFormatter: (params) => new Date(params.value).toLocaleDateString()
        },
        { field: 'user', headerName: 'Customer', flex: 1.5 },
        { field: 'orderId', headerName: 'Order ID', flex: 1 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={getStatusColor(params.value)}
                    size="small"
                />
            ),
        },
        {
            field: 'total',
            headerName: 'Total',
            flex: 1,
            valueFormatter: (params) => {
                if (params.value != null && params.value !== undefined) {
                    return `$${params.value.toFixed(2)}`;
                }
                return 'N/A';
            },
            cellClassName: 'font-tabular-nums',
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Tooltip title="View">
                        <IconButton onClick={() => handleView(params.row.id)} size="small">
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(params.row.id)} size="small">
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(params.row.id)} size="small">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    const handleView = (id) => {
        console.log(`View order ${id}`);
        // Implement view logic
    };

    const handleEdit = (id) => {
        console.log(`Edit order ${id}`);
        // Implement edit logic
    };

    const handleDelete = (id) => {
        console.log(`Delete order ${id}`);
        // Implement delete logic
    };

    const StatCard = ({ title, value, color }) => (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, backgroundColor: color, color: 'white' }}>
            <Typography variant="h6" fontWeight="bold">{title}</Typography>
            <Typography variant="h4" fontWeight="bold">{value}</Typography>
        </Paper>
    );

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
            <Container maxWidth="xl">
                <Breadcrumb
                    breadcrumb={breadcrumb}
                    navigate={navigate}
                    PageTitle="Dashboard"
                />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <StatCard title="Total Sales" value="$20,000" color="#3f51b5" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <StatCard title="Total Orders" value="150" color="#f50057" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <StatCard title="Total Customers" value="80" color="#00a152" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <StatCard title="Total Products" value="200" color="#ff9100" />
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Sales Overview</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <ChartTooltip />
                                    <Bar dataKey="sales" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Recent Orders</Typography>
                            <Box sx={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={recentOrders}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5, 10, 20]}
                                    checkboxSelection
                                    disableSelectionOnClick
                                    components={{
                                        Toolbar: GridToolbar,
                                    }}
                                    sx={{
                                        border: 'none',
                                        '& .MuiDataGrid-cell:focus': {
                                            outline: 'none',
                                        },
                                        '& .font-tabular-nums': {
                                            fontVariantNumeric: 'tabular-nums',
                                        },
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Dashboard;