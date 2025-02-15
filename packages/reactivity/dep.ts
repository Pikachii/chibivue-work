import { type ReactiveEffect } from './effect'

/** 依存関係 */
export type Dep = Set<ReactiveEffect>

/** Depを作成する
 * @param effects - 副作用
 * @returns Dep
 */
export const createDep = (effects?: ReactiveEffect[]): Dep => {
  const dep: Dep = new Set<ReactiveEffect>(effects)
  return dep
}
