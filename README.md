# Nice Modal

[![NPM](https://img.shields.io/npm/v/@ebay/nice-modal-react.svg)](https://www.npmjs.com/package/@ebay/nice-modal-react)
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

For pages management, we already have router framework like React Router, it helps to navigate to a page by URL. Actually, you can think URL a global id for a page. So, similarly, what if you assign a uniq id to a modal then show/hide it by the id? This is just how we designed NiceModal.

With NiceModal, you will be able to manage the modals in a gobal and unified way.

# Features
Basically, `nice-modal-react` manages state of all modals at a global place (React context by default, optionally Redux). And it provides APIs to show/hide/remove a modal from the page. Here's the list of key features:

* Be able to use with any UI library.
* Zero dependency and small: ~2kb after gzip.
* Modals are uncontrolled. That is, you can close itself in the modal component.
* The code of your modal component is not executed if it's invisible.
* It should not break the transitions of showing/hiding a modal.
* Promise based. Besides using props to interact with the modal from the parent component, you can do it easier by promise.

# Usage
## Installation

```bash
# with yarn
yarn add --dev @ebay/nice-modal-react

# or with npm
npm install @ebay/nice-modal-react --save-dev
```

## Create Your Modal Component
With NiceModal you can create a separate modal component easily. It's just the same as you create a normal component but wrap it with high order compponent by `NiceModal.create`. For example, below code shows how to create a dialog with [Ant.Design](https://ant.design):

```jsx
import { Modal } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

export default NiceModal.create(({ name }) => {
  const modal = useModal();
  return (
    <Modal
      title="Hello Antd"
      onOk={() => modal.hide()}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
    >
      Hello ${name}!
    </Modal>
  );
});
```

From the code, we can see:
* The modal is uncontrolled. You can hide your modal inside the component regardless where it is showed.
* The high order component created by `NiceModa.create` ensures your component is not executed before it becomes visible.
* You can call `modal.remove` to remove your modal component from the React component tree to reserve transitions.

Next, let's see how to use the modal.

## Using You Modal Component
There are very flexible APIs for you to manage modals. See below for the introduction.

### Embed your application with `NiceModal.Provider`:
Since we will manage status of modals globally, the first thing is embedding your app with NiceModal provider, for example:

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

The provider will use React context to maintain all modals' status.

### Use the modal by id
You can control a nice modal by id or the component itself.
```js
import NiceModal from '@ebay/nice-modal-react';
import MyAntdModal from './my-antd-modal'; // created by above code

// If use by id, need to register the modal component.
// Normally you create a modals.js file in your project
// and register all modals there.
NiceModal.register('my-antd-modal', MyAntdModal);
function App() {
  const showAntdModal = () => {
    // Show a modal with arguments passed to the component as props
    NiceModal.show('my-antd-modal', { name: 'Nate' })
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

### Use modal component without id
If you don't want to use a string to show/hide a modal, you can use the component directly.

```jsx
import MyAntdModal from './MyAntdModal';
//...
NiceModal.show(MyAntdModal, { name: 'Nate' });
//...
```


### Use modal with the hook
The `useModal` hook can not only be used inside a modal component but also any component by passing it a modal id/component:

```jsx
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import MyAntdModal from './my-antd-modal'; // created by above code

NiceModal.register('my-antd-modal', MyAntdModal);
//...
// if use with id, need to register it first
const modal = useModal('my-antd-modal');
// or if with component, no need to register
const modal = useModal(MyAntdModal);

//...
modal.show({ name: 'Nate' }); // show the modal
modal.hide(); // hide the modal
//...
```

### Declare your modal instead of `register`
The nice modal component you created can be also used as a normal component by JSX, then you don't need to register it. For example:

```jsx
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import MyAntdModal from './my-antd-modal'; // created by above code

function App() {
  const showAntdModal = () => {
    // Show a modal with arguments passed to the component as props
    NiceModal.show('my-antd-modal')
  };
  return (
    <div className="app">
      <h1>Nice Modal Examples</h1>
      <div className="demo-buttons">
        <button onClick={showAntdModal}>Antd Modal</button>
      </div>
      <MyAntdModal id="my-antd-modal" name="Nate" />
    </div>
  );
}
```

With this approach, you can get the benifits:
* Inherit React context in the modal component under some component node.
* Pass arguments to the modal componnent via props.

> NOTE: if you show the component by id but the modal is not declared or registered. Nothing will happen but only a warning message in the dev console.

### Using promise API
Besides using props to interact with the modal from the parent component, you can do it easier by promise. For example, we have a user list page with a add user button to show a dialog to add user. After user is added the list should refresh itself to refelect the change, then we can use below code:

```jsx
NiceModal.show(AddUserModal)
  .then(() => {
    // When call modal.hide(payload) in the modal component
    // it will resolve the promise returned by `show` method.
    // fetchUsers will call the rest API and update the list
    fetchUsers()
  })
  .catch(err=> {
    // if modal.hide(new Error('something went wrong')), it will reject the promise
  }); 
```

You can see the live example on codesandbox.

### Integrating with Redux
By default NiceModal uses React context and `useReducer` internally to manage modal state. However you can easily integrate it with Redux if you want to tracking/debugging the state change of your modals with Redux dev tools. Below code shows how to do it:

```jsx
// First combine the reducer

// Passing Redux state to the nice modal provider
```

### Using with any UI library

### Using help methods

## API Reference

# License
MIT



