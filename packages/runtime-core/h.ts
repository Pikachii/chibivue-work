import { VNode, VNodeProps } from "./vnode";

export function h(
  type: string,
  props: VNodeProps,
  children: (string | VNode)[]
) {
  return { type, props: props || {}, children: Array.isArray(children) ? children : [children] }
}