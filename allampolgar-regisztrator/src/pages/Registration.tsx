import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Button, Form, Select, DatePicker, message, Modal } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { User } from '../types/User'; // Ensure this path is correct
import moment from 'moment';

const { Option } = Select;

const apiUrl = 'http://localhost:5001/api/users';

const Registration: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<User>();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.mode || 'registration'; // Default to registration mode
  const user = location.state?.user as User;

  // If editing or viewing, set the form values
  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      reset(user);
    }
  }, [user, mode, reset]);

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      const formattedData = {
        ...data,
        loanEligibility: isLoanEligible(
          data.citizenship,
          data.taxIdentificationNumber,
        )
          ? 'Igen'
          : 'Nem',
      };

      const endpoint =
        mode === 'edit' ? `${apiUrl}/update/${data.id}` : `${apiUrl}/register`;
      const response = await axios.post(endpoint, formattedData);

      if (response.status == 201) {
        message.success('Mentés sikeres!');
        navigate('/dashboard');
      } else {
        message.error('Mentés sikertelen!');
      }
    } catch (error) {
      message.error('Hiba történt!');
    }
  };

  const handleClose = () => {
    if (isDirty) {
      setIsModalVisible(true);
    } else {
      navigate('/dashboard');
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate('/dashboard');
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const gender = watch('gender');

  const validateTaxId = (value: string) => {
    const regex = /^8[0-9]{10}$/;
    const containsTwo = /2/.test(value);
    return regex.test(value) && containsTwo;
  };

  const isLoanEligible = (citizenship?: string, taxId?: string) => {
    return (
      citizenship?.toLowerCase() === 'magyar' && validateTaxId(taxId || '')
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Registration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Item label="Titulus" required>
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Válassz egy titulust"
                  disabled={mode === 'view'}
                >
                  <Option value="Mr">Mr</Option>
                  <Option value="Mrs">Mrs</Option>
                  <Option value="Ms">Ms</Option>
                  <Option value="Dr">Dr</Option>
                </Select>
              )}
            />
            {errors.title && <span>This field is required</span>}
          </Form.Item>

          <Form.Item label="Vezetéknév" required>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  disabled={mode === 'view'}
                  className={`w-full p-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none`}
                />
              )}
            />
            {errors.lastName && <span>This field is required</span>}
          </Form.Item>

          <Form.Item label="Keresztnév" required>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  disabled={mode === 'view'}
                  className={`w-full p-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none`}
                />
              )}
            />
            {errors.firstName && <span>This field is required</span>}
          </Form.Item>

          <Form.Item label="Utónév">
            <Controller
              name="middleName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  disabled={mode === 'view'}
                  className={`w-full p-2 border border-gray-300 rounded focus:outline-none`}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Neme" required>
            <Controller
              name="gender"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Válassz egy nemet"
                  disabled={mode === 'view'}
                >
                  <Option value="Nő">Nő</Option>
                  <Option value="Férfi">Férfi</Option>
                </Select>
              )}
            />
            {errors.gender && <span>This field is required</span>}
          </Form.Item>

          {gender === 'Nő' && (
            <Form.Item label="Leánykori név">
              <Controller
                // @ts-ignore
                name="maidenName"
                control={control}
                render={({ field }) => (
                  // @ts-ignore
                  <input
                    {...field}
                    disabled={mode === 'view'}
                    className={`w-full p-2 border border-gray-300 rounded focus:outline-none`}
                  />
                )}
              />
            </Form.Item>
          )}

          <Form.Item label="Születési hely" required>
            <Controller
              name="placeOfBirth"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  disabled={mode === 'view'}
                  className={`w-full p-2 border ${errors.placeOfBirth ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none`}
                />
              )}
            />
            {errors.placeOfBirth && <span>This field is required</span>}
          </Form.Item>

          <Form.Item label="Születési dátum" required>
            <Controller
              name="dateOfBirth"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value ? moment(field.value) : null} // Convert value to moment if it's valid
                  onChange={(date) => {
                    field.onChange(date ? date.toISOString() : null); // Ensure date is in ISO format or null
                  }}
                  disabled={mode === 'view'}
                />
              )}
            />
            {errors.dateOfBirth && <span>This field is required</span>}
          </Form.Item>

          <Form.Item label="Állampolgárság" required>
            <Controller
              name="citizenship"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  disabled={mode === 'view'}
                  className={`w-full p-2 border ${errors.citizenship ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none`}
                />
              )}
            />
            {errors.citizenship && <span>This field is required</span>}
          </Form.Item>

          <Form.Item label="Adóazonosító jel" required>
            <Controller
              name="taxIdentificationNumber"
              control={control}
              rules={{
                required: true,
                validate: validateTaxId,
              }}
              render={({ field }) => (
                <input
                  {...field}
                  disabled={mode === 'view'}
                  className={`w-full p-2 border ${errors.taxIdentificationNumber ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none`}
                />
              )}
            />
            {errors.taxIdentificationNumber && (
              <span>
                This field must be exactly 11 characters long, start with 8, and
                contain at least one '2'.
              </span>
            )}
          </Form.Item>

          <Form.Item label="Hitel igényelhető?">
            <span>
              {isLoanEligible(
                watch('citizenship'),
                watch('taxIdentificationNumber'),
              )
                ? 'Igen'
                : 'Nem'}
            </span>
          </Form.Item>

          <Form.Item className="block mt-6">
            <Button type="primary" htmlType="submit" disabled={mode === 'view'}>
              {mode === 'edit' ? 'Mentés' : 'Regisztráció'}
            </Button>
            <Button type="default" onClick={handleClose} className="ml-2">
              Vissza
            </Button>
          </Form.Item>
        </form>

        <Modal
          title="Figyelmeztetés"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <p>A módosítások el fognak veszni. Biztos, hogy vissza akar lépni?</p>
        </Modal>
      </div>
    </div>
  );
};

export default Registration;
