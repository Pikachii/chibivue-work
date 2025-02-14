import { createApp, h } from "chibivue";

const app = createApp({
  setup() {
    return function render() {
      return h('div', { id: 'my-app' }, [
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
    }
  }
})

app.mount('#app');
