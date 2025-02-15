import { mutableHandlers } from './baseHandler'

/** オブジェクトをリアクティブにする
 * @param target - ターゲット
 * @returns リアクティブなオブジェクト
 */
export function reactive<T extends object>(target: T): T {
  const proxy = new Proxy(target, mutableHandlers)
  return proxy as T
}