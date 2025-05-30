import { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/productApi';
import type { Product } from '../types/Product';
import { Select } from 'antd';
import { getCategories } from '../api/categoryApi';
import type { Category } from '../types/Category';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        loadProducts();
        getCategories().then(setCategories).catch(() => {
            message.error('Failed to load categories');
        });
    }, []);



    const [form] = Form.useForm();

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
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
            values.image = imagePreview;
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


    const handleDelete = async (id: number) => {
        try {
            await deleteProduct(id);
            message.success('Product deleted');
            loadProducts();
        } catch {
            message.error('Failed to delete');
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            render: (img: string) => img ? <img src={img} alt="product" style={{ width: 50, height: 50, objectFit: 'cover' }} /> : '—'
        },
        { title: 'ID', dataIndex: 'id', width: 60 },
        { title: 'Name', dataIndex: 'name' },
        { title: 'Price', dataIndex: 'price', render: (price: any) => `$${parseFloat(price).toFixed(2)}` },
        { title: 'stock', dataIndex: 'stock' },
        {
            title: 'Category',
            dataIndex: ['category', 'name'], // AntD supports nested paths
            render: (_: any, record: Product) => record.category?.name || '—'
        },
        {
            title: 'Actions',
            render: (_: any, record: Product) => (
                <Space>
                    <Button type="link" onClick={() => openModal(record)}>Edit</Button>
                    <Popconfirm title="Delete this product?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger type="link">Delete</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];


    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                    Add Product
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={products}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
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
                    <Form.Item label="Image">
                        <Upload
                            beforeUpload={(file) => {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    setImagePreview(e.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                                return false; // prevent auto upload
                            }}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="preview"
                                style={{ marginTop: 10, width: '100%', maxHeight: 200, objectFit: 'contain' }}
                            />
                        )}
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
};

export default Products;
