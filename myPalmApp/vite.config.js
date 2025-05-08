// myPalmApp/vite.config.js
import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

// 1. Наш плагин — вставит полифилл прямо после <div id="root"></div>
function polyfillCreateShadowRoot() {
  return {
    name: 'polyfill-createShadowRoot',
    enforce: 'pre',
    transformIndexHtml(html) {
      return html.replace(
        /(<div id="root"><\/div>)/,
        `$1
  <!-- Polyfill для устаревшего createShadowRoot -->
  <script>
    if (!Element.prototype.createShadowRoot && Element.prototype.attachShadow) {
      Element.prototype.createShadowRoot = function () {
        return this.attachShadow({ mode: 'open' });
      };
    }
  </script>`
      );
    }
  };
}

// 2. Остальные твои плагины
function handleModuleDirectivesPlugin() {
  return {
    name: 'handle-module-directives-plugin',
    transform(code, id) {
      if (id.includes('@vkontakte/icons')) {
        return { code: code.replace(/"use-client";?/g, '') };
      }
      return null;
    },
  };
}

function treatJsFilesAsJsx() {
  return {
    name: 'treat-js-files-as-jsx',
    async transform(code, id) {
      if (!id.match(/src\/.*\.js$/)) return null;
      return transformWithEsbuild(code, id, {
        loader: 'jsx',
        jsx: 'automatic',
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [
    polyfillCreateShadowRoot(),   // ← обязательно первым
    react(),
    treatJsFilesAsJsx(),
    handleModuleDirectivesPlugin(),
    legacy({ targets: ['defaults', 'not IE 11'] }),
  ],

  server: {
    proxy: {
      '/analyze': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },

  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },

  build: {
    outDir: 'build',
  },
});
