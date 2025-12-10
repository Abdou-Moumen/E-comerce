import React, { useEffect, useState } from 'react';
import {
    Box, Button, Autocomplete, TextField, Alert,
    ThemeProvider, createTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import { useGetDetails } from "../../../Hooks/Products/useProductDetails";

const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5',
        },
        background: {
            default: '#ffffff',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: 'none',
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'none',
                    },
                },
                columnHeaders: {
                    backgroundColor: '#f5f5f5',
                },
                row: {
                    '&:hover': {
                        backgroundColor: '#f5f5f5',
                    },
                },
            },
        },
    },
});

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [...oldRows, { id, size: null, color: null, quantity: '', flag: 'new', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'size' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClick}
            >
                Ajouter
            </Button>
        </GridToolbarContainer>
    );
}

export default function TableSize({ rows, setRows, errorMessage, setErrorMessage, isReadOnly }) {
    const [rowModesModel, setRowModesModel] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    // const [errorMessage, setErrorMessage] = useState(null);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);

    const { data, isLoading, isSuccess } = useGetDetails();

    useEffect(() => {
        if (isSuccess) {
            setSizes(data.sizes.map(size => ({
                id: size.id,
                label: size.value
            })));
            setColors(data.colors.map(color => ({
                id: color.id,
                label: color.value,
                hex: color.hex
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
        setRows(rows.map((row) =>
            row.id === id ? { ...row, flag: 'deleted' } : row
        ));
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

        // if (updatedRow.size === null) {
        //     errors.size = 'La taille est requise';
        // }

        // if (updatedRow.color === null) {
        //     errors.color = 'La couleur est requise';
        // }

        if (updatedRow.quantity === '' || updatedRow.quantity === null || updatedRow.quantity === undefined) {
            errors.quantity = 'La quantité est requise';
        } else {
            const quantity = Number(updatedRow.quantity);
            if (isNaN(quantity) || quantity < 0 || quantity > 999999) {
                errors.quantity = 'La quantité doit être comprise entre 0 et 999 999';
            }
        }

        const isDuplicate = rows.some(row =>
            row.id !== updatedRow.id &&
            row.size?.id === updatedRow.size?.id &&
            row.color?.id === updatedRow.color?.id &&
            row.flag !== 'deleted'
        );

        if (isDuplicate) {
            errors.duplicate = 'Cette combinaison de taille et couleur existe déjà';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                [updatedRow.id]: errors,
            }));
            setErrorMessage('Veuillez corriger les erreurs');
            return newRow;
        }

        setValidationErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[updatedRow.id];
            return newErrors;
        });

        setErrorMessage(null);

        // Update the flag if the row was modified
        if (updatedRow.flag !== 'new' && updatedRow.flag !== 'deleted') {
            updatedRow.flag = 'updated';
        }

        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {
            field: 'size',
            headerName: 'Taille',
            flex: 1,
            minWidth: 150,
            editable: true,
            renderCell: (params) => params.value ? params.value.label : '',
            renderEditCell: (params) => (
                <Autocomplete
                    fullWidth
                    options={sizes}
                    getOptionLabel={(option) => option.label || ''}
                    value={params.value}
                    onChange={(event, newValue) => {
                        params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue });
                    }}
                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    disabled={params.row.flag === 'deleted'}
                />
            ),
        },
        {
            field: 'color',
            headerName: 'Couleur',
            flex: 1,
            minWidth: 150,
            editable: true,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {params.value && (
                        <Box
                            sx={{
                                width: 16,
                                height: 16,
                                mr: 1,
                                borderRadius: '50%',
                                backgroundColor: params.value.hex,
                                border: '1px solid #ccc',
                            }}
                        />
                    )}
                    {params.value ? params.value.label : ''}
                </Box>
            ),
            renderEditCell: (params) => (
                <Autocomplete
                    fullWidth
                    options={colors}
                    getOptionLabel={(option) => option.label || ''}
                    value={params.value}
                    onChange={(event, newValue) => {
                        params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue });
                    }}
                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                    sx={{
                                        width: 16,
                                        height: 16,
                                        mr: 1,
                                        borderRadius: '50%',
                                        backgroundColor: option.hex,
                                        border: '1px solid #ccc',
                                    }}
                                />
                                {option.label}
                            </Box>
                        </li>
                    )}
                    disabled={params.row.flag === 'deleted'}
                />
            ),
        },
        {
            field: 'quantity',
            headerName: 'Quantité',
            type: 'number',
            flex: 1,
            minWidth: 120,
            editable: true,
            renderCell: (params) => params.row.flag === 'deleted' ? '-' : params.value,
        },

        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 1,
            minWidth: 100,
            cellClassName: 'actions',
            getActions: ({ id, row }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (row.flag === 'deleted') {
                    return [];
                }
                if (isReadOnly) {
                    return [];
                }

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Sauvegarder"
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Annuler"
                            onClick={handleCancelClick(id)}
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Éditer"
                        onClick={handleEditClick(id)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Supprimer"
                        onClick={handleDeleteClick(id)}
                    />,
                ];
            },
        },
    ];

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%', mb: 2 }}>
                {errorMessage && (
                    <Alert severity="error" onClose={() => setErrorMessage(null)} sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{
                        toolbar: !isReadOnly && EditToolbar
                        ,
                    }}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel },
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 100 },
                        },
                    }}
                    pageSizeOptions={[]}
                    autoHeight
                    disableColumnMenu
                    getRowClassName={(params) =>
                        validationErrors[params.id] ? 'error-row' :
                            params.row.flag === 'deleted' ? 'deleted-row' : ''
                    }
                    sx={{
                        '& .error-row': {
                            backgroundColor: '#ffcccb',
                            '&:hover': {
                                backgroundColor: '#ffb3b3',
                            },
                        },
                        '& .deleted-row': {
                            backgroundColor: '#f0f0f0',
                            textDecoration: 'line-through',
                            pointerEvents: 'none',
                        },
                    }}
                />
            </Box>
        </ThemeProvider>
    );
}