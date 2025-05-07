// src/components/PalmAnalyzer.jsx
import React, { useState } from 'react';

export default function PalmAnalyzer() {
  const [file, setFile]   = useState(null);
  const [style, setStyle] = useState('ted');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // базовый URL бек-энда: из .env.production либо пустая строка (dev-proxy)
  const API = import.meta.env.VITE_API_BASE || '';

  const analyze = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult('');

    const formData = new FormData();
    formData.append('handImage', file);
    formData.append('style', style);

    try {
      const res   = await fetch(`${API}/analyze`, { method: 'POST', body: formData });
      const json  = await res.json();

      setResult(json.error ? '❌ ' + json.error
                           : json.result || '⚠️ Пустой ответ от сервера');
    } catch (err) {
      setResult('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h2>🔮 Онлайн-хиромант</h2>

      <form onSubmit={analyze}>
        <input
          type="file"
          accept="image/*"
          required
          onChange={e => setFile(e.target.files[0] || null)}
        />

        <div style={{ margin: '10px 0' }}>
          {['ted','professor','buzova'].map(s => (
            <label key={s} style={{ marginRight: 12 }}>
              <input
                type="radio"
                name="style"
                value={s}
                checked={style === s}
                onChange={() => setStyle(s)}
              />{' '}
              {s === 'ted' ? 'Тэдус' : s === 'professor' ? 'Профессор' : 'Бузова'}
            </label>
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? '⏳ Анализируем…' : '📤 Отправить'}
        </button>
      </form>

      {result && (
        <pre style={{
          whiteSpace:'pre-wrap',
          marginTop:20,
          padding:15,
          background:'#fafafa',
          border:'1px solid #ddd'
        }}>
          {result}
        </pre>
      )}
    </div>
  );
}
