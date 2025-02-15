import type { RendererOptions } from "../runtime-core"
import { patchAttr } from "./modules/attrs"
import { patchEvent } from "./modules/events"

/** DOMレンダラーのオプション */
type DOMRendererOptions = RendererOptions<Node, Element>

/** onから始まって3文字目が大文字である正規表現 */
const onRE = /^on[^a-z]/
/** イベントかどうかを判定する
 * @param key - キー
 * @returns onから始まってその直後が大文字かどうか
 */
export const isOn = (key: string) => onRE.test(key) // onのあとは大文字のみ受け付ける

/** プロパティをパッチする
 * @param el - 要素
 * @param key - キー
 * @param value - 値
 */
export const patchProp: DOMRendererOptions['patchProp'] = (el, key, value) => {
  if (isOn(key)) {
    // イベントの場合はイベントをパッチする
    patchEvent(el, key, value)
  } else {
    // それ以外の場合は属性をパッチする
    patchAttr(el, key, value)
  }
}