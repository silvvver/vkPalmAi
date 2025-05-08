import React from 'react';
import { createRoot } from 'react-dom/client';
import vkBridge from '@vkontakte/vk-bridge';
import { ConfigProvider, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { AppConfig } from './AppConfig';

// Рукопожатие с VK Shell
vkBridge.send('VKWebAppInit')
  .then(() => console.log('VKWebAppInit → success'))
  .catch(err => console.error('VKWebAppInit failed', err));

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

// В режиме разработки — включаем консоль eruda
if (import.meta.env.MODE === 'development') {
  import('./eruda.js');
}
