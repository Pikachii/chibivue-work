import { Component } from './component';
import { RootRenderFunction } from './renderer';
import { ReactiveEffect } from '../reactivity';

/** アプリケーション
 * @template HostElement - ホスト要素
 */
export interface App<HostElement = any> {
  /** ルートコンテナにアプリケーションをマウントする
   * @param rootContainer - ルートコンテナ
   */
  mount(rootContainer: HostElement | string): void
}

/** アプリケーションを作成する関数
 * @template HostElement - ホスト要素
 * @param rootComponent - ルートコンポーネント
 * @returns アプリケーション
 */
export type CreateAppFunction<HostElement> = (
  rootComponent: Component,
) => App<HostElement>

/** アプリケーションを作成するAPI
 * @template HostElement - ホスト要素
 * @param render - レンダリング関数
 * @returns アプリケーションを作成する関数
 */
export function createAppAPI<HostElement>(
  render: RootRenderFunction<HostElement>,
): CreateAppFunction<HostElement> {
  // アプリケーションを作成する関数
  return function createApp(rootComponent) {
    /** アプリケーション */
    const app: App = {
      /** ルートコンテナにアプリケーションをマウントする
       * @param rootContainer - ルートコンテナ
       */
      mount(rootContainer: HostElement) {
        /** セットアップ関数で取得したレンダリング関数 */
        const componentRender = rootComponent.setup!();

        /** コンポーネントを更新する */
        const updateComponent = () => {
          /** レンダリングした仮想DOM */
          const vNode = componentRender()
          // ルートコンテナにアプリケーションをマウントする
          render(vNode, rootContainer)
        }

        /** コンポーネントを更新する副作用 */
        const effect = new ReactiveEffect(updateComponent)          
        // コンポーネントを更新する副作用を実行する
        effect.run()
      }
    }

    return app
  }
}