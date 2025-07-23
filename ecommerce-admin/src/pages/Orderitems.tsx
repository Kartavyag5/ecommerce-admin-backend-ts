import { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, InputNumber, Space, Popconfirm, message, Select
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { Order, OrderItem } from '../types/Order';
import API from '../api/axios';
import type { Product } from '../types/Product';

const OrderItems = () => {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);


    const [form] = Form.useForm();

    const loadOrderItems = async () => {
        setLoading(true);
        try {
            const res = await API.get('/order-items');
            setOrderItems(res.data);
        } catch {
            message.error('Failed to fetch order items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrderItems();
        fetchOrdersAndProducts();
    }, []);

const fetchOrdersAndProducts = async () => {
  try {
    const [orderRes, productRes] = await Promise.all([
      API.get('/orders'),
      API.get('/products')
    ]);
    setOrders(orderRes.data.data);
    setProducts(productRes.data.data);
  } catch {
    message.error('Failed to fetch orders or products');
  }
};


    const openModal = (item?: OrderItem) => {
        if (item) {
            setEditingItem(item);
            form.setFieldsValue(item);
        } else {
            setEditingItem(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingItem) {
                await API.put(`/order-items/${editingItem.id}`, values);
                message.success('Order item updated');
            } else {
                await API.post('/order-items', values);
                message.success('Order item created');
            }
            setIsModalOpen(false);
            loadOrderItems();
        } catch {
            message.error('Failed to save order item');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await API.delete(`/order-items/${id}`);
            message.success('Order item deleted');
            loadOrderItems();
        } catch {
            message.error('Failed to delete order item');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 60 },
        { title: 'Order ID', dataIndex: 'orderId' },
        { title: 'Product Name', dataIndex: 'product', render: (product: Product) => product.name },
        { title: 'Quantity', dataIndex: 'quantity' },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (val: any) => `₹ ${parseFloat(val).toFixed(2)}`
        },
        {
            title: 'Actions',
            render: (_: any, record: OrderItem) => (
                <Space>
                    <Button type="link" onClick={() => openModal(record)}>Edit</Button>
                    <Popconfirm title="Delete this item?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger type="link">Delete</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div>
            <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <h1>Order Items</h1>
                <div style={{ marginBottom: 16 }}>
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => openModal()}>
                       Add Order Item
                    </Button>
                </div>
            </Space>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={orderItems}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingItem ? 'Edit Order Item' : 'Add Order Item'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSubmit}
                okText="Save"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="orderId" label="Order" rules={[{ required: true }]}>
                        <Select
                            showSearch
                            placeholder="Select order"
                            optionFilterProp="label"
                            options={orders?.map(order => ({
                                label: `Order #${order?.id} (Customer ID: ${order?.customerId})`,
                                value: order?.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item name="productId" label="Product" rules={[{ required: true }]}>
                        <Select
                            showSearch
                            placeholder="Select product"
                            optionFilterProp="label"
                            options={products?.map(product => ({
                                label: `${product.name} (₹${product.price})`,
                                value: product.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={1} />
                    </Form.Item>
                    {/* <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
                    </Form.Item> */}
                </Form>
            </Modal>
        </div>
    );
};

export default OrderItems;
