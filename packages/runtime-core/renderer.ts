import { ReactiveEffect } from "../reactivity"
import type { Component } from "./component"
import { normalizeVNode, Text, type VNode } from "./vnode"

/** ルート要素へのレンダリング関数
 * @param message - レンダリングするメッセージ
 * @param container - ルート要素
 * @template HostElement - ホスト要素
 */
export type RootRenderFunction<HostElement = RendererElement> = (
  vnode: Component,
  container: HostElement,
) => void

/** レンダラーオプション
 * @template HostNode - ホストノード
 * @template HostElement - ホスト要素
 */
export interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement
> {
  /** 要素を作成する
   * @param type - 要素のタイプ
   * @returns 要素
   */
  createElement(type: string): HostNode
  /** テキストを作成する
   * @param text - テキスト
   * @returns テキストノード
   */
  createText(text: string): HostNode
  /** テキストを設定する
   * @param node - ノード
   * @param text - テキスト
   */
  setText(node: HostNode, text: string): void
  /** テキストを設定する
   * @param node - ノード
   * @param text - テキスト
   */
  setElementText(node: HostNode, text: string): void
  /** 子ノードを挿入する
   * @param child - 子ノード
   * @param parent - 親ノード
   * @param anchor - 挿入位置
   */
  insert(child: HostNode, parent: HostNode, anchor?: HostNode | null): void
  /** プロパティをパッチする
   * @param el - 要素
   * @param key - キー
   * @param value - 値
   */
  patchProp(el: HostElement, key: string, value: any): void
}

/** レンダラーノード */
export interface RendererNode {
  [key: string]: any
}

/** レンダラーエレメント */
export interface RendererElement extends RendererNode {}

/** レンダラーを作成する
 * @param options - レンダラーオプション
 * @returns レンダラー
 */
export function createRenderer(options: RendererOptions) {
  const { 
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    insert: hostInsert,
  } = options;
  const processElement = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
  ) => {
    if (n1 == null) {
      mountElement(n2, container);
    } else {
      patchElement(n1, n2);
    }
  }

  const mountElement = (vnode: VNode, container: RendererElement) => {
    let el: RendererElement
    const { type, props } = vnode;
    el = vnode.el = hostCreateElement(type as string)

    mountChildren(vnode.children as VNode[], el) // TODO:

    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, props[key])
      }
    }

    hostInsert(el, container)
  }

  const mountChildren = (children: VNode[], container: RendererElement) => {
    for (let i = 0; i < children.length; i++) {
      const child = (children[i] = normalizeVNode(children[i]))
      patch(null, child, container)
    }
  }

  const patchElement = (n1: VNode, n2: VNode) => {
    const el = (n2.el = n1.el!)

    const props = n2.props;

    patchChildren(n1, n2, el)

    for (const key in props) {
      if (props[key] !== n1.props?.[key]) {
        hostPatchProp(el, key, props[key])
      }
    }
  }

  const patchChildren = (n1: VNode, n2: VNode, container: RendererElement) => {
    const c1 = n1.children as VNode[]
    const c2 = n2.children as VNode[]

    for (let i = 0; i < c2.length; i++) {
      const child = (c2[i] = normalizeVNode(c2[i]))
      patch(c1[i], child, container)
    }
  }

  const processText = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
  ) => {
    if (n1 == null) {
      hostInsert((n2.el = hostCreateText(n2.children as string)), container)
    } else {
      // patchの処理を追加
      const el = (n2.el = n1.el!)
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children as string)
      }
    }
  }

  const patch = (n1: VNode | null, n2: VNode, container: RendererElement) => {
    const { type } = n2;
    if (type === Text) {
      processText(n1, n2, container);
    } else {
      processElement(n1, n2, container);
    }
  }

  /** ルート要素へのレンダリング関数
   * @param message - レンダリングするメッセージ
   * @param container - ルート要素
   * @returns レンダリングしたノード
   */
  const render: RootRenderFunction = (rootComponent, container) => {
    const componentRender = rootComponent.setup!()

    let n1: VNode | null = null

    const updateComponent = () => {
      const n2 = componentRender()
      patch(n1, n2, container)
      n1 = n2
    }

    const effect = new ReactiveEffect(updateComponent)
    effect.run()
  }

  return { render };
}
