import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitepress';
export default defineConfig({
  // 站点级选项
  title: 'Vue Components',
  description: 'ElementUI 组件二次开发',
  srcDir: './src',
  // srcDir: '../packages/components',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    // 主题级选项
    siteTitle: 'VueComponents',
    sidebar: [
      {
        text: '功能组件',
        items: [
          { text: 'QueryForm', link: '/QueryForm' },
          { text: 'DataTable', link: '/DataTable' },
          { text: 'TreeTable', link: '/TreeTable' },
          { text: 'FormDialog', link: '/FormDialog' },
          { text: 'CRUDPage', link: '/CRUDPage' },
          { text: 'ScrollTable', link: '/ScrollTable' },
          { text: 'ImageSlideDialog', link: '/ImageSlideDialog' },
          { text: 'Bar3DChart', link: '/Bar3DChart' },
          { text: 'MultiXYChart', link: '/MultiXYChart' }
        ]
      }
    ],
    search: {
      provider: 'local'
    },
    outline: [2, 6],
    docFooter: {
      prev: false,
      next: false
    },
    lastUpdated: {
      text: '最后更新于: '
    }
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../examples/src', import.meta.url)),
        '~': fileURLToPath(new URL('../../packages', import.meta.url)),
        '#': fileURLToPath(new URL('../../packages/utils', import.meta.url)),
        lib: fileURLToPath(new URL('../../lib', import.meta.url))
      }
    }
  },
  markdown: {
    lineNumbers: true
  }
});
