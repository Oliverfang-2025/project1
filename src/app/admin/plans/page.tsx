"use client";

import React, { useState, useEffect } from 'react';
import { Plan } from '@/types/plan';
import { getPlans, savePlans, addPlan, updatePlan, deletePlan } from '@/lib/plan-storage';

export default function PlansAdminPage() {
  const [plans, setPlans] = useState([] as Plan[]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null as Plan | null);
  const [isAdding, setIsAdding] = useState(false);
  const [newPlan, setNewPlan] = useState({
    id: '',
    title: '',
    description: '',
    progress: 0,
    category: '',
    status: 'active'
  } as any);

  // Load plans
  useEffect(() => {
    const stored = getPlans();

    if (stored.length === 0) {
      // Initialize with default plans
      const defaultPlans: Plan[] = [
        {
          id: '1',
          title: '技术提升计划',
          description: '学习最新的前端框架和技术，每月至少完成一个技术项目',
          progress: 75,
          category: '职业发展',
          status: 'active'
        },
        {
          id: '2',
          title: '读书计划',
          description: '每月阅读3本书，包括技术、管理和文学类书籍',
          progress: 60,
          category: '个人成长',
          status: 'active'
        },
        {
          id: '3',
          title: '健身计划',
          description: '每周至少锻炼3次，包括有氧运动和力量训练',
          progress: 50,
          category: '健康',
          status: 'active'
        }
      ];
      setPlans(defaultPlans);
      savePlans(defaultPlans);
    } else {
      setPlans(stored);
    }

    setLoading(false);
  }, []);

  // Handle input change
  const handleInputChange = (e: any, isNew: boolean = false) => {
    const { name, value } = e.target;

    if (name === 'progress') {
      const numValue = parseInt(value) || 0;
      if (isNew) {
        setNewPlan(prev => ({ ...prev, [name]: Math.min(100, Math.max(0, numValue)) }));
      } else if (editingPlan) {
        setEditingPlan(prev => ({ ...prev!, [name]: Math.min(100, Math.max(0, numValue)) }));
      }
    } else {
      if (isNew) {
        setNewPlan(prev => ({ ...prev, [name]: value }));
      } else if (editingPlan) {
        setEditingPlan(prev => ({ ...prev!, [name]: value }));
      }
    }
  };

  // Start editing
  const startEditing = (plan: Plan) => {
    setEditingPlan(plan);
    setIsAdding(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingPlan(null);
    setIsAdding(false);
  };

  // Save edited plan
  const saveEditedPlan = () => {
    if (!editingPlan) return;

    updatePlan(editingPlan.id, editingPlan);
    setPlans(getPlans());
    setEditingPlan(null);
  };

  // Start adding
  const startAdding = () => {
    setIsAdding(true);
    setEditingPlan(null);
    setNewPlan({
      id: `plan_${Date.now()}`,
      title: '',
      description: '',
      progress: 0,
      category: '',
      status: 'active'
    });
  };

  // Save new plan
  const saveNewPlan = () => {
    if (!newPlan.title || !newPlan.description || !newPlan.category) {
      alert('请填写完整的计划信息');
      return;
    }

    const plan: Plan = {
      id: newPlan.id || `plan_${Date.now()}`,
      title: newPlan.title,
      description: newPlan.description,
      progress: newPlan.progress || 0,
      category: newPlan.category,
      status: newPlan.status || 'active'
    };

    addPlan(plan);
    setPlans(getPlans());
    setIsAdding(false);
    setNewPlan({
      id: '',
      title: '',
      description: '',
      progress: 0,
      category: '',
      status: 'active'
    });
  };

  // Delete plan
  const deletePlanHandler = (id: string) => {
    if (window.confirm('确定要删除这个计划吗？')) {
      deletePlan(id);
      setPlans(getPlans());
    }
  };

  // Category options
  const categoryOptions = ['职业发展', '个人成长', '健康', '学习', '其他'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">计划管理</h1>
        <button
          onClick={startAdding}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          disabled={isAdding || editingPlan !== null}
        >
          添加计划
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Plans list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map(plan => (
              <div key={plan.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary bg-opacity-10 text-primary mb-2">
                      {plan.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{plan.title}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(plan)}
                      className="text-gray-500 hover:text-primary-600"
                      disabled={editingPlan !== null || isAdding}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deletePlanHandler(plan.id)}
                      className="text-gray-500 hover:text-red-600"
                      disabled={editingPlan !== null || isAdding}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{plan.description}</p>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">完成进度</span>
                    <span className="font-medium text-primary-600">{plan.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${plan.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit form */}
          {editingPlan && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">编辑计划</h2>
                <button
                  onClick={cancelEditing}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                  <input
                    type="text"
                    name="title"
                    value={editingPlan.title}
                    onChange={e => handleInputChange(e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                  <textarea
                    name="description"
                    value={editingPlan.description}
                    onChange={e => handleInputChange(e)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                    <select
                      name="category"
                      value={editingPlan.category}
                      onChange={e => handleInputChange(e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      {categoryOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">进度 ({editingPlan.progress}%)</label>
                    <input
                      type="range"
                      name="progress"
                      min="0"
                      max="100"
                      value={editingPlan.progress}
                      onChange={e => handleInputChange(e)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={saveEditedPlan}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    保存修改
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add form */}
          {isAdding && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">添加计划</h2>
                <button
                  onClick={cancelEditing}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                  <input
                    type="text"
                    name="title"
                    value={newPlan.title}
                    onChange={e => handleInputChange(e, true)}
                    placeholder="例如: 学习新技能"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                  <textarea
                    name="description"
                    value={newPlan.description}
                    onChange={e => handleInputChange(e, true)}
                    rows={3}
                    placeholder="描述你的计划详情..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                    <select
                      name="category"
                      value={newPlan.category}
                      onChange={e => handleInputChange(e, true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">选择分类</option>
                      {categoryOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">进度 ({newPlan.progress}%)</label>
                    <input
                      type="range"
                      name="progress"
                      min="0"
                      max="100"
                      value={newPlan.progress}
                      onChange={e => handleInputChange(e, true)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={saveNewPlan}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    添加计划
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
