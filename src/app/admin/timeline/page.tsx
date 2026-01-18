"use client";

import React, { useState, useEffect } from 'react';
import { TimelineItem } from '@/types/timeline';
import { getTimelineItems, saveTimelineItems, addTimelineItem, updateTimelineItem, deleteTimelineItem } from '@/lib/timeline-storage';
import { Button, Table, Modal, Form, Input, InputNumber, DatePicker, Space, message, Popconfirm, Tag } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

export default function TimelinePage() {
  const [timelineItems, setTimelineItems] = useState([] as TimelineItem[]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null as TimelineItem | null);
  const [form] = Form.useForm();

  // Load timeline items
  useEffect(() => {
    loadTimelineItems();
  }, []);

  const loadTimelineItems = () => {
    setLoading(true);
    setTimeout(() => {
      const items = getTimelineItems();

      // Initialize with sample data if empty
      if (items.length === 0) {
        const sampleData: TimelineItem[] = [
          {
            id: '1',
            title: '参加Web技术研讨会',
            date: '2023-07-15',
            content: '分享了前端优化的经验和最佳实践，收获颇丰',
            likes: 24,
            comments: 8,
            category: '技术'
          },
          {
            id: '2',
            title: '新书推荐：《深入浅出React》',
            date: '2023-06-20',
            content: '最近读了这本书，内容深入浅出，非常推荐给前端开发者',
            likes: 32,
            comments: 12,
            category: '阅读'
          },
          {
            id: '3',
            title: '周末登山记',
            date: '2023-05-28',
            content: '周末和朋友一起去了附近的山，拍了很多美丽的风景照片',
            likes: 45,
            comments: 15,
            category: '生活'
          }
        ];
        saveTimelineItems(sampleData);
        setTimelineItems(sampleData);
      } else {
        setTimelineItems(items);
      }

      setLoading(false);
    }, 500);
  };

  // Open modal for adding
  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Open modal for editing
  const handleEdit = (item: TimelineItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      ...item,
      date: dayjs(item.date)
    });
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const timelineData: TimelineItem = {
        id: editingItem?.id || `timeline_${Date.now()}`,
        title: values.title,
        date: values.date.format('YYYY-MM-DD'),
        content: values.content,
        likes: values.likes || 0,
        comments: values.comments || 0,
        category: values.category
      };

      if (editingItem) {
        updateTimelineItem(editingItem.id, timelineData);
        message.success('时间线项已更新');
      } else {
        addTimelineItem(timelineData);
        message.success('时间线项已添加');
      }

      loadTimelineItems();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // Handle delete
  const handleDelete = (id: string) => {
    deleteTimelineItem(id);
    message.success('时间线项已删除');
    loadTimelineItems();
  };

  // Table columns
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      sorter: (a: TimelineItem, b: TimelineItem) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date: string) => date
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => category ? <Tag color="blue">{category}</Tag> : '-'
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (content: string) => (
        <div className="max-w-xs truncate">{content}</div>
      )
    },
    {
      title: '点赞',
      dataIndex: 'likes',
      key: 'likes',
      width: 80
    },
    {
      title: '评论',
      dataIndex: 'comments',
      key: 'comments',
      width: 80
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: TimelineItem) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条时间线吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">时间线管理</h1>
          <p className="text-sm text-gray-600 mt-1">管理网站心路历程内容</p>
        </div>
        <Button
          type="primary"
          onClick={handleAdd}
        >
          添加时间线
        </Button>
      </div>

      {/* Timeline Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{timelineItems.length}</div>
          <div className="text-sm text-gray-600">总时间线数</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-primary-600">
            {timelineItems.reduce((sum, item) => sum + item.likes, 0)}
          </div>
          <div className="text-sm text-gray-600">总点赞数</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-secondary-600">
            {timelineItems.reduce((sum, item) => sum + item.comments, 0)}
          </div>
          <div className="text-sm text-gray-600">总评论数</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {new Set(timelineItems.map(item => item.category)).size}
          </div>
          <div className="text-sm text-gray-600">分类数量</div>
        </div>
      </div>

      {/* Timeline Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          dataSource={timelineItems}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`
          }}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={editingItem ? '编辑时间线' : '添加时间线'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入时间线标题" />
          </Form.Item>

          <Form.Item
            label="日期"
            name="date"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            label="分类"
            name="category"
          >
            <Input placeholder="例如：技术、生活、阅读" />
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入时间线内容"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="点赞数"
              name="likes"
              initialValue={0}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item
              label="评论数"
              name="comments"
              initialValue={0}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
