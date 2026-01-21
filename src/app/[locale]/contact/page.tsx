"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Github, Linkedin, Send, CheckCircle, XCircle } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    content: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      content: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = '姓名不能为空';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    if (!formData.content.trim()) {
      newErrors.content = '留言内容不能为空';
    } else if (formData.content.length > 5000) {
      newErrors.content = '留言内容不能超过5000字符';
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.content;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', content: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t('info.email'),
      value: '635800070@qq.com',
      href: 'mailto:635800070@qq.com'
    },
    {
      icon: Phone,
      title: '电话',
      value: '+86 136 7904 1859',
      href: 'tel:+8613679041859'
    },
    {
      icon: MapPin,
      title: t('info.location'),
      value: '无锡 | 成都-郫都区',
      href: null
    }
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/oliverfang-2025',
      color: 'hover:text-white'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com',
      color: 'hover:text-blue-400'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('title')}</h1>
        <p className="text-gray-400 text-lg">期待与您的交流与合作</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        {/* Contact Form */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Send className="w-6 h-6 mr-3 text-primary-400" />
                发送消息
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">
                    {t('form.name')} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="请输入您的姓名"
                    error={!!errors.name}
                    className="bg-gray-800/50 border-gray-700"
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">
                    {t('form.email')} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="请输入您的邮箱"
                    error={!!errors.email}
                    className="bg-gray-800/50 border-gray-700"
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">
                    {t('form.subject')}
                  </label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="消息主题（可选）"
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">
                    {t('form.message')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="请输入您的留言内容..."
                    rows={6}
                    className={`w-full px-4 py-3 bg-gray-800/50 rounded-lg text-white border transition-all ${
                      errors.content
                        ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500'
                        : 'border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                    } resize-none`}
                  />
                  {errors.content && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {errors.content}
                    </motion.p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {formData.content.length}/5000
                  </p>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {t('form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {t('form.submit')}
                    </>
                  )}
                </motion.button>

                {/* Status Messages */}
                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-3"
                    >
                      <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{t('form.success')}</span>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3"
                    >
                      <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{t('form.error')}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Info & Social Links */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white mb-6">联系方式</h2>
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={index}
                  href={info.href || undefined}
                  target={info.href ? '_blank' : undefined}
                  rel={info.href ? 'noopener noreferrer' : undefined}
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-primary-600/50 transition-all cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-start">
                        <div className="bg-primary-600/20 rounded-lg p-3 mr-4 flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium mb-1">{info.title}</h3>
                          <p className="text-gray-400 text-sm break-all">{info.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.a>
              );
            })}
          </div>

          {/* Social Links */}
          <div className="pt-6">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              {t('info.social')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group"
                  >
                    <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-gray-700 transition-all">
                      <CardContent className="p-5">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Icon className="w-8 h-8 text-gray-400 group-hover:text-primary-400 transition-colors" />
                          <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                            {social.name}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Additional Info Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="pt-6"
          >
            <Card className="bg-gradient-to-br from-primary-600/20 to-secondary-600/20 backdrop-blur-sm border-primary-600/30">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-2">工作时间</h3>
                <p className="text-gray-300 text-sm mb-4">
                  周一至周五: 9:00 - 18:00 (CST)
                </p>
                <p className="text-gray-400 text-xs">
                  通常会在24小时内回复您的消息
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
