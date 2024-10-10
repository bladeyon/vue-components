import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import commonjs from 'vite-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'lib',
    lib: {
      entry: 'packages/index.js',
      name: 'vue2components',
      formats: ['es', 'umd'],
      fileName: (format) => `vue2components.${format}.js`
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        'vue',
        // 'element-ui', // 如果排除掉，会出现打包压缩后找不到css文件的问题，因为压缩替换为别名的原因
        'katex',
        'lodash',
        'vue-seamless-scroll'
      ],
      output: {
        globals: {
          vue: 'Vue',
          // 'element-ui': 'ElementUI',
          katex: 'katex',
          lodash: 'lodash',
          'vue-seamless-scroll': 'VueSeamlessScroll'
        },
        exports: 'named'
      }
    }
  },

  plugins: [createVuePlugin(), commonjs()],
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': fileURLToPath(new URL('./examples/src', import.meta.url)),
      '~': fileURLToPath(new URL('./packages', import.meta.url)),
      '#': fileURLToPath(new URL('./packages/utils', import.meta.url)),
      lib: fileURLToPath(new URL('./lib', import.meta.url))
    }
  }
});
