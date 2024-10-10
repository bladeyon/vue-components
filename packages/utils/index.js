import { merge, sortedLastIndexBy } from 'lodash';

/**
 * 查找节点
 */
export function findTreeNode(value, data, prop = 'id', children = 'children') {
  for (let i = 0; i < data.length; i++) {
    if (data[i][prop] === value) {
      return data[i];
    }

    if (data[i][children] && data[i][children].length > 0) {
      const result = findTreeNode(value, data[i][children], prop, children);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

/**
 * 生成随机len位数字
 */
export const randomLenNum = (len = 8, date) => {
  let random = '';
  random = Math.random()
    .toString(16)
    .slice(2, len + 2 <= 13 ? len + 2 : 13);
  if (date) random = random + Date.now();
  return random;
};

// 驼峰转换
const camelCase = function (name) {
  return name.replace(
    /([\:\-\_]+(.))/g,
    function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    }
  );
};

// 获取元素样式某属性的值
export const getStyle = function (element, styleName) {
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'cssFloat';
  }
  try {
    const computed = document.defaultView.getComputedStyle(element, '');
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    return element.style[styleName];
  }
};

// 合并表格列配置
export function mergeColConfig(cols, colsConfig) {
  const sortedCols = [],
    rules = {};
  let idx = 0;
  while (idx < cols.length) {
    const col = cols[idx];
    const { field } = col;
    const config = colsConfig[field] ?? {};

    if (config.isShow === 0) {
      cols.splice(idx, 1);
      continue;
    }
    col.label = config.label ?? col.label;
    col.weight = config.weight || col.weight;
    col.minWidth = config.minWidth || col.minWidth;
    col.align = config.align || col.align;
    col.sort = config.sort || col.sort;
    col.operateBtns = config.operateBtns || col.operateBtns;
    col.formatter = config.formatter || col.formatter;
    col.width = config.width || col.width;
    col.fixed = col.field === 'operator-col' ? 'right' : config.fixed ?? false;
    col.canEdit = config.canEdit ?? col.canEdit;
    col.component = config.component ?? col.component;
    col.componentProps = Object.assign(
      {},
      col.componentProps,
      config?.componentProps
    );

    if (config.isRequired && col.canEdit !== false) {
      rules[field] = true;
    } else {
      // 删除已配置的校验
      delete rules[field];
    }

    if (col.children) {
      const [childrenCols, childrenRules] = mergeColConfig(
        col.children,
        colsConfig
      );
      col.children = childrenCols;
      merge(rules, childrenRules);
    }

    // 排序
    const pos = sortedLastIndexBy(sortedCols, col, 'weight');
    sortedCols.splice(pos, 0, col);
    idx++;
  }
  return [sortedCols, rules];
}

export function generateColumns(cols, colsConfig) {
  if (Object.keys(colsConfig).length) {
    // 配置中增加了字段，需要处理
    const defaultColFields = cols.map((item) => item.field);
    const configColFields = Object.keys(colsConfig);
    for (const cfg of configColFields) {
      if (!defaultColFields.includes(cfg)) {
        // 直接 push 占位，后面在mergeColConfig合并
        const { label, field } = colsConfig[cfg];
        cols.push({ label, field });
      }
    }
  }
  return mergeColConfig(cols, colsConfig);
}
