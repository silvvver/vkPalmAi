// myPalmApp/src/components/PalmAnalyzer.jsx
import React, { useState } from 'react';

export default function PalmAnalyzer() {
  const [file, setFile]     = useState(null);
  const [style, setStyle]   = useState('ted');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Если сборка production -- берём адрес из .env.production,
  // иначе оставляем пустую строку (локальный proxy `/analyze`)
  const API_ROOT =
    import.meta.env.PROD
      ? 'https://vk-palm-ai-backend.onrender.com'      // PROD-бэк
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
      <h2>🔮 Онлайн-хиромант</h2>

      <form onSubmit={analyze}>
        <input
          type="file"
          accept="image/*"
          required
          onChange={e => setFile(e.target.files[0] || null)}
        />

        <div style={{ margin: '12px 0' }}>
          {[
            { id: 'ted', label: 'Тэдус' },
            { id: 'professor', label: 'Профессор' },
            { id: 'buzova', label: 'Бузова' }
          ].map(opt => (
            <label key={opt.id} style={{ marginRight: 14 }}>
              <input
                type="radio"
                name="style"
                value={opt.id}
                checked={style === opt.id}
                onChange={() => setStyle(opt.id)}
              />{' '}
              {opt.label}
            </label>
          ))}
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
            marginTop: 22,
            border: '1px solid #ddd'
          }}
        >
          {result}
        </pre>
      )}
    </div>
  );
}
