// myPalmApp/src/App.jsx
import React, { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  View,
  Panel,
  PanelHeader
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import PalmAnalyzer from './components/PalmAnalyzer';

function App() {
  const [user, setUser] = useState(null);

  // При старте получаем данные юзера (нужно для VK Mini App)
  useEffect(() => {
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === 'VKWebAppGetUserInfoResult') {
        setUser(data);
      }
    });
    bridge.send('VKWebAppGetUserInfo');
  }, []);

  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <View activePanel="palm">
            <Panel id="palm">
              <PanelHeader>
                🔮 Онлайн-хиромант
              </PanelHeader>
              {/* наш компонент вместо спиннера */}
              <PalmAnalyzer />
            </Panel>
          </View>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}

export default App;
