import React from 'react';
import { createRoot } from 'react-dom/client';
import vkBridge from '@vkontakte/vk-bridge';
import { ConfigProvider, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { AppConfig } from './AppConfig';

// 1. Рукопожатие с VK Shell и логирование результата
vkBridge.send('VKWebAppInit')
  .then(() => console.log('VKWebAppInit → success'))
  .catch(err => console.error('VKWebAppInit failed', err));

// 2. Рендер приложения с VKUI-обёртками
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ConfigProvider>
    <AdaptivityProvider>
      <AppRoot>
        <AppConfig />
      </AppRoot>
    </AdaptivityProvider>
  </ConfigProvider>
);

// 3. В режиме разработки — подключаем Eruda для удобной дебаг-консоли
if (import.meta.env.MODE === 'development') {
  import('./eruda.js');
}
