"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plan } from '@/types/plan';
import { getPlans } from '@/lib/plan-storage';

export default function PlanSection() {
  const [plans, setPlans] = useState([] as Plan[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedPlans = getPlans();
    setPlans(storedPlans);
    setLoading(false);
  }, []);

  return (
    <section id="plans" className="py-12 bg-neutral">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">我的计划</h2>
          <p className="section-subtitle">记录我的目标和进展，保持前进的动力</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div key={plan.id} className="card transition-transform hover:-translate-y-1">
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary bg-opacity-10 text-primary">
                      {plan.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>

                  {/* 进度条 */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">完成进度</span>
                      <span className="font-medium">{plan.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary-600 h-2.5 rounded-full"
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <Link
                    href={`/plans`}
                    className="text-primary font-medium hover:text-primary-dark"
                  >
                    查看详情 →
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Link
                href="/plans"
                className="btn"
              >
                查看所有计划
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
} 