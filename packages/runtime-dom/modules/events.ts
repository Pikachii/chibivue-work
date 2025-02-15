/** インボーカー */
interface Invoker extends EventListener {
  /** 値 */
  value: EventValue
}

/** イベント関数 */
type EventValue = Function

/** イベントリスナーを追加する
 * @param el - 要素
 * @param event - イベント名
 * @param handler - イベントハンドラ
 */
export function addEventListener(
  el: Element,
  event: string,
  handler: EventListener,
) {
  el.addEventListener(event, handler)
}

/** イベントリスナーを削除する
 * @param el - 要素
 * @param event - イベント名
 * @param handler - イベントハンドラ
 */
export function removeEventListener(
  el: Element,
  event: string,
  handler: EventListener,
) {
  el.removeEventListener(event, handler)
}

/** イベントをパッチする
 * @param el - 要素
 * @param rawName - オリジナルのイベント名
 * @param value - イベント関数
 */
export function patchEvent(
  el: Element & { _vei?: Record<string, Invoker | undefined> },
  rawName: string,
  value: EventValue | null,
) {
  // vei = vue event invokers
  // invokers = ei._vei = {}
  /** インボーカー */
  const invokers = el._vei || (el._vei = {})
  /** 既存のインボーカー */
  const existingInvoker = invokers[rawName]

  if (value && existingInvoker) {
    // 既存のインボーカーがある場合は値を更新する
    existingInvoker.value = value
  } else {
    /** イベント名（DOM登録用に置換されたもの） */
    const name = parseName(rawName)
    if (value) {
      // イベントリスナーがある場合は追加する
      const invoker = (invokers[rawName] = createInvoker(value))
      addEventListener(el, name, invoker)
    } else if (existingInvoker) {
      // イベントリスナーがない場合は削除する
      removeEventListener(el, name, existingInvoker)
      invokers[rawName] = undefined
    }
  }
}

/** イベント名を置換する
 * @param rawName - オリジナルのイベント名
 * @returns イベント名
 */
function parseName(rawName: string): string {
  // イベント名はonから始まるので、3文字目以降を取得して小文字にして返す
  return rawName.slice(2).toLocaleLowerCase()
}

/** インボーカーを作成する
 * @param initialValue - 初期のイベント関数
 * @returns インボーカー
 */
function createInvoker(initialValue: EventValue) {
  /** インボーカー
   * @param e - イベント
   * @returns イベントハンドラ
   */
  const invoker: Invoker = (e: Event) => {
    // イベント関数を実行する
    invoker.value(e)
  }
  invoker.value = initialValue
  return invoker
}
