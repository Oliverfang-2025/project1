"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, Button, Modal, Form, Input, InputNumber, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  getSkills, saveSkills, addSkill, updateSkill, deleteSkill,
  getExperiences, saveExperiences, addExperience, updateExperience, deleteExperience,
  getEducations, saveEducations, addEducation, updateEducation, deleteEducation
} from '@/lib/about-storage';
import { Skill, Experience, Education } from '@/types/about';

const { TextArea } = Input;

export default function AboutManagementPage() {
  // Skills state
  const [skills, setSkills] = useState([] as Skill[]);
  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null as Skill | null);
  const [skillForm] = Form.useForm();

  // Experiences state
  const [experiences, setExperiences] = useState([] as Experience[]);
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null as Experience | null);
  const [experienceForm] = Form.useForm();

  // Educations state
  const [educations, setEducations] = useState([] as Education[]);
  const [educationModalVisible, setEducationModalVisible] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null as Education | null);
  const [educationForm] = Form.useForm();

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSkills(getSkills());
    setExperiences(getExperiences());
    setEducations(getEducations());
  };

  // ==================== SKILLS ====================

  const handleAddSkill = () => {
    setEditingSkill(null);
    skillForm.resetFields();
    setSkillModalVisible(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    skillForm.setFieldsValue(skill);
    setSkillModalVisible(true);
  };

  const handleDeleteSkill = (id: string) => {
    deleteSkill(id);
    loadData();
    message.success('删除成功');
  };

  const handleSkillSubmit = () => {
    skillForm.validateFields().then(values => {
      if (editingSkill) {
        updateSkill(editingSkill.id, values);
        message.success('更新成功');
      } else {
        addSkill(values);
        message.success('添加成功');
      }
      loadData();
      setSkillModalVisible(false);
      skillForm.resetFields();
    });
  };

  // ==================== EXPERIENCES ====================

  const handleAddExperience = () => {
    setEditingExperience(null);
    experienceForm.resetFields();
    setExperienceModalVisible(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    experienceForm.setFieldsValue(experience);
    setExperienceModalVisible(true);
  };

  const handleDeleteExperience = (id: string) => {
    deleteExperience(id);
    loadData();
    message.success('删除成功');
  };

  const handleExperienceSubmit = () => {
    experienceForm.validateFields().then(values => {
      if (editingExperience) {
        updateExperience(editingExperience.id, values);
        message.success('更新成功');
      } else {
        addExperience(values);
        message.success('添加成功');
      }
      loadData();
      setExperienceModalVisible(false);
      experienceForm.resetFields();
    });
  };

  // ==================== EDUCATIONS ====================

  const handleAddEducation = () => {
    setEditingEducation(null);
    educationForm.resetFields();
    setEducationModalVisible(true);
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
    educationForm.setFieldsValue(education);
    setEducationModalVisible(true);
  };

  const handleDeleteEducation = (id: string) => {
    deleteEducation(id);
    loadData();
    message.success('删除成功');
  };

  const handleEducationSubmit = () => {
    educationForm.validateFields().then(values => {
      if (editingEducation) {
        updateEducation(editingEducation.id, values);
        message.success('更新成功');
      } else {
        addEducation(values);
        message.success('添加成功');
      }
      loadData();
      setEducationModalVisible(false);
      educationForm.resetFields();
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">关于页面管理</h1>

      <Tabs
        defaultActiveKey="skills"
        items={[
          {
            key: 'skills',
            label: '专业技能',
            children: (
              <div>
                <div className="mb-4">
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSkill}>
                    添加技能
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills.map(skill => (
                    <div key={skill.id} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                          <span className="text-sm text-gray-500">{skill.category}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEditSkill(skill)}
                          />
                          <Popconfirm
                            title="确定要删除这个技能吗？"
                            onConfirm={() => handleDeleteSkill(skill.id)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>熟练度</span>
                          <span>{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          },
          {
            key: 'experiences',
            label: '工作经历',
            children: (
              <div>
                <div className="mb-4">
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddExperience}>
                    添加经历
                  </Button>
                </div>
                <div className="space-y-4">
                  {experiences.map(exp => (
                    <div key={exp.id} className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{exp.company}</h3>
                          <p className="text-lg font-semibold text-gray-700">{exp.title}</p>
                          <p className="text-primary-600 font-medium">{exp.period}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEditExperience(exp)}
                          />
                          <Popconfirm
                            title="确定要删除这个经历吗？"
                            onConfirm={() => handleDeleteExperience(exp.id)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </div>
                      </div>
                      <p className="text-gray-600">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          },
          {
            key: 'educations',
            label: '教育背景',
            children: (
              <div>
                <div className="mb-4">
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEducation}>
                    添加教育
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {educations.map(edu => (
                    <div key={edu.id} className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900">{edu.school}</h3>
                          <p className="text-gray-700 mb-1">{edu.degree}</p>
                          <p className="text-primary-600 font-medium mb-2">{edu.period}</p>
                          <p className="text-gray-600">{edu.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEditEducation(edu)}
                          />
                          <Popconfirm
                            title="确定要删除这个教育背景吗？"
                            onConfirm={() => handleDeleteEducation(edu.id)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }
        ]}
      />

      {/* Skill Modal */}
      <Modal
        title={editingSkill ? '编辑技能' : '添加技能'}
        open={skillModalVisible}
        onOk={handleSkillSubmit}
        onCancel={() => {
          setSkillModalVisible(false);
          skillForm.resetFields();
        }}
        okText="确定"
        cancelText="取消"
      >
        <Form form={skillForm} layout="vertical">
          <Form.Item
            label="技能名称"
            name="name"
            rules={[{ required: true, message: '请输入技能名称' }]}
          >
            <Input placeholder="例如：半导体生产管理" />
          </Form.Item>
          <Form.Item
            label="分类"
            name="category"
            rules={[{ required: true, message: '请输入分类' }]}
          >
            <Input placeholder="例如：专业技能" />
          </Form.Item>
          <Form.Item
            label="熟练度"
            name="level"
            rules={[{ required: true, message: '请输入熟练度' }]}
          >
            <InputNumber min={1} max={100} className="w-full" placeholder="1-100" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Experience Modal */}
      <Modal
        title={editingExperience ? '编辑经历' : '添加经历'}
        open={experienceModalVisible}
        onOk={handleExperienceSubmit}
        onCancel={() => {
          setExperienceModalVisible(false);
          experienceForm.resetFields();
        }}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form form={experienceForm} layout="vertical">
          <Form.Item
            label="公司名称"
            name="company"
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Input placeholder="例如：无锡市宜欣科技有限公司" />
          </Form.Item>
          <Form.Item
            label="职位"
            name="title"
            rules={[{ required: true, message: '请输入职位' }]}
          >
            <Input placeholder="例如：生产部长" />
          </Form.Item>
          <Form.Item
            label="时间段"
            name="period"
            rules={[{ required: true, message: '请输入时间段' }]}
          >
            <Input placeholder="例如：2022年7月 - 至今" />
          </Form.Item>
          <Form.Item
            label="工作描述"
            name="description"
            rules={[{ required: true, message: '请输入工作描述' }]}
          >
            <TextArea rows={4} placeholder="描述您的工作内容和成就" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Education Modal */}
      <Modal
        title={editingEducation ? '编辑教育背景' : '添加教育背景'}
        open={educationModalVisible}
        onOk={handleEducationSubmit}
        onCancel={() => {
          setEducationModalVisible(false);
          educationForm.resetFields();
        }}
        okText="确定"
        cancelText="取消"
      >
        <Form form={educationForm} layout="vertical">
          <Form.Item
            label="学校名称"
            name="school"
            rules={[{ required: true, message: '请输入学校名称' }]}
          >
            <Input placeholder="例如：四川大学" />
          </Form.Item>
          <Form.Item
            label="学位"
            name="degree"
            rules={[{ required: true, message: '请输入学位' }]}
          >
            <Input placeholder="例如：本科" />
          </Form.Item>
          <Form.Item
            label="时间段"
            name="period"
            rules={[{ required: true, message: '请输入时间段' }]}
          >
            <Input placeholder="例如：2018年9月 - 2020年6月" />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input placeholder="例如：人力资源管理（工商管理类）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
