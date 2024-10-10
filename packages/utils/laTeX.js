import katex from 'katex';

/**
 * LaTeX 转换为 html 字符串
 * @param {string} tex - 用‘$$‘和‘$’包括起来的 Tex 语句。如：勾股定理公式：$$a^2+b^2=c^2$
 * @return {string} - Tex替换为HTML字符串.  如：`勾股定理公式：<span class="katex">...</span>`
 */
export function laTeX2HtmlString(tex = '') {
  return tex
    ?.replace(/(?<=\$\$)(.*?)(?=\$)/g, (t) =>
      katex.renderToString(t, { output: 'html' })
    )
    .replaceAll(/\$/g, '');
}
