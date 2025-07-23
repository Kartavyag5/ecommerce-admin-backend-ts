import { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/productApi';
import type { Product } from '../types/Product';
import { Select } from 'antd';
import { getCategories } from '../api/categoryApi';
import type { Category } from '../types/Category';
import axios from 'axios';
// import { Upload } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import type { UploadChangeParam } from 'antd/es/upload';
// import API from '../api/axios';
// import img from '../../../uploads/imageUrl-1748842278864-663639991.png';

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [sorter, setSorter] = useState<any>({});
    const [filters, setFilters] = useState<{ search?: string; categoryId?: number; minPrice?: number; maxPrice?: number; stock?: number }>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    useEffect(() => {
        loadProducts();
        getCategories().then(setCategories).catch(() => {
            message.error('Failed to load categories');
        });
    }, []);

    const [form] = Form.useForm();

    const loadProducts = async (
        page = pagination.current,
        pageSize = pagination.pageSize,
        sortField = sorter.field || 'createdAt',
        sortOrder = sorter.order === 'ascend' ? 'ASC' : 'DESC'
    ) => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: pageSize,
                sortBy: sortField,
                order: sortOrder,
                ...filters,
            };
            const res = await getProducts(params);
            setProducts(res.data);
            setPagination(prev => ({ ...prev, total: res.total }));
        } catch {
            message.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadProducts();
    }, []);

    const openModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            form.setFieldsValue(product);
            setImagePreview(product?.imageUrl || '');
        } else {
            form.resetFields();
            setEditingProduct(null);
            setImagePreview('');
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log('values: ', values);
            if (editingProduct) {
                await updateProduct(editingProduct.id, values);
                message.success('Product updated');
            } else {
                await createProduct(values);
                message.success('Product created');
            }
            setIsModalOpen(false);
            loadProducts();
        } catch (err) {
            message.error('Failed to save product');
        }
    };


    const handleDelete = async (id?: number) => {
        try {
            if (id) {
            await deleteProduct(id);
            message.success('Product deleted');
            } else if (selectedRowKeys.length) {
                await deleteProduct({ ids: selectedRowKeys } as any);
                message.success(`${selectedRowKeys.length} products deleted`);
                setSelectedRowKeys([]);
            } else {
                message.warning('No product selected');
                return;
            }
            loadProducts();
        } catch {
            message.error('Failed to delete');
        }
    };



    const handleReset = () => {
        setFilters({});
        setSorter({});
        setPagination({ ...pagination, current: 1 }); // reset to first page
        loadProducts(1, pagination.pageSize, 'createdAt', 'DESC'); // default sort
    };


    const columns = [
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            render: (url: string) =>
                url ? <img src={url.includes('/uploads') ? `http://localhost:3000${url}` : url} alt="Product" height={50} /> : '—',
        },
        {
            title: 'ID',
            dataIndex: 'id',
            width: 60,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true, // ✅ Enable sorting
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: true, // ✅ Enable sorting
            render: (price: any) => `₹ ${parseFloat(price).toFixed(2)}`,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            sorter: true, // ✅ Enable sorting
        },
        {
            title: 'Category',
            dataIndex: ['category', 'name'],
            sorter: true, // ✅ Enable sorting
            render: (_: any, record: Product) => record.category?.name || '—',
        },
        {
            title: 'Actions',
            render: (_: any, record: Product) => (
                <Space>
                    <Button title={'Edit product'} icon={<EditOutlined />} type="link" onClick={() => openModal(record)}></Button>
                    <Popconfirm title="Delete this product?" onConfirm={() => handleDelete(record.id)}>
                        <Button title={'Delete product'} icon={<DeleteOutlined />} danger type="link"></Button>
                    </Popconfirm>
                </Space>
            ),
        }
    ];



    return (
        <div>
            <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <h1>Products</h1>
                <div style={{ marginBottom: 16 }}>
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => openModal()}>
                        Add Product
                    </Button>
                </div>
            </Space>
            <Space style={{ marginBottom: 16 }} wrap>
                <Input
                    placeholder="Search Name"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    onPressEnter={() => loadProducts()}
                />
                <Select
                    placeholder="Filter by Category"
                    allowClear
                    style={{ width: 200 }}
                    value={filters.categoryId}
                    options={categories.map(cat => ({ label: cat.name, value: cat.id }))}
                    onChange={(val) => {
                        setFilters(prev => ({ ...prev, categoryId: val }));
                        loadProducts();
                    }}
                />
                <InputNumber
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(val) => setFilters(prev => ({ ...prev, minPrice: val || undefined } as any))}
                />
                <InputNumber
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(val) => setFilters(prev => ({ ...prev, maxPrice: val || undefined } as any))}
                    onBlur={() => loadProducts()}
                />
                <InputNumber
                    placeholder="Stock ≥"
                    value={filters.stock}
                    onChange={(val) => {
                        setFilters(prev => ({ ...prev, stock: val || undefined } as any));
                        loadProducts();
                    }}
                />
                <Button type="primary" onClick={() => loadProducts()}>
                    Apply
                </Button>
                <Button onClick={handleReset}>
                    Reset Filters & Sort
                </Button>
                <Popconfirm title="Confirm for Delete selected products?" onConfirm={() => handleDelete()}>
                    <Button
                        title='Delete selected products'
                        danger
                        icon={<DeleteOutlined />}
                        disabled={selectedRowKeys.length === 0}
                    >
                        Delete Selected
                    </Button>
                </Popconfirm>
            </Space>


            <Table
                columns={columns}
                dataSource={products}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                }}
                rowSelection={{
                    selectedRowKeys,
                    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
                }}
                onChange={(pagination, filters, sorter: any) => {
                    setPagination({ ...pagination, total: pagination.total || 0 } as any);
                    setSorter(sorter);
                    const sortOrder = sorter.order === 'ascend' ? 'ASC' : sorter.order === 'descend' ? 'DESC' : undefined;
                    loadProducts(pagination.current, pagination.pageSize, sorter.field, sortOrder);
                }}

            />

            <Modal
                open={isModalOpen}
                title={editingProduct ? 'Edit Product' : 'Add Product'}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSubmit}
                okText="Save"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select category"
                            options={categories.map(cat => ({
                                label: cat.name,
                                value: cat.id
                            }))}
                        />
                    </Form.Item>
                    <Form.Item label="Product Image">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const formData = new FormData();
                                    formData.append('imageUrl', file);
                                    try {
                                        const res: any = await axios.post('http://localhost:3000/api/upload/image', formData);
                                        const uploadedUrl = res?.data?.url;

                                        form.setFieldsValue({ imageUrl: uploadedUrl }); // Just setting the URL
                                        setImagePreview(uploadedUrl); // Set preview
                                    } catch (err) {
                                        message.error('Failed to upload image');
                                    }
                                }
                            }}
                        /> or
                        <Form.Item name="imageUrl" noStyle>
                            <Input placeholder='Enter Image Url' onChange={(e) => setImagePreview(e.target.value)} />
                        </Form.Item>

                        {imagePreview && (
                            <img
                                src={imagePreview.includes('uploads/') ? `http://localhost:3000${imagePreview}` : imagePreview}
                                alt="Preview"
                                style={{ marginTop: 10, width: 100 }}
                            />
                        )}
                    </Form.Item>

                </Form>
            </Modal>

        </div>
    );
};

export default Products;
