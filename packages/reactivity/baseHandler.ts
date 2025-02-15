import { track, trigger } from './effect'
import { reactive } from './reactive'

/** ミュータブルハンドラ */
export const mutableHandlers: ProxyHandler<object> = {
  get(target: object, key: string | symbol, receiver: object) {
    // 依存関係を追加する
    track(target, key)

    /** キーに対応する値 */
    const res = Reflect.get(target, key, receiver)
    // objectの場合はreactiveにしてあげる（これにより、ネストしたオブジェクトもリアクティブにすることができます。）
    if (res != null && typeof res === 'object') {
      return reactive(res)
    }

    return res
  },

  set(target: object, key: string | symbol, value: unknown, receiver: object) {
    /** 変更前の値 */
    // なんで let なんだろう？
    let oldValue = (target as any)[key]
    // 値をセットする
    Reflect.set(target, key, value, receiver)
    // 値が変わったかどうかをチェックしてあげておく
    if (hasChanged(value, oldValue)) {
      // 依存関係をトリガーする
      trigger(target, key)
    }
    return true
  },
}

/** 値が変わったかどうかをチェックする
 * @param value - 値
 * @param oldValue - 変更前の値
 * @returns 値が変わったかどうか
 */
const hasChanged = (value: any, oldValue: any): boolean => 
  !Object.is(value, oldValue)