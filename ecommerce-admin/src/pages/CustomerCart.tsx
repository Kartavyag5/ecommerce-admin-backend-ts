import {
    Table,
    Button,
    Modal,
    Form,
    InputNumber,
    Select,
    message,
    Space,
    Popconfirm,
} from 'antd';
import { useEffect, useState } from 'react';
import API from '../api/axios'; // your API setup
import { PlusOutlined } from '@ant-design/icons';

interface CartItem {
    id: number;
    customerId: number;
    productId: number;
    quantity: number;
}

interface Customer {
    id: number;
    firstName: string;
    lastName: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
}

const CustomerCart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CartItem | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            API.get('/customer-cart').then(res => setCartItems(res.data))
            API.get('/customers').then(res => setCustomers(res.data.data))
            API.get('/products').then(res => setProducts(res.data.data))
        } catch (err) {
            message.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item?: CartItem) => {
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
                await API.put(`/customer-cart/${editingItem.id}`, values);
                message.success('Cart item updated');
            } else {
                await API.post('/customer-cart', values);
                message.success('Cart item created');
            }
            setIsModalOpen(false);
            fetchData();
        } catch {
            message.error('Failed to save cart item');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await API.delete(`/customer-cart/${id}`);
            message.success('Cart item deleted');
            fetchData();
        } catch {
            message.error('Failed to delete');
        }
    };

    const columns = [
        {
            title: 'Customer',
            dataIndex: 'customer',
            render: (customer: any) => customer.firstName + ' ' + customer.lastName,
        },
        {
            title: 'Product',
            dataIndex: 'product',
            render: (product: any) => product.name,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
        },
        {
            title: 'Actions',
            render: (_: any, record: CartItem) => (
                <Space>
                    <Button type="link" onClick={() => openModal(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete this cart item?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <h1>Cart Items</h1>
                <div style={{ marginBottom: 16 }}>
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => openModal()}>
                        Add Cart Item
                    </Button>
                </div>
            </Space>
            <Table
                columns={columns}
                dataSource={cartItems}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                open={isModalOpen}
                title={editingItem ? 'Edit Cart Item' : 'Add Cart Item'}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSubmit}
                okText="Save"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="customerId" label="Customer" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select customer"
                            options={customers?.map((c) => ({
                                label: `${c.firstName} ${c.lastName}`,
                                value: c.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item name="productId" label="Product" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select product"
                            options={products?.map((p) => ({
                                label: p.name,
                                value: p.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={1} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CustomerCart;
