import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetEmployee, useUpdateEmployee } from '../../../Hooks/Employees/useEmployee.jsx';


import {
    TextField,
    Button,
    Box,
    Alert,
    Skeleton
} from '@mui/material';

import BackButton from '../../commun/BackButton.jsx';



const FormEditEmployee = ({ employee }) => {
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors }, setError, clearErrors, watch, reset, setValue } = useForm();
    const [messageError, setMessageError] = useState('');
    //geet id from url
    const { id } = useParams();
    //get employee dat
    console.log(id)
    const { data, isSuccess, isError, error, isLoading } = useGetEmployee(id);
    const { mutate, isLoading: isUpdating, isSuccess: isUpdated, error: updateError, isError: isNotUpdated } = useUpdateEmployee(id);


    const password = watch('password');

    const clearForm = () => {
        reset({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
        clearErrors();
        setMessageError('');
    };

    useEffect(() => {
        if (isSuccess) {
            setValue('firstName', data.first_name)
            setValue('lastName', data.last_name)
            setValue('email', data.email)
            setValue('password', data.password)
            console.log(data)
        }
        if (isError) {
            handleApiError(error);
        }

    }, [isSuccess, isError, error, navigate]);

    useEffect(() => {
        if (isUpdated) {
            navigate('/admin/employee');
        }
        if (isNotUpdated) {
            handleApiError(updateError);
        }
    }, [isUpdated, isNotUpdated, updateError, navigate]);


    const handleApiError = (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 422:
                    setMessageError('Email already exists');
                    setError('email', { type: 'manual', message: 'Email already exists' });
                    break;
                case 400:
                    setMessageError('Invalid data provided');
                    break;
                default:
                    setMessageError('An unknown error occurred');
            }
        } else {
            setMessageError('Network error. Please try again.');
        }
    };

    const onSubmit = (data) => {
        clearErrors();
        setMessageError('');
        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
            return;
        }
        mutate(data);
    };


    return (



        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{
            background: "white",
            width: "100%",
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
        }}>
            <BackButton navigate={navigate} />
            {isLoading ? (
                <Box sx={{ width: '100%', padding: '20px' }}>
                    {/* Mimic a text input */}
                    <Skeleton variant="text" width="100%" height={50} />
                    <Skeleton variant="text" width="100%" height={50} style={{ marginTop: 16 }} />

                    {/* Mimic a multiline text input or textarea */}
                    <Skeleton variant="rectangular" width="100%" height={100} style={{ marginTop: 16 }} />
                    <Skeleton variant="rectangular" width="100%" height={100} style={{ marginTop: 16 }} />
                    <Skeleton variant="rectangular" width="100%" height={100} style={{ marginTop: 16 }} />
                    <Skeleton variant="rectangular" width="100%" height={100} style={{ marginTop: 16 }} />

                    {/* Mimic a button */}
                    <Skeleton variant="rectangular" width="100px" height={50} style={{ marginTop: 16 }} />
                </Box>
            ) :
                (<>
                    <Controller
                        name="firstName"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'First name is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                        )}
                    />

                    <Controller
                        name="lastName"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Last name is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address',
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                autoComplete="email"
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        )}
                    />

                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'Password is required',
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters long',
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        )}
                    />

                    <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'Confirm password is required',
                            validate: (value) => value === password || 'Passwords do not match',
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                            />
                        )}
                    />



                    {messageError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {messageError}
                        </Alert>
                    )}
                    <Box sx={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        gap: "20px",
                        mt: "20px"
                    }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => clearForm()}
                            color='error'
                            sx={{ borderRadius: "8px", boxShadow: "none", margin: "auto" }}
                            disableElevation
                        >
                            Clear
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ borderRadius: "8px", boxShadow: "none", margin: "auto" }}
                            disableElevation
                        >
                            Add
                        </Button>

                    </Box></>)}
        </Box>
    );
};

export default FormEditEmployee;