/* eslint-disable prefer-regex-literals */
/**
 * Some regular expressions
 */
// */10 or */10,20
const crontabComboRe = new RegExp(/\*\/[0-9,]+/);
// 10,20
const crontabNumAndCommaOnlyRe = new RegExp(/^[0-9,]+$/);
// 10
const crontabNumOnlyRe = new RegExp(/^[0-9]+$/);
// *
const crontabWildcardOnlyRe = new RegExp(/^\*$/);

export { crontabComboRe, crontabNumAndCommaOnlyRe, crontabNumOnlyRe, crontabWildcardOnlyRe };
