import { useState } from 'react';

export const useForm = (initialState) => {
  const [form, setForm] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'phone1', 'wilaya', 'common', 'adress'];
    return requiredFields.every(field => form[field] && form[field].trim() !== '');
  };

  const resetForm = () => {
    setForm(initialState);
  };

  const setFormValues = (values) => {
    setForm(prevForm => ({ ...prevForm, ...values }));
  };

  return {
    form,
    setForm,
    handleInputChange,
    validateForm,
    resetForm,
    setFormValues
  };
};
