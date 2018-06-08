module.exports = {
  title: 'ブラウザー拡張（アドオン、エクステンション）の作り方',
  description: '各種ブラウザーに対応する拡張機能の作り方を、チュートリアル形式で紹介します。JavaScriptの練習にどうぞ。',
  base: '/how-to-create-browser-extensions/',
  themeConfig: {
    sidebar: [
      '/hello-world/',
      '/javascript/',
      '/simple-timer/',
      '/compatibility-and-polyfill/',
      {
        title: 'ブラウザーごと',
        collapsable: false,
        children: [
          ['/browsers/chrome/', 'Chrome'],
          ['/browsers/firefox/', 'Fierfox'],
          ['/browsers/edge/', 'Edge']
        ]
      },
      {
        title: 'お役立ち情報',
        collapsable: false,
        children: [
          '/useful-api/',
        ]
      }
    ]
  },
  markdown: {
    config: (md) => {
      md.use(require('markdown-it-container'), 'figure', {
        render (tokens, index) {
          // console.log('# index, tokens[index]', index, tokens[index])
          if (tokens[index].nesting === 1) {
            let html = '<figure>\n'
            const m = tokens[index].info.trim().match(/^figure\s+(.*)$/)
            if (m) {
              html += `<figcaption>${md.utils.escapeHtml(m[1])}</figcaption>\n`
            }
            return html
          } else {
            return '</figure>\n'
          }
        }
      })
    }
  }
}
