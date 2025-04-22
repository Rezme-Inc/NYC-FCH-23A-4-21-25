import React, { useCallback, useState } from 'react';
import { Link2, Plus } from 'lucide-react';

interface DocumentUploadProps {
  onUrlSubmit: (url: string, name: string) => void;
  label: string;
}

export function DocumentUpload({ onUrlSubmit, label }: DocumentUploadProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && name) {
      onUrlSubmit(url, name);
      setUrl('');
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="policy-name" className="block text-sm font-medium text-gray-700 mb-1">
          Policy Name
        </label>
        <input
          type="text"
          id="policy-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Fair Hiring Policy"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="policy-url" className="block text-sm font-medium text-gray-700 mb-1">
          Policy URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            id="policy-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://company.com/policies/fair-hiring"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </button>
        </div>
      </div>
    </form>
  );
}