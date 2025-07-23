import { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, Space, Popconfirm, message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../api/categoryApi';
import type { Category } from '../types/Category';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      message.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      form.setFieldsValue(category);
    } else {
      setEditingCategory(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
        message.success('Category updated');
      } else {
        await createCategory(values);
        message.success('Category created');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      message.error('Error saving category');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      message.success('Category deleted');
      fetchCategories();
    } catch {
      message.error('Error deleting category');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Actions',
      render: (_: any, record: Category) => (
        <Space>
          <Button type="link" onClick={() => openModal(record)}>Edit</Button>
          <Popconfirm title="Delete this category?" onConfirm={() => handleDelete(record.id)}>
            <Button danger type="link">Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <h1>Categories</h1>
        <div style={{ marginBottom: 16 }}>
          <Button icon={<PlusOutlined />} type="primary" onClick={() => openModal()}>
            Add Category
          </Button>
        </div>
      </Space>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={isModalOpen}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Category Name" rules={[{ required: true, message: 'Please enter a category name' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
