# Nice Modal

[![Build Status](https://api.travis-ci.com/eBay/nice-modal-react.svg?branch=main)](https://app.travis-ci.com/github/eBay/nice-modal-react)
[![Coverage Status](https://img.shields.io/codecov/c/github/eBay/nice-modal-react/main.svg)](https://codecov.io/github/eBay/nice-modal-react)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

This is a small, zero dependency utility to manage modals of your React application. It can be used with any UI libraries like Material UI, Ant.Design, Bootstrap React, etc.

# Motivation
Using modals in React is a bit frustrating. Think of that if you need to implement below UI:

<img src="images/modal-example.png" width="500px"/>

Usually, the first question in your mind is where to declare the modal via JSX. As the dialog in the picture may be showed in any page, it doesn't belong to any page component. So you probally put it in the Root component, for example:

```jsx
const Root = () => {
  const [visible, setVisible] = useState(false);
  // other logic ...
  return (
    <>
      <Main />
      <AdsModal visible={visible} />
    </>
  );
}
```

However, when you declare the modal in the root component, there are some issues:

1. Not scalable. It's unreasonable to maintain the modal's state in the root component. When you need more modals you need to maintain much state, especially you need to maintain arguments for the modal.
2. It's hard to show or hide the modal from children comopnonents. When you maintain the state in a component then you need to pass `setVisible` down to the place where you need to show or hide the modal. It makes things too complicated.

Unfortunately, most examples of using modals just follow this practice, it causes such confusions when managing modals in React. To resolve the problems, we need to re-think how we implement modals in React.

# Re-think the Modal Usage Pattern in React
From the wikipedia, a modal is described as: 

> A window that prevents the user from interacting with your application until he closes the window.

We can get the concolusion: while the UI part of a modal is global, the state part in React should also be global. A modal's state, both view state and data state, should be not tied to a specific component. That's because from the UI perspective, a modal could be show on top of any page/componnet.

I believe you must once encountered with the scenario that originally you only needed to show a modal when click a button, then when requirements changed, you need to open the same modal from a different place. Then you have to refactor your code to re-consider where to declare the modal. The root cause of such annoying things is just because we have not understood the essential of a modal.

Actually, a modal is very similar with a page in a single page application. The only difference is: a modal allows you to not leave the current context to do some separate tasks. For pages, we have router framework to manage them by URLs now. But for modals, there's not a global manager to show or hide a modal.

So, that's just why this small utility is created. You will be able to manage the modals in a gobally and unified way.

# How we do it?
Basically, `nice-modal-react` manages all state of modals in a global place (React context by default). And it provides APIs to show/hide/remove a modal from the page. Some considerations are list below:

* Modals are uncontrolled. That is, you can close modal itself in the modal component.
* The code of your modal component is not executed if it's invisible.
* It should not break the transitions of showing/hiding a modal.
* Promise based. Besides using props to interact with the modal from the parent component, you can do it easier by promise.

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
