import { createApp, h } from "chibivue";

const app = createApp({
  render() {
    return h('div', {}, [
      h('p', { style: 'color: red; font-weight: bold;' }, ['Hello World.']),
      h(
        'button',
        {
          onClick() {
            alert('Hello world!')
          },
        },
        ['click me!']
      ),
    ]);
  },
})

app.mount('#app');
