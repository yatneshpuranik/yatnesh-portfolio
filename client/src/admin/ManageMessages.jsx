import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../layout/AdminLayout';
import { fetchMessages, markMessageRead, deleteMessage } from '../services/api';
import { Mail, Check, Trash2, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageMessages = () => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages-list'],
    queryFn: fetchMessages,
  });

  // Mutators
  const markReadMutation = useMutation({
    mutationFn: markMessageRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-messages-list']);
      toast.success('Message marked as read');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update message status');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-messages-list']);
      toast.success('Message deleted successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete message');
    },
  });

  const handleMarkRead = (id) => {
    markReadMutation.mutate(id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contact message?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        
        <p className="text-sm text-gray-500">Review all contact submissions sent to your MongoDB database and gmail notifications.</p>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-t-purple-600 border-gray-300 dark:border-gray-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {messages?.map((msg) => (
              <div 
                key={msg._id} 
                className={`p-6 rounded-xl border flex flex-col gap-4 bg-white dark:bg-[#0b0f19] transition-all
                  ${!msg.isRead 
                    ? 'border-purple-500/30 bg-purple-600/[0.02] shadow-sm' 
                    : 'border-gray-200 dark:border-gray-800'
                  }
                `}
              >
                {/* Message Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-md text-gray-950 dark:text-gray-100">{msg.name}</span>
                      <span className="text-xs text-gray-500 font-mono">(&lt;{msg.email}&gt;)</span>
                    </div>
                    <p className="font-bold text-sm text-purple-500">{msg.subject}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-gray-500 shrink-0">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-850/50 text-sm leading-relaxed text-gray-600 dark:text-gray-300 font-normal whitespace-pre-line">
                  {msg.message}
                </div>

                {/* Message Footer Toolbar */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-150 dark:border-gray-850">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    Status: {msg.isRead ? 'Read' : 'Unread'}
                  </span>

                  <div className="flex gap-2">
                    {/* Mark Read */}
                    {!msg.isRead && (
                      <button
                        onClick={() => handleMarkRead(msg._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Read</span>
                      </button>
                    )}
                    
                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-500/20 hover:bg-red-550/10 text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}

            {(!messages || messages.length === 0) && (
              <div className="py-16 text-center text-gray-500 border border-dashed border-gray-250 dark:border-gray-800 rounded-xl">
                Your inbox is empty. No messages received yet.
              </div>
            )}
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default ManageMessages;
