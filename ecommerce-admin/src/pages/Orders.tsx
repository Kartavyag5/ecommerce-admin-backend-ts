import { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, InputNumber, Space,
    Popconfirm, message, Select, Row, Col
} from 'antd';
import { CloseCircleFilled, CloseCircleOutlined, CompressOutlined, PlusOutlined } from '@ant-design/icons';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../api/orderApi';
import { getAllUsers } from '../api/customerApi';
import { getProducts } from '../api/productApi';
import type { Order } from '../types/Order';
import { Input } from 'antd';

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [form] = Form.useForm();
    const [users, setUsers] = useState<{ id: number; firstName: string; lastName: string }[]>([]);
    const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
    const { Search } = Input;
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: '',
        status: '',
        sortBy: 'createdAt',
        order: 'DESC',
    });
    const [total, setTotal] = useState(0);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const { page, limit, search, status, sortBy, order } = filters;
            const params: any = { page, limit, search, sortBy, order };
            if (status) params.status = status;

            const res = await getOrders(params);
            setOrders(res.data || []);
            setTotal(res.total || 0);
        } catch {
            message.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value: string) => {
        setFilters(prev => ({ ...prev, search: value, page: 1 }));
    };

    const handleStatusFilter = (value: string) => {
        setFilters(prev => ({ ...prev, status: value, page: 1 }));
    };

    const handleTableChange = (pagination: any, _filters: any, sorter: any) => {
        setFilters(prev => ({
            ...prev,
            page: pagination.current,
            limit: pagination.pageSize,
            sortBy: sorter.field || 'createdAt',
            order: sorter.order === 'ascend' ? 'ASC' : 'DESC',
        }));
    };



    useEffect(() => {
        getAllUsers().then(setUsers).catch(() => message.error('Failed to load users'));
        getProducts().then((res) => setProducts(res?.data)).catch(() => message.error('Failed to load products'));
    }, []);

    useEffect(() => {
        loadOrders();
    }, [filters]);

    const openModal = (order?: Order) => {
        if (order) {
            const productItems = order.orderItems?.map((item: any) => ({
                productId: item.product.id,
                quantity: item.quantity
            })) || [];

            setEditingOrder(order);
            form.setFieldsValue({
                customerId: order.customerId,
                status: order.status,
                products: productItems
            });
        } else {
            setEditingOrder(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                customerId: values.customerId,
                status: values.status,
                products: values.products.map((p: any) => ({
                    productId: p.productId,
                    quantity: p.quantity
                }))
            };

            if (editingOrder) {
                await updateOrder(editingOrder.id, payload);
                message.success('Order updated');
            } else {
                await createOrder(payload);
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
        {
            title: 'Customer Name',
            dataIndex: 'customer',
            render: (customer: any) => `${customer?.firstName ?? ''} ${customer?.lastName ?? ''}`
        },
        {
            title: 'Total',
            dataIndex: 'totalAmount',
            render: (val: number) => `₹ ${val}`
        },
        { title: 'Status', dataIndex: 'status' },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            render: (val: string) => new Date(val).toLocaleString()
        },
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
            <h1>Orders</h1>
            <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>

                <Space style={{ marginBottom: 16 }}>
                    <Search
                        placeholder="Search by customer name"
                        onSearch={handleSearch}
                        allowClear
                        style={{ width: 200 }}
                    />

                    <Select
                        placeholder="Filter by status"
                        onChange={handleStatusFilter}
                        allowClear
                        style={{ width: 180 }}
                        options={[
                            { label: 'Pending', value: 'Pending' },
                            { label: 'Processing', value: 'Processing' },
                            { label: 'Shipped', value: 'Shipped' },
                            { label: 'Delivered', value: 'Delivered' },
                            { label: 'Cancelled', value: 'Cancelled' },
                        ]}
                    />
                    <div>
                        <Button icon={<PlusOutlined />} type="primary" onClick={() => openModal()}>
                            Add Order
                        </Button>
                    </div>
                </Space>
            </Space>

            <Table
                columns={columns}
                dataSource={orders}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: filters.page,
                    pageSize: filters.limit,
                    total,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />


            <Modal
                open={isModalOpen}
                title={editingOrder ? 'Edit Order' : 'Add Order'}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSubmit}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="customerId" label="Customer" rules={[{ required: true }]}>
                        <Select
                            options={users.map((u: any) => ({
                                label: `${u.firstName} ${u.lastName}`,
                                value: u.id
                            }))}
                            placeholder="Select a customer"
                        />
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

                    <Form.List name="products" rules={[{ required: true, message: 'Add at least one product' }]}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row gutter={16} key={key} style={{ marginBottom: 8 }}>
                                        <Col span={14}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'productId']}
                                                rules={[{ required: true, message: 'Select product' }]}
                                            >
                                                <Select
                                                    placeholder="Select product"
                                                    options={products.map((p: any) => ({
                                                        label: p.name,
                                                        value: p.id
                                                    }))}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'quantity']}
                                                rules={[{ required: true, message: 'Enter quantity' }]}
                                            >
                                                <InputNumber min={1} placeholder="Quantity" style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} >
                                            <CloseCircleOutlined onClick={() => remove(name)} />
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add Product
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
};

export default Orders;
