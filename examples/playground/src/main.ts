import { createApp, h, reactive } from "chibivue";

const app = createApp({
  setup() {
    /** ステート */
    const state = reactive({ count: 0 })      
    /** カウントアップ */
    const increment = () => {
      state.count++
    }

    /** レンダリング関数
     * @returns 仮想DOM
     */
    return function render() {
      return h('div', { id: 'my-app' }, [
        h('p', {}, [`count: ${state.count}`]),
        h('button', { onClick: increment }, ['increment']),
      ]);
    }
  }
})

app.mount('#app');
