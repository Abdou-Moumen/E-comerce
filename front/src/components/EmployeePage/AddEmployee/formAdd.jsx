import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreateEmployee } from '../../../Hooks/Employees/useEmployee.jsx';
import {
    TextField,
    Button,
    Box,
    Alert,
    Typography,
    Container,
    Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BackButton from '../../commun/BackButton.jsx';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const StyledForm = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.shape.borderRadius * 1.5,
    },
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    marginTop: theme.spacing(4),
}));

const FormAddEmployee = () => {
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors }, setError, clearErrors, watch, reset } = useForm();
    const [messageError, setMessageError] = useState('');
    const { mutate, isSuccess, isError, error } = useCreateEmployee();

    const password = watch('password');

    useEffect(() => {
        if (isSuccess) {
            navigate('/admin/employee');
        }
        if (isError) {
            handleApiError(error);
        }
    }, [isSuccess, isError, error, navigate]);

    const handleApiError = (error) => {
        if (error.response) {
            const errorMessage = error.response.status === 422
                ? 'Email déjà existant'
                : 'Une erreur s\'est produite. Veuillez réessayer.';
            setMessageError(errorMessage);
            setError('email', { type: 'manual', message: errorMessage });
        } else {
            setMessageError('Erreur réseau. Veuillez réessayer.');
        }
    };

    const onSubmit = (data) => {
        clearErrors();
        setMessageError('');
        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', { type: 'manual', message: 'Les mots de passe ne correspondent pas' });
            return;
        }
        mutate(data);
    };

    const clearForm = () => {
        reset({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
        clearErrors();
        setMessageError('');
    };

    return (
        <Container maxWidth="sm">
            <StyledPaper elevation={0}>

                <BackButton navigate={navigate}

                />


                <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Controller
                        name="firstName"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Le prénom est requis' }}
                        render={({ field }) => (
                            <StyledTextField
                                {...field}
                                fullWidth
                                label="Prénom"
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                        )}
                    />
                    <Controller
                        name="lastName"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Le nom est requis' }}
                        render={({ field }) => (
                            <StyledTextField
                                {...field}
                                fullWidth
                                label="Nom"
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
                            required: 'L\'email est requis',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Adresse email invalide',
                            },
                        }}
                        render={({ field }) => (
                            <StyledTextField
                                {...field}
                                fullWidth
                                label="Adresse Email"
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
                            required: 'Le mot de passe est requis',
                            minLength: {
                                value: 8,
                                message: 'Le mot de passe doit contenir au moins 8 caractères',
                            },
                        }}
                        render={({ field }) => (
                            <StyledTextField
                                {...field}
                                fullWidth
                                label="Mot de passe"
                                type="password"
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
                            required: 'La confirmation du mot de passe est requise',
                            validate: (value) => value === password || 'Les mots de passe ne correspondent pas',
                        }}
                        render={({ field }) => (
                            <StyledTextField
                                {...field}
                                fullWidth
                                label="Confirmer le mot de passe"
                                type="password"
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                            />
                        )}
                    />
                    {messageError && (
                        <Alert severity="error">
                            {messageError}
                        </Alert>
                    )}
                    <ButtonGroup>
                        <Button
                            variant="outlined"
                            onClick={clearForm}
                            color="error"
                            fullWidth
                        >
                            Effacer
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Ajouter
                        </Button>
                    </ButtonGroup>
                </StyledForm>
            </StyledPaper>
        </Container>
    );
};

export default FormAddEmployee;