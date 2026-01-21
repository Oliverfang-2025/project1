"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth) {
      try {
        const authData = JSON.parse(auth);
        setUsername(authData.username || '');
      } catch (e) {
        console.error('Invalid auth data');
      }
    }
  }, []);

  const handlePasswordChange = async (e: any) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '新密码和确认密码不匹配' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: '新密码长度至少为6位' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: '密码修改成功！请重新登录' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        setTimeout(() => {
          localStorage.removeItem('admin_auth');
          window.location.href = '/admin/login';
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || '密码修改失败' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '网络错误，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">账户设置</h1>
        <p className="text-foreground-muted">管理您的账户信息和安全设置</p>
      </div>

      {/* Account Info */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary-400" />
            账户信息
          </CardTitle>
          <CardDescription>当前登录的账户信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground-muted">用户名</label>
              <p className="text-lg font-semibold text-foreground mt-1">{username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground-muted">角色</label>
              <p className="text-lg font-semibold text-foreground mt-1">管理员</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary-400" />
            修改密码
          </CardTitle>
          <CardDescription>更改您的登录密码以保护账户安全</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="current-password" className="text-sm font-medium text-foreground">
                当前密码
              </label>
              <Input
                id="current-password"
                type="password"
                placeholder="请输入当前密码"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium text-foreground">
                新密码
              </label>
              <Input
                id="new-password"
                type="password"
                placeholder="请输入新密码（至少6位）"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
                确认新密码
              </label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="请再次输入新密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                required
                disabled={loading}
              />
            </div>

            {message && (
              <div className={`flex items-start gap-2 p-3 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-error/10 border-error/20'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                )}
                <p className={`text-sm ${
                  message.type === 'success' ? 'text-green-400' : 'text-error'
                }`}>
                  {message.text}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
              >
                {loading ? '修改中...' : '修改密码'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setMessage(null);
                }}
                disabled={loading}
              >
                重置
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
