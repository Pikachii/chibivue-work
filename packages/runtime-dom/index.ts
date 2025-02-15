import {
  CreateAppFunction,
  createAppAPI,
  createRenderer,
} from '../runtime-core';
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";

const { render } = createRenderer({ ...nodeOps, patchProp });
  
/** アプリケーションを作成するAPI（DOMでレンダリングする） */
const _createApp = createAppAPI(render);

/** アプリケーションを作成する
 * @param args - アプリケーションの設定
 * @returns アプリケーション
 */
export const createApp = ((...args) => {
  // アプリケーションを作成
  const app = _createApp(...args);  
  const { mount } = app;

  // アプリケーションのマウント処理を上書き
  app.mount = (selector: string) => {
    // 指定のセレクタにマッチする要素を取得
    const container = document.querySelector(selector);
    if (!container) return;
    // アプリケーションのマウント処理を指定のコンテナに行う
    mount(container);
  }

  return app
}) as CreateAppFunction<Element>;