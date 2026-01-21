"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth) {
      try {
        const authData = JSON.parse(auth);
        if (authData.isLoggedIn && authData.expiresAt > Date.now()) {
          router.push('/admin');
        }
      } catch (e) {
        localStorage.removeItem('admin_auth');
      }
    }
  }, [router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const authData = {
          isLoggedIn: true,
          username: data.username,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000
        };
        localStorage.setItem('admin_auth', JSON.stringify(authData));
        router.push('/admin');
      } else {
        setError(data.error || '用户名或密码不正确');
        setLoading(false);
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-border shadow-glow-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">管理员登录</CardTitle>
            <CardDescription className="text-foreground-muted">
              请输入您的管理员凭据访问后台
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-foreground">
                  用户名
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  icon={<User className="w-5 h-5" />}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  密码
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-5 h-5" />}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-error/10 border border-error/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-error">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                size="lg"
                loading={loading}
                disabled={loading}
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-foreground-muted">
            默认账户: admin / admin123
          </p>
          <p className="text-xs text-foreground-subtle mt-1">
            首次登录后请修改密码
          </p>
        </div>
      </div>
    </div>
  );
}
