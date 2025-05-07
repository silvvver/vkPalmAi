// src/components/PalmAnalyzer.jsx
import React, { useState } from 'react';

export default function PalmAnalyzer() {
  const [file, setFile] = useState(null);
  const [style, setStyle] = useState('ted');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const analyze = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult('');

    const formData = new FormData();
    formData.append('handImage', file);
    formData.append('style', style);

    try {
      const res = await fetch('/analyze', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (json.error) {
        setResult('❌ ' + json.error);
      } else {
        setResult(json.result || '⚠️ Пустой ответ от сервера');
      }
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
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files[0] || null)}
            required
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <label style={{ marginRight: 10 }}>
            <input
              type="radio"
              name="style"
              value="ted"
              checked={style === 'ted'}
              onChange={() => setStyle('ted')}
            /> Тэдус
          </label>
          <label style={{ marginRight: 10 }}>
            <input
              type="radio"
              name="style"
              value="professor"
              checked={style === 'professor'}
              onChange={() => setStyle('professor')}
            /> Профессор
          </label>
          <label>
            <input
              type="radio"
              name="style"
              value="buzova"
              checked={style === 'buzova'}
              onChange={() => setStyle('buzova')}
            /> Бузова
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '⏳ Анализируем…' : '📤 Отправить'}
        </button>
      </form>

      {result && (
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            background: '#fafafa',
            padding: 15,
            marginTop: 20,
            border: '1px solid #ddd'
          }}
        >
          {result}
        </pre>
      )}
    </div>
  );
}
