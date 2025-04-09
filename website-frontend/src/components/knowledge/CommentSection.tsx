import React, { useState } from 'react';
import { UserOutlined, HeartOutlined, HeartFilled, SendOutlined } from '@ant-design/icons';
import Image from 'next/image';

export interface Reply {
  id: string;
  author: string;
  avatar: string;
  content: string;
  publishDate: string;
  likes: number;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  publishDate: string;
  likes: number;
  replies?: Reply[];
}

export interface CommentSectionProps {
  comments: Comment[];
  articleId: string;
}

const CommentSection = ({ comments, articleId }: CommentSectionProps) => {
  const [commentList, setCommentList] = useState(comments as Comment[]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null as string | null);
  const [replyContent, setReplyContent] = useState('');
  
  // 添加新评论
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: '访客', // 实际项目中应从用户信息获取
      avatar: '/images/avatars/guest.png',
      content: newComment,
      publishDate: new Date().toISOString(),
      likes: 0
    };
    
    setCommentList([...commentList, comment]);
    setNewComment('');
    
    // 实际项目中应调用API保存评论
  };
  
  // 添加回复
  const handleAddReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    
    const reply: Reply = {
      id: `reply-${Date.now()}`,
      author: '访客', // 实际项目中应从用户信息获取
      avatar: '/images/avatars/guest.png',
      content: replyContent,
      publishDate: new Date().toISOString(),
      likes: 0
    };
    
    const updatedComments = commentList.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    });
    
    setCommentList(updatedComments);
    setReplyContent('');
    setReplyTo(null);
    
    // 实际项目中应调用API保存回复
  };
  
  // 点赞评论
  const handleLikeComment = (commentId: string) => {
    const updatedComments = commentList.map(comment => {
      if (comment.id === commentId) {
        // 这里简单实现，实际应该检查用户是否已点赞
        return { ...comment, likes: comment.likes + 1 };
      }
      
      // 检查回复中是否有匹配的ID
      if (comment.replies) {
        const updatedReplies = comment.replies.map(reply => {
          if (reply.id === commentId) {
            return { ...reply, likes: reply.likes + 1 };
          }
          return reply;
        });
        
        return { ...comment, replies: updatedReplies };
      }
      
      return comment;
    });
    
    setCommentList(updatedComments);
    
    // 实际项目中应调用API保存点赞状态
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="comment-section">
      {/* 评论列表 */}
      {commentList.length > 0 ? (
        <div className="space-y-6 mb-8">
          {commentList.map(comment => (
            <div key={comment.id} className="bg-white p-6 rounded-lg shadow-sm">
              {/* 评论头部 */}
              <div className="flex items-start mb-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-4">
                  {comment.avatar ? (
                    <Image 
                      src={comment.avatar} 
                      alt={comment.author} 
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <UserOutlined />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-900">{comment.author}</h4>
                    <span className="text-sm text-gray-500">{formatDate(comment.publishDate)}</span>
                  </div>
                  
                  <p className="text-gray-800 mb-4">{comment.content}</p>
                  
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => handleLikeComment(comment.id)}
                      className="flex items-center text-sm text-gray-500 hover:text-primary"
                    >
                      <HeartOutlined className="mr-1" />
                      <span>{comment.likes}</span>
                    </button>
                    
                    <button 
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="text-sm text-gray-500 hover:text-primary"
                    >
                      回复
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 回复表单 */}
              {replyTo === comment.id && (
                <div className="ml-14 mt-4 mb-4">
                  <div className="flex">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="写下你的回复..."
                      className="flex-1 border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      onClick={() => handleAddReply(comment.id)}
                      className="bg-primary text-white px-4 rounded-r-md hover:bg-primary-dark flex items-center"
                    >
                      <SendOutlined />
                    </button>
                  </div>
                </div>
              )}
              
              {/* 回复列表 */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-14 mt-6 space-y-4">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                          {reply.avatar ? (
                            <Image 
                              src={reply.avatar} 
                              alt={reply.author} 
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <UserOutlined />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-bold text-gray-900">{reply.author}</h5>
                            <span className="text-xs text-gray-500">{formatDate(reply.publishDate)}</span>
                          </div>
                          
                          <p className="text-gray-800 mb-2">{reply.content}</p>
                          
                          <button 
                            onClick={() => handleLikeComment(reply.id)}
                            className="flex items-center text-xs text-gray-500 hover:text-primary"
                          >
                            <HeartOutlined className="mr-1" />
                            <span>{reply.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg text-center mb-8">
          <p className="text-gray-500 mb-2">暂无评论</p>
          <p className="text-gray-500">成为第一个评论的人吧！</p>
        </div>
      )}
      
      {/* 评论表单 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-bold text-gray-900 mb-4">发表评论</h4>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
          placeholder="写下你的想法..."
          className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className={`px-6 py-2 rounded-md flex items-center space-x-2 ${
              newComment.trim() 
                ? 'bg-primary text-white hover:bg-primary-dark' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <SendOutlined />
            <span>发表评论</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection; 