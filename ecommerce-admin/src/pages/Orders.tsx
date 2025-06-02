// pages/Orders.tsx
import { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, InputNumber, Space,
    Popconfirm, message, Select, DatePicker
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../api/orderApi';
import type { Order } from '../types/Order';
import { getAllUsers } from '../api/customerApi';

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [form] = Form.useForm();
    const [users, setUsers] = useState<{ id: number; name: string }[]>([]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await getOrders();
            setOrders(data);
        } catch {
            message.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
        getAllUsers().then(setUsers).catch(() => message.error('Failed to load users'));
    }, []);

    const openModal = (order?: Order) => {
        if (order) {
            setEditingOrder(order);
            form.setFieldsValue(order);
        } else {
            setEditingOrder(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingOrder) {
                await updateOrder(editingOrder.id, values);
                message.success('Order updated');
            } else {
                await createOrder(values);
                message.success('Order created');
            }
            setIsModalOpen(false);
            loadOrders();
        } catch {
            message.error('Failed to save order');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteOrder(id);
            message.success('Order deleted');
            loadOrders();
        } catch {
            message.error('Failed to delete order');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'User Name', dataIndex: ['user', 'firstName'] },
        { title: 'Total Amount', dataIndex: 'totalAmount', render: (val: any) => `₹ ${val}` },
        { title: 'Status', dataIndex: 'status' },
        { title: 'Created At', dataIndex: 'createdAt' },
        {
            title: 'Actions',
            render: (_: any, record: Order) => (
                <Space>
                    <Button type="link" onClick={() => openModal(record)}>Edit</Button>
                    <Popconfirm title="Delete this order?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                    Add Order
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={orders}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                open={isModalOpen}
                title={editingOrder ? 'Edit Order' : 'Add Order'}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSubmit}
                okText="Save"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="customerId" label="User" rules={[{ required: true }]}>
                        <Select
                            options={users.map((user: any) => ({ label: user?.firstName, value: user.id }))}
                            placeholder="Select a user"
                        />
                    </Form.Item>
                    <Form.Item name="totalAmount" label="Total Amount" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { label: 'Pending', value: 'Pending' },
                                { label: 'Processing', value: 'Processing' },
                                { label: 'Shipped', value: 'Shipped' },
                                { label: 'Delivered', value: 'Delivered' },
                                { label: 'Cancelled', value: 'Cancelled' }
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Orders;
