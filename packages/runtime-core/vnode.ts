/** テキストノードを表すシンボル */
export const Text = Symbol();

/** 仮想ノードのタイプ */
export type VNodeTypes = string | typeof Text;

/** 仮想ノード */
export interface VNode<HostNode = any> {
  /** ノードのタイプ */
  type: VNodeTypes
  /** プロパティ */
  props: VNodeProps | null
  /** 子要素 */
  children: VNodeNormalizedChildren
  /** 対応するホストノード */
  el: HostNode | undefined
}

/** 仮想ノードプロパティ */
export interface VNodeProps {
  [key: string]: any
}

// normalize後の型
/** 正規化された仮想ノードの子要素 */
export type VNodeNormalizedChildren = string | VNodeArrayChildren;
/** 配列形式の仮想ノードの子要素 */
export type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>;
/** 仮想ノードの子要素 */
export type VNodeChild = VNodeChildAtom | VNodeArrayChildren;
/** 仮想ノードの子要素の原子型 */
type VNodeChildAtom = VNode | string;

/** 仮想ノードを作成する
 * @param type ノードタイプ
 * @param props ノードのプロパティ
 * @param children ノードの子要素
 * 
 * @returns 作成された仮想ノード
 */
export function createVNode(
  type: VNodeTypes,
  props: VNodeProps | null,
  children: VNodeNormalizedChildren,
): VNode {
  const vnode: VNode = { type, props, children: children, el: undefined }
  return vnode;
}

// normalize 関数を実装。(renderer.tsで使う)
/** 仮想ノードを正規化する
 * @param child 正規化する仮想ノードの子要素
 * @returns 正規化された仮想ノード
 */
export function normalizeVNode(child: VNodeChild): VNode {
  if (typeof child === 'object') {
    return { ...child } as VNode;
  } else {
    // stringだった場合に先ほど紹介した扱いたい形に変換する
    return createVNode(Text, null, String(child));
  }
}