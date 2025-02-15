/** コンポーネントオプション */
export type ComponentOptions = {
  /** レンダリング関数 */
  render?: Function;
  /** セットアップ関数
   * @returns レンダリング関数
   */
  setup?: () => Function;
}