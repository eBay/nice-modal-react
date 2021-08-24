# Nice Modal

nice-modal is a new aproach to manage modals in React applications. It can be used with any UI libraries like ant.design, material UI, bootstrap React, etc.

# Motivation
Using modals in React is a bit frustrating. Think about that if you need to implement below UI:

<img src="images/modal-example.png" width="500px"/>

The first question in your mind may be where to declare the modal via JSX? As a modal can be showed in any page, it doesn't belong to any page component. So the most reasonable place is the app root, for example:

```jsx
const App = () => {
  const [visible, setVisible] = useState(false);
  // other logic ...
  return (
    <Root>
      <Main />
      <AdModal visible={visible} />
    </Root>
  );
}
```

However, when you declare the modal in the root component, there are some confusions:
1. It's not reasonable to maintain the modal's state in the root component. It's not scalable. When you need more modals you need to maintain much state, especially you need to maintain arguments for the modal.
2. It's hard to show or hide the modal from children comopnonents. You need to pass `setVisible` down to the place where you need to show or hide the modal. It makes things too complicated.

To resolve the problem, we need to rethink how we implement modals in React.

# Rethink Modal Pattern in React
From the wikipedia, a modal is described as: A window that prevents the user from interacting with your application until he closes the window.

We can get the concolusion: while the UI part of a modal is global, the state part in React should also be global, so that we can change the modal state at any place. Not restricted under any component scope.

Actually, a modal is very similar with a page in a single page application. The only difference is a modal allows you to not leave the current context to do some separate actions. Since every page has a globally uniq URL to allow easy navigation between pages, every modal can also have uniq id so that we can show/hide a modal from anywhere. This is just why NiceModal is created.

# Usage
### 1.install nice-modal with:

```
yarn add --dev @ebay/nice-modal
```

### 2. Embed your application with `NiceModal.Provider`:

```js
import NiceModal from '@ebay/nice-modal';
ReactDOM.render(
  <React.StrictMode>
    <NiceModal.Provider>
      <App />
    </NiceModal.Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
```

### 3. Create your modal with NiceModal.create
NiceModal embeded supports for Material UI, Antd Design and Bootstrap React. For other UI libraries, you can map props your self.

```js
import { Modal } from 'antd';
import NiceModal, { useModal, antdModal } from '@ebay/nice-modal';

export default NiceModal.create(({ name }) => {
  const modal = useModal();
  return (
    <Modal title="Hello Antd" {...antdModal(modal)}>
      Greetings: {name}!
    </Modal>
  );
});
```

### 4. Use the modal by id
You can control a nice modal by id or the component itself.
```js
import NiceModal from '@ebay/nice-modal';
import MyAntdModal from './my-antd-modal';

// If use by id, need to register the modal component.
// Normally you create a modals.js file in your project and register all modals there.
NiceModal.register('my-antd-modal', MyAntdModal);

function App() {
  const antdModal = useModal('my-antd-modal');
  const showAntdModal = () => {
    antdModal
      .show({ name: 'Nate' }) // pass props to your modal component
      .then((res) => {
        console.log('modal is closed', res);
      })
      .catch((err) => {
        console.log('modal is rejected: ', err);
      });
  };
  return (
    <div className="app">
      <h1>Nice Modal Examples</h1>
      <div className="demo-buttons">
        <button onClick={showAntdModal}>Antd Modal</button>
      </div>
    </div>
  );
}
```

### 5 Use Modal Class without id
If you don't want to use a string to show/hide a modal, you can use the class directly.
```jsx
//...
const antdModal = useModal(MyAntdModal);
//...

```

### Use with a UI library
### API Reference

# License
MIT
