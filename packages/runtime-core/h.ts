import { createVNode, VNode, VNodeProps } from "./vnode";

/** ハイパーテキスト関数
 * @param type - タイプ
 * @param props - プロパティ
 * @param children - 子要素
 * @returns 仮想ノード
 */
export function h(
  type: string,
  props: VNodeProps,
  children: (string | VNode)[]
) {
  return createVNode(type, props, children);
}