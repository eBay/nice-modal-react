# Nice Modal

[![Build Status](https://api.travis-ci.com/eBay/nice-modal-react.svg?branch=main)](https://app.travis-ci.com/github/eBay/nice-modal-react)
[![Coverage Status](https://img.shields.io/codecov/c/github/eBay/nice-modal-react/main.svg)](https://codecov.io/github/eBay/nice-modal-react)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

This is a small, zero dependency utility to manage modals of your React application. It allows you to manage modals just like managing pages with a router in React. It's not a React modal component but should be used with other UI libraries which provide modal components like Material UI, Ant.Design, Bootstrap React, etc.

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

Unfortunately, most examples of using modals just follow this practice, it causes such confusions when managing modals in React.

I believe you must once encountered with the scenario that originally you only needed to show a modal when click a button, then when requirements changed, you need to open the same modal from a different place. Then you have to refactor your code to re-consider where to declare the modal. The root cause of such annoying things is just because we have not understood the essential of a modal.

To resolve the problems, we need to re-think how we implement modals in React.

# Re-think the Modal Usage Pattern in React
According to the [wikipedia](https://en.wikipedia.org/wiki/Modal_window), a modal can be described as: 

> A window that prevents the user from interacting with your application until he closes the window.

From the definition we can get a conclusion: a modal is a global view that's not necessarily related with a specific context.

This is very similar with the page concept in a single page UI application. The visibility/ state of modals should be managed globally because, from the UI perspective, a modal could be showed above any page/componnet. The only difference between modal and page is: a modal allows you to not leave the current page to do some separate tasks.

For pages management, we already have router framework like React Router, it helps to navigate to a page by URL. Actually, you can think URL a global id for a page. So, similarly, what if you assign a uniq id to a modal then show/hide it by the id? This is just how we designed NiceModal though you can choose not using a uniq id. 

With NiceModal, you will be able to manage the modals in a gobally and unified way.

# Features
Basically, `nice-modal-react` manages state of all modals at a global place (React context by default, optionally Redux). And it provides APIs to show/hide/remove a modal from the page. Here's the list of key features:

* Be able to use with any UI library.
* Zero dependency and small: ~2kb after gzip.
* Modals are uncontrolled. That is, you can close itself in the modal component.
* The code of your modal component is not executed if it's invisible.
* It should not break the transitions of showing/hiding a modal.
* Promise based. Besides using props to interact with the modal from the parent component, you can do it easier by promise.

# Usage
### Installation

```basn
yarn add --dev @ebay/nice-modal-react

# or with npm
npm install @ebay/nice-modal-react --save-dev
```


### Embed your application with `NiceModal.Provider`:

```js
import NiceModal from '@ebay/nice-modal-react';
ReactDOM.render(
  <React.StrictMode>
    <NiceModal.Provider>
      <App />
    </NiceModal.Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
```

### Create your modal with NiceModal.create
NiceModal embeded supports for Material UI, Antd Design and Bootstrap React. For other UI libraries, you can map props your self.

```js
import { Modal } from 'antd';
import NiceModal, { useModal, antdModal } from '@ebay/nice-modal-react';

export default NiceModal.create(({ name }) => {
  const modal = useModal();
  return (
    <Modal title="Hello Antd" {...antdModal(modal)}>
      Greetings: {name}!
    </Modal>
  );
});
```

### Use the modal by id
You can control a nice modal by id or the component itself.
```js
import NiceModal from '@ebay/nice-modal-react';
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

### Use Modal Class without id
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
