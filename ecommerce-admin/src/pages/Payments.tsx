// src/pages/Payments.tsx
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select, Space, Table, message } from 'antd';
import type { Payment } from '../types/payment';
import API from '../api/axios';

const { Option } = Select;

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await API.get('/payments');
      setPayments(res.data);
    } catch (error) {
      message.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: Payment) => {
    try {
      if (editingId) {
        await API.put(`/payments/${editingId}`, values);
        message.success('Payment updated');
      } else {
        await API.post('/payments', values);
        message.success('Payment created');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchPayments();
    } catch (error) {
      message.error('Failed to save payment');
    }
  };

  const handleEdit = (record: Payment) => {
    form.setFieldsValue(record);
    setEditingId(record.id!);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/payments/${id}`);
      message.success('Payment deleted');
      fetchPayments();
    } catch {
      message.error('Failed to delete');
    }
  };

  const columns = [
    { title: 'Transaction ID', dataIndex: 'transactionId' },
    { title: 'Order ID', dataIndex: 'orderId' },
    { title: 'Status', dataIndex: 'paymentStatus' },
    { title: 'Mode', dataIndex: 'paymentMode' },
    { title: 'Amount', dataIndex: 'amount' },
    { title: 'Currency', dataIndex: 'currency' },
    {
      title: 'Actions',
      render: (_: any, record: Payment) => (
        <Space>
          <Button onClick={() => handleEdit(record)} type="link">
            Edit
          </Button>
          <Button onClick={() => handleDelete(record.id!)} type="link" danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payments</h2>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Payment
      </Button>
      <Table
        dataSource={payments}
        columns={columns}
        rowKey="id"
        loading={loading}
        className="mt-4"
      />

      <Modal
        open={isModalOpen}
        title={editingId ? 'Edit Payment' : 'Add Payment'}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingId(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="transactionId" label="Transaction ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="orderId" label="Order ID" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="paymentStatus" label="Payment Status" rules={[{ required: true }]}>
            <Select>
              <Option value="succeeded">Succeeded</Option>
              <Option value="pending">Pending</Option>
              <Option value="failed">Failed</Option>
            </Select>
          </Form.Item>
          <Form.Item name="paymentMode" label="Payment Mode" rules={[{ required: true }]}>
            <Select>
              <Option value="card">Card</Option>
              <Option value="upi">UPI</Option>
              <Option value="netbanking">Net Banking</Option>
              <Option value="cod">Cash on Delivery</Option>
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="currency" label="Currency" initialValue="INR" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Payments;
