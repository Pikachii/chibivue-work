import { RendererOptions } from "../runtime-core/renderer";

/** ノード操作 */
export const nodeOps: Omit<RendererOptions, "patchProp"> = {
  /** 要素を作成する
   * @param tagName - タグ名
   * @returns 要素
   */
  createElement: tagName => {
    return document.createElement(tagName);
  },
  /** テキストを作成する
   * @param text - テキスト
   * @returns テキストノード
   */
  createText: text => {
    return document.createTextNode(text);
  },
  /** テキストを設定する
   * @param node - ノード
   * @param text - テキスト
   */
  setText(node, text) {
    node.nodeValue = text;
  },
  /** テキストを設定する
   * @param node - ノード
   * @param text - テキスト
   */
  setElementText(node, text) {
    node.textContent = text;
  },
  /** 子ノードを挿入する
   * @param child - 子ノード
   * @param parent - 親ノード
   * @param anchor - 挿入位置（手前に挿入する）
   */
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
}
