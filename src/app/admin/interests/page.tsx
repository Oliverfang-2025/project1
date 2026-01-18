"use client";

import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Input, Modal, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Interest } from '@/types/interest';
import { getInterests, saveInterests, addInterest, updateInterest, deleteInterest } from '@/lib/interest-storage';

type InterestFormValues = {
  name: string;
  description: string;
  category: string;
  icon?: string;
};

export default function InterestsPage() {
  const [interests, setInterests] = useState([] as Interest[]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null as Interest | null);
  const [form] = Form.useForm();

  // Load interests
  const loadInterests = () => {
    setLoading(true);
    try {
      const items = getInterests();
      setInterests(items);
    } catch (error) {
      message.error('加载兴趣失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterests();
  }, []);

  // Open modal for adding new item
  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({
      name: '',
      description: '',
      category: '',
      icon: '',
    });
    setModalVisible(true);
  };

  // Open modal for editing item
  const handleEdit = (item: Interest) => {
    setEditingItem(item);
    form.setFieldsValue({
      name: item.name,
      description: item.description,
      category: item.category,
      icon: item.icon || '',
    });
    setModalVisible(true);
  };

  // Delete item
  const handleDelete = (id: string) => {
    try {
      deleteInterest(id);
      loadInterests();
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
      console.error(error);
    }
  };

  // Save item (add or update)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingItem) {
        // Update existing item
        updateInterest(editingItem.id, values);
        message.success('更新成功');
      } else {
        // Add new item
        const newItem: Interest = {
          id: Date.now().toString(),
          ...values,
        };
        addInterest(newItem);
        message.success('添加成功');
      }

      setModalVisible(false);
      loadInterests();
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  // Table columns definition
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon: string) => icon || '-',
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_: any, record: Interest) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个兴趣吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 500 }}>兴趣管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          添加兴趣
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={interests}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingItem ? '编辑兴趣' : '添加兴趣'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入兴趣名称' }]}
          >
            <Input placeholder="例如：摄影" />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea rows={3} placeholder="简要描述这个兴趣" />
          </Form.Item>

          <Form.Item
            label="分类"
            name="category"
            rules={[{ required: true, message: '请输入分类' }]}
          >
            <Input placeholder="例如：艺术、运动、技术" />
          </Form.Item>

          <Form.Item
            label="图标"
            name="icon"
          >
            <Input placeholder="可选，输入 emoji 或图标代码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
