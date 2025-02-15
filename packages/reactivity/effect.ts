import { Dep, createDep } from './dep'

/** 依存関係とキーのマップ */
type KeyToDepMap = Map<any, Dep>  
/** ターゲットと依存関係のマップ */
const targetMap = new WeakMap<any, KeyToDepMap>()

/** 現在の副作用 */
export let activeEffect: ReactiveEffect | undefined

/** 副作用を表す */
export class ReactiveEffect<T = any> {
  /** 副作用を作成する
   * @param fn 副作用の関数
   */
  constructor(public fn: () => T) {}

  /** 副作用を実行する */
  run() {
    // ※ fnを実行する前のactiveEffectを保持しておいて、実行が終わった後元に戻します。
    // これをやらないと、どんどん上書きしてしまって、意図しない挙動をしてしまいます。（用が済んだら元に戻そう）
    let parent: ReactiveEffect | undefined = activeEffect
    activeEffect = this
    const res = this.fn()
    activeEffect = parent
    return res
  }
}

/** 依存関係を追加する
 * @param target ターゲット
 * @param key キー
 */
export function track(target: object, key: unknown) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }

  if (activeEffect) {
    dep.add(activeEffect)
  }
}

/** 依存関係をトリガーする
 * @param target ターゲット
 * @param key キー
 */
export function trigger(target: object, key?: unknown) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return;

  const dep = depsMap.get(key)

  if (dep) {
    const effects = [...dep]
    for (const effect of effects) {
      effect.run()
    }
  }
}