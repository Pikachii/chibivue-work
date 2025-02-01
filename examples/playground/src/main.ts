import { createApp, h } from "chibivue";

const app = createApp({
  render() {
    return h('div', {}, [
      h('p', {}, ['Hello World.']),
      h('button', {}, ['click me!']),
    ]);
  },
})

app.mount('#app');
