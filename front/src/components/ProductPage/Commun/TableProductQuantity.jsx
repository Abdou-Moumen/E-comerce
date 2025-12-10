import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Autocomplete, TextField } from '@mui/material';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import { Alert, Snackbar } from '@mui/material';
import { useGetDetails } from "../../../Hooks/Products/useProductDetails";

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [...oldRows, { id, size: null, color: null, quantity: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'size' },
        }));

    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
        </GridToolbarContainer>
    );
}

export default function TableSize({ rows, setRows }) {
    const [rowModesModel, setRowModesModel] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [snackbar, setSnackbar] = useState(null);
    const [sizes, setSizes] = useState([])
    const [colors, setColors] = useState([])

    const { data, isLoading, isSuccess } = useGetDetails();

    useEffect(() => {
        console.log("csfsg", rows)

    }, [rows])

    useEffect(() => {
        if (isSuccess) {
            setSizes(data.sizes.map(size => ({
                id: size.id,
                label: size.value
            })));
            setColors(data.colors.map(color => ({
                id: color.id,
                label: color.value
            })));
        }
    }, [data, isSuccess]);


    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        const errors = {};

        // Validate quantity
        if (updatedRow.quantity === '') {
            errors.quantity = 'Quantity is required';
        } else {
            const quantity = Number(updatedRow.quantity);
            if (isNaN(quantity) || quantity < 0 || quantity > 999999) {
                errors.quantity = 'Quantity must be between 0 and 999,999';
            }
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                [updatedRow.id]: errors,
            }));
            setSnackbar({ children: 'Please correct the errors', severity: 'error' });
            return newRow; // Return the row without updating
        }

        setValidationErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[updatedRow.id];
            return newErrors;
        });

        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleCloseSnackbar = () => setSnackbar(null);

    const columns = [

        {
            field: 'size',
            headerName: 'Size',
            width: 120,
            editable: true,
            type: 'singleSelect',
            renderCell: (params) => params.value ? params.value.label : '',
            renderEditCell: (params) => (
                <Autocomplete
                    options={sizes}
                    getOptionLabel={(option) => option.label || ''}
                    value={params.value}
                    onChange={(event, newValue) => {
                        params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                />
            ),
        },
        {
            field: 'color',
            headerName: 'Color',
            width: 120,
            editable: true,
            type: 'singleSelect',
            renderCell: (params) => params.value ? params.value.label : '',
            renderEditCell: (params) => (
                <Autocomplete
                    options={colors}
                    getOptionLabel={(option) => option.label || ''}
                    value={params.value}
                    onChange={(event, newValue) => {
                        params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                />
            ),
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            type: 'number',
            width: 120,
            align: 'left',
            headerAlign: 'left',
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Box
            sx={{
                height: 500,
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
                '& .error-row': {
                    backgroundColor: '#ffebee',
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
                getRowClassName={(params) =>
                    validationErrors[params.id] ? 'error-row' : ''
                }
            />
            {!!snackbar && (
                <Snackbar
                    open
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    onClose={handleCloseSnackbar}
                    autoHideDuration={6000}
                >
                    <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
            )}
        </Box>
    );
}