import { VNode } from "./vnode"

/** ルート要素へのレンダリング関数
 * @param message - レンダリングするメッセージ
 * @param container - ルート要素
 * @template HostElement - ホスト要素
 */
export type RootRenderFunction<HostElement = RendererElement> = (
  message: string,
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
    insert: hostInsert,
  } = options;

  /** 仮想ノードをレンダリングする
   * @param vnode - 仮想ノード or テキスト
   * @returns レンダリングしたノード
   */
  function renderVNode(vnode: VNode | string) {
    // テキストの場合はテキストノードを作成して返す
    if (typeof vnode === 'string') return hostCreateText(vnode);

    // それ以外の場合は要素を作成して返す
    const el = hostCreateElement(vnode.type);

    // プロパティをパッチする
    Object.entries(vnode.props).forEach(([key, value]) => {
      hostPatchProp(el, key, value);
    });

    // 子要素をレンダリングする
    for (const child of vnode.children) {
      const childEl = renderVNode(child);
      hostInsert(childEl, el);
    }

    return el;
  }

  /** ルート要素へのレンダリング関数
   * @param message - レンダリングするメッセージ
   * @param container - ルート要素
   * @returns レンダリングしたノード
   */
  const render: RootRenderFunction = (message, container) => {
    // ※ 全消し処理を追加
    while (container.firstChild) container.removeChild(container.firstChild)

    // メッセージをレンダリングする
    const el = renderVNode(message);
    hostInsert(el, container);
  }

  return { render };
}
