import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const res = await API.post('/admin/auth/login', values);
      localStorage.setItem('token', res.data.token);
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        title="Admin Login"
        bordered={false}
        style={{
          width: 400, // 👈 fixed width
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="admin@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
