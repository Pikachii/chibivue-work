/** 属性を設定する
 * @param el - 要素
 * @param key - キー
 * @param value - 値
 */
export function patchAttr(
  el: Element,
  key: string,
  value: any,
) {
  if (value == null) {
    // null, undefinedの場合は属性を削除する
    el.removeAttribute(key)
  } else {
    // それ以外の場合は属性をセットする
    el.setAttribute(key, value)
  }
}