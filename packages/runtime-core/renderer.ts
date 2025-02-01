import { VNode } from "./vnode"

export type RootRenderFunction<HostElement = RendererElement> = (
  message: string,
  container: HostElement,
) => void

export interface RendererOptions<HostNode = RendererNode> {
  createElement(type: string): HostNode
  createText(text: string): HostNode
  setElementText(node: HostNode, text: string): void
  insert(child: HostNode, parent: HostNode, anchor?: HostNode | null): void
}

export interface RendererNode {
  [key: string]: any
}

export interface RendererElement extends RendererNode {}

export function createRenderer(options: RendererOptions) {
  const { 
    createElement: hostCreateElement,
    createText: hostCreateText,
    insert: hostInsert,
  } = options;

  function renderVNode(vnode: VNode | string) {
    if (typeof vnode === 'string') return hostCreateText(vnode);
    const el = hostCreateElement(vnode.type);

    for (const child of vnode.children) {
      const childEl = renderVNode(child);
      hostInsert(childEl, el);
    }

    return el;
  }

  const render: RootRenderFunction = (message, container) => {
    const el = renderVNode(message);
    hostInsert(el, container);
  }

  return { render };
}
