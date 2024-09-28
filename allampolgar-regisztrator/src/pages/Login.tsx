import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService'; // Importáld az API hívást

type Inputs = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = await login(data);
      console.log(result.status);
      if (result.status) {
        message.success('Login successful!');
        navigate('/dashboard');
      } else {
        message.error('Something failed');
      }
    } catch (error) {
      message.error('Something failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Item
            label="Username"
            validateStatus={errors.username ? 'error' : undefined}
            help={errors.username ? 'Username is required' : ''}
          >
            <input
              {...register('username', { required: true })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            validateStatus={errors.password ? 'error' : undefined}
            help={errors.password ? 'Password is required' : ''}
          >
            <input
              {...register('password', { required: true })}
              type="password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
};

export default Login;
