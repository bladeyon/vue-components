/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['plugin:vue/recommended', 'eslint:recommended'],
  rules: {
    // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
    // always-multiline：多行模式必须带逗号，单行模式不能带逗号
    // 'comma-dangle': [2, 'never'],
    // 控制逗号前后的空格
    // 'comma-spacing': [
    //   2,
    //   {
    //     before: false,
    //     after: true
    //   }
    // ],
    'no-unused-vars': 0,
    quotes: [
      1,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ], //引号类型 `` "" ''
    semi: [2, 'always'] //语句强制分号结尾
  }
};
