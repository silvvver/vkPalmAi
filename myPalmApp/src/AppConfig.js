// myPalmApp/src/AppConfig.js
import vkBridge, {
  parseURLSearchParamsForGetLaunchParams,
  useAppearance,
  useAdaptivity,
  useInsets,
} from '@vkontakte/vk-bridge-react';
import { AdaptivityProvider, ConfigProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import { transformVKBridgeAdaptivity } from './utils/transformVKBridgeAdaptivity';
import App from './App';

export const AppConfig = () => {
  // получаем настройки внешнего вида и отступы от VK Bridge
  const vkBridgeAppearance = useAppearance() || undefined;
  const vkBridgeInsets = useInsets() || undefined;

  // адаптивность (sizeX/sizeY) из VK Bridge
  const adaptivity = transformVKBridgeAdaptivity(useAdaptivity());

  // платформа из launchParams (desktop_web → vkcom)
  const { vk_platform } = parseURLSearchParamsForGetLaunchParams(window.location.search);

  return (
    <ConfigProvider
      colorScheme={vkBridgeAppearance}
      platform={vk_platform === 'desktop_web' ? 'vkcom' : undefined}
      isWebView={vkBridge.isWebView()}
      hasCustomPanelHeaderAfter
    >
      <AdaptivityProvider {...adaptivity}>
        <AppRoot mode="full" safeAreaInsets={vkBridgeInsets}>
          <App />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};
