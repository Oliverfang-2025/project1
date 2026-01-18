"use client";

import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Input, InputNumber, Switch, Modal, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { NavItem } from '@/types/nav';
import { getNavItems, saveNavItems, addNavItem, updateNavItem, deleteNavItem, initializeDefaultNavItems } from '@/lib/nav-storage';

type NavLinkFormValues = {
  label: string;
  href: string;
  order: number;
  visible: boolean;
};

export default function NavigationManagement() {
  const [navItems, setNavItems] = useState([] as NavItem[]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null as NavItem | null);
  const [form] = Form.useForm();

  // Load navigation items
  const loadNavItems = () => {
    setLoading(true);
    try {
      // Initialize default items if none exist
      initializeDefaultNavItems();
      const items = getNavItems();
      setNavItems(items);
    } catch (error) {
      message.error('加载导航项失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNavItems();
  }, []);

  // Open modal for adding new item
  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({
      label: '',
      href: '',
      order: navItems.length + 1,
      visible: true,
    });
    setModalVisible(true);
  };

  // Open modal for editing item
  const handleEdit = (item: NavItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      label: item.label,
      href: item.href,
      order: item.order,
      visible: item.visible,
    });
    setModalVisible(true);
  };

  // Delete item
  const handleDelete = (id: string) => {
    try {
      deleteNavItem(id);
      loadNavItems();
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
        updateNavItem(editingItem.id, values);
        message.success('更新成功');
      } else {
        // Add new item
        const newItem: NavItem = {
          id: Date.now().toString(),
          ...values,
        };
        addNavItem(newItem);
        message.success('添加成功');
      }

      setModalVisible(false);
      loadNavItems();
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  // Table columns definition
  const columns = [
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: (a: NavItem, b: NavItem) => a.order - b.order,
    },
    {
      title: '显示文本',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: '链接地址',
      dataIndex: 'href',
      key: 'href',
    },
    {
      title: '是否可见',
      dataIndex: 'visible',
      key: 'visible',
      width: 100,
      render: (visible: boolean) => (visible ? '是' : '否'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_: any, record: NavItem) => (
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
            description="确定要删除这个导航项吗？"
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
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 500 }}>导航管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          添加导航项
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={navItems}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingItem ? '编辑导航项' : '添加导航项'}
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
            label="显示文本"
            name="label"
            rules={[{ required: true, message: '请输入显示文本' }]}
          >
            <Input placeholder="例如：首页" />
          </Form.Item>

          <Form.Item
            label="链接地址"
            name="href"
            rules={[
              { required: true, message: '请输入链接地址' },
              { type: 'string', pattern: /^\//, message: '链接地址必须以 / 开头' },
            ]}
          >
            <Input placeholder="例如：/" />
          </Form.Item>

          <Form.Item
            label="排序"
            name="order"
            rules={[{ required: true, message: '请输入排序' }]}
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="是否可见"
            name="visible"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
