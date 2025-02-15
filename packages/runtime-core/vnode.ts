/** 仮想ノード */
export interface VNode {
  /** ノードのタイプ */
  type: string
  /** プロパティ */
  props: VNodeProps
  /** 子要素 */
  children: (VNode | string)[]
}

/** 仮想ノードプロパティ */
export interface VNodeProps {
  [key: string]: any
}