import { VNode } from "./vnode"

export type RootRenderFunction<HostElement = RendererElement> = (
  message: string,
  container: HostElement,
) => void

export interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement
> {
  createElement(type: string): HostNode
  createText(text: string): HostNode
  setElementText(node: HostNode, text: string): void
  insert(child: HostNode, parent: HostNode, anchor?: HostNode | null): void
  patchProp(el: HostElement, key: string, value: any): void
}

export interface RendererNode {
  [key: string]: any
}

export interface RendererElement extends RendererNode {}

export function createRenderer(options: RendererOptions) {
  const { 
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    insert: hostInsert,
  } = options;

  function renderVNode(vnode: VNode | string) {
    if (typeof vnode === 'string') return hostCreateText(vnode);
    const el = hostCreateElement(vnode.type);

    Object.entries(vnode.props).forEach(([key, value]) => {
      hostPatchProp(el, key, value);
    });

    for (const child of vnode.children) {
      const childEl = renderVNode(child);
      hostInsert(childEl, el);
    }

    return el;
  }

  const render: RootRenderFunction = (message, container) => {
    while (container.firstChild) container.removeChild(container.firstChild) // 全消し処理を追加
    const el = renderVNode(message);
    hostInsert(el, container);
  }

  return { render };
}
