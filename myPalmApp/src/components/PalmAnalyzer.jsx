// myPalmApp/src/components/PalmAnalyzer.jsx
import React, { useState } from 'react';

export default function PalmAnalyzer() {
  const [file, setFile]       = useState(null);
  const [style, setStyle]     = useState('ted');
  const [result, setResult]   = useState('');
  const [loading, setLoading] = useState(false);

  // В prod подставляем VITE_API_ROOT, в dev оставляем пустую строку для прокси
  const API_ROOT = import.meta.env.PROD
    ? import.meta.env.VITE_API_ROOT
    : '';

  const analyze = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult('');

    const formData = new FormData();
    formData.append('handImage', file);
    formData.append('style', style);

    try {
      const res  = await fetch(`${API_ROOT}/analyze`, {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      setResult(
        json.error
          ? '❌ ' + json.error
          : json.result || '⚠️ Пустой ответ от сервера'
      );
    } catch (err) {
      setResult('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      {/* остальной JSX без изменений */}
    </div>
  );
}
