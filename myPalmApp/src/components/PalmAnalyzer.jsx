// myPalmApp/src/components/PalmAnalyzer.jsx
-import React, { useState } from 'react';
-
-// вверху PalmAnalyzer.jsx
-const API_ROOT = import.meta.env.VITE_API_BASE || ''
+import React, { useState } from 'react';

export default function PalmAnalyzer() {
  const [file, setFile]     = useState(null);
  const [style, setStyle]   = useState('ted');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

-  // Если сборка production -- берём адрес из .env.production,
-  // иначе оставляем пустую строку (локальный proxy `/analyze`)
-  const API_ROOT =
-    import.meta.env.PROD
-      ? 'https://vk-palm-ai-backend.onrender.com'      // PROD-бэк
-      : '';
+  // В prod берём из .env.production (VITE_API_BASE), в dev — пустую строку для proxy из vite.config.js
+  const API_ROOT = import.meta.env.PROD
+    ? import.meta.env.VITE_API_BASE
+    : '';

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
      // ...
