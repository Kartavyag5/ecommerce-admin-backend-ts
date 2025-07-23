import { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Input, Space, Popconfirm, message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from '../api/axios';

interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
}

const Customers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [form] = Form.useForm();

    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [sorter, setSorter] = useState<any>({});
    const [search, setSearch] = useState<string>('');

    const fetchCustomers = async (
        page = pagination.current,
        pageSize = pagination.pageSize,
        sortField = sorter.field || 'createdAt',
        sortOrderRaw = sorter.order
    ) => {
        const sortOrder = sortOrderRaw === 'ascend' ? 'ASC' : sortOrderRaw === 'descend' ? 'DESC' : 'DESC';

        setLoading(true);
        try {
            const params = {
                page,
                limit: pageSize,
                sortBy: sortField,
                order: sortOrder,
                search,
            };
            const res = await axios.get('/customers', { params });
            setCustomers(res.data.data);
            setPagination(prev => ({ ...prev, total: res.data.total }));
        } catch {
            message.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCustomers();
    }, []);

    const openModal = async (customer?: Customer) => {
        if (customer) {
            try {
                const res = await axios.get(`/customers/${customer.id}`);
                setEditingCustomer(res.data);
                form.setFieldsValue(res.data);
            } catch {
                message.error('Failed to load customer');
                return;
            }
        } else {
            setEditingCustomer(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingCustomer) {
                await axios.put(`/customers/${editingCustomer.id}`, values);
                message.success('Customer updated');
            } else {
                await axios.post('/customers', values);
                message.success('Customer created');
            }
            setIsModalOpen(false);
            fetchCustomers();
        } catch {
            message.error('Failed to save customer');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/customers/${id}`);
            message.success('Customer deleted');
            fetchCustomers();
        } catch {
            message.error('Failed to delete customer');
        }
    };

    const handleReset = () => {
        setSearch('');
        setSorter({});
        setPagination({ current: 1, pageSize: 10, total: 0 });
        fetchCustomers(1, 10, 'createdAt', 'DESC');
    };

    const columns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            sorter: true,
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Actions',
            render: (_: any, record: Customer) => (
                <Space>
                    <Button type="link" onClick={() => openModal(record)}>Edit</Button>
                    <Popconfirm
                        title="Delete this customer?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger type="link">Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <h1>Customers</h1>
                <Button icon={<PlusOutlined />} type="primary" onClick={() => openModal()}>
                    Add Customer
                </Button>
            </Space>

            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search Name / Email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onPressEnter={() => fetchCustomers()}
                    allowClear
                />
                <Button type="default" onClick={() => fetchCustomers()}>
                    Apply
                </Button>
                <Button type="dashed" onClick={handleReset}>
                    Reset
                </Button>
            </Space>

            <Table
                columns={columns}
                dataSource={customers}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                }}
                onChange={(pagination, filters, sorter: any) => {
                    setPagination({ ...pagination, total: pagination.total || 0 } as any);
                    setSorter(sorter);
                    fetchCustomers(pagination.current, pagination.pageSize, sorter.field, sorter.order);
                }}
            />

            <Modal
                open={isModalOpen}
                title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSubmit}
                okText="Save"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Customers;
