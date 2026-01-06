
import React, { useState } from 'react';
import { Button } from './Button';
import { Message, MessageTone, MessageStatus } from '../types';
import { generateLegacyMessage } from '../services/geminiService';

interface MessageEditorProps {
  onSave: (message: Partial<Message>) => void;
  onCancel: () => void;
  initialData?: Message;
}

export const MessageEditor: React.FC<MessageEditorProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Partial<Message>>(initialData || {
    title: '',
    recipientName: '',
    recipientEmail: '',
    content: '',
    tone: MessageTone.EMOTIONAL,
    status: MessageStatus.DRAFT
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const handleAiGenerate = async () => {
    if (!formData.recipientName) {
      alert("Please enter a recipient name first.");
      return;
    }
    setIsGenerating(true);
    try {
      const generatedContent = await generateLegacyMessage(
        formData.recipientName,
        formData.tone || MessageTone.EMOTIONAL,
        aiPrompt,
        'medium'
      );
      setFormData(prev => ({ ...prev, content: generatedContent }));
    } catch (error) {
      console.error(error);
      alert("Failed to generate content.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-serif font-bold mb-6 text-slate-800">
        {initialData ? 'Edit Message' : 'Create New Last Word'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="e.g., Final Thoughts for Sarah"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.recipientName}
              onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.recipientEmail}
              onChange={e => setFormData({ ...formData, recipientEmail: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tone</label>
          <select 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            value={formData.tone}
            onChange={e => setFormData({ ...formData, tone: e.target.value as MessageTone })}
          >
            {Object.values(MessageTone).map(tone => (
              <option key={tone} value={tone}>{tone}</option>
            ))}
          </select>
        </div>

        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          <label className="block text-sm font-semibold text-indigo-900 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            AI Writing Assistant
          </label>
          <textarea 
            className="w-full px-3 py-2 rounded-lg border border-indigo-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            rows={2}
            placeholder="Enter a few specific memories or lessons to include..."
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
          />
          <Button 
            variant="secondary" 
            size="sm" 
            className="mt-2 w-full"
            onClick={handleAiGenerate}
            isLoading={isGenerating}
          >
            Draft with AI
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Message Content</label>
          <textarea 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[200px]"
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(formData)}>
            {initialData ? 'Update Message' : 'Save Message'}
          </Button>
        </div>
      </div>
    </div>
  );
};
