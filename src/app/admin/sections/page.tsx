"use client";

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getSectionsConfig, saveSectionsConfig, resetSectionsConfig } from '@/lib/section-storage';
import { SectionConfig } from '@/types/section-config';

// Sortable section item component
function SortableSection({
  section,
  onToggle
}: {
  section: SectionConfig;
  onToggle: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
        section.visible ? 'border-primary-200' : 'border-gray-200 opacity-60'
      }`}
    >
      <div className="flex items-center p-4">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 mr-4 p-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg>
        </button>

        {/* Section info */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{section.name}</h3>
              <p className="text-sm text-gray-500">{section.description}</p>
            </div>

            {/* Toggle switch */}
            <button
              onClick={() => onToggle(section.id)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                section.visible ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label={`Toggle ${section.name} visibility`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  section.visible ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SectionsManagementPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Drag sensors configuration
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load configuration
  useEffect(() => {
    const config = getSectionsConfig();
    setSections(config.sort((a, b) => a.order - b.order));
    setLoading(false);
  }, []);

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(s => s.id === active.id);
      const newIndex = sections.findIndex(s => s.id === over.id);

      const newSections = arrayMove(sections, oldIndex, newIndex);
      // Update order values
      const updatedSections = newSections.map((section: any, index: number) => ({
        ...section,
        order: index,
      }));

      setSections(updatedSections);
      setHasChanges(true);
    }
  };

  // Toggle section visibility
  const handleToggleVisibility = (id: string) => {
    const updatedSections = sections.map((section: any) =>
      section.id === id
        ? { ...section, visible: !section.visible }
        : section
    );
    setSections(updatedSections);
    setHasChanges(true);
  };

  // Save configuration
  const handleSave = () => {
    saveSectionsConfig(sections);
    setHasChanges(false);
    alert('保存成功！刷新首页即可看到效果。');
  };

  // Reset configuration
  const handleReset = () => {
    if (confirm('确定要重置为默认配置吗？所有自定义设置将丢失。')) {
      resetSectionsConfig();
      const defaultConfig = getSectionsConfig();
      setSections(defaultConfig);
      setHasChanges(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header and action bar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">首页板块管理</h2>
          <p className="text-gray-600 mt-1">拖拽调整板块顺序，使用开关控制显示/隐藏</p>
        </div>
        <div className="space-x-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            重置默认
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded-lg text-white ${
              hasChanges
                ? 'bg-primary-600 hover:bg-primary-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            保存更改
          </button>
        </div>
      </div>

      {/* Sections list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {sections.map(section => (
              <SortableSection
                key={section.id}
                section={section}
                onToggle={handleToggleVisibility}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Preview hint */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-blue-800">
              <strong>提示：</strong>保存后访问首页即可看到效果。欢迎横幅始终显示在顶部，不受此配置影响。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
