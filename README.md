# @ebay/nice-modal-react

> **A lightweight, zero-dependency utility for managing React modals imperatively with promise-based APIs**

[![NPM](https://img.shields.io/npm/v/@ebay/nice-modal-react.svg)](https://www.npmjs.com/package/@ebay/nice-modal-react)
[![Downloads](https://img.shields.io/npm/dm/@ebay/nice-modal-react.svg)](https://www.npmjs.com/package/@ebay/nice-modal-react)
[![Build Status](https://api.travis-ci.com/eBay/nice-modal-react.svg?branch=main)](https://app.travis-ci.com/github/eBay/nice-modal-react)
[![Coverage Status](https://codecov.io/gh/ebay/nice-modal-react/branch/main/graph/badge.svg)](https://codecov.io/github/eBay/nice-modal-react)
[![Demo](https://img.shields.io/badge/demo-link-orange.svg)](https://ebay.github.io/nice-modal-react/)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/eBay/nice-modal-react/blob/main/LICENSE.md)

## What is NiceModal?

NiceModal is a small (~2kb gzipped), zero-dependency utility that revolutionizes modal management in React applications. Instead of managing modal visibility state across your component tree, NiceModal provides an imperative, promise-based API to show and hide modals from anywhere in your app.

**Show any modal from anywhere in your app:**

```jsx
import NiceModal from '@ebay/nice-modal-react';
import MyModal from './MyModal';

// Show a modal programmatically
NiceModal.show(MyModal, { someProp: 'hello' })
  .then(() => {
    // Do something when the modal task completes
    console.log('Modal resolved!');
  });
```

**Or use modal IDs for complete decoupling:**

```jsx
import NiceModal from '@ebay/nice-modal-react';

// Register once
NiceModal.register('my-modal', MyModal);

// Show anywhere without importing the component
NiceModal.show('my-modal', { someProp: 'hello' })
  .then(() => {
    console.log('Modal task completed!');
  });
```

> **📚 Learn More:** Read the in-depth introduction at [eBay Tech Blog](https://medium.com/ebaytech/rethink-modals-management-in-react-cf3b6804223d)
>
> **💡 Also Check Out:** [nice-form-react](https://github.com/eBay/nice-form-react) - Form management utility from the same team!

**⚠️ Important:** `@ebay/nice-modal-react` is **not** a modal component itself. It's a state management utility designed to work seamlessly with modal components from UI libraries like [Material UI](https://material-ui.com/), [Ant Design](https://ant.design), [React Bootstrap](https://react-bootstrap.github.io/), and others.

## Live Examples

Explore interactive examples at: **https://ebay.github.io/nice-modal-react**

## Why NiceModal?

### The Traditional Modal Problem

Managing modals in React is frustrating. Consider a common scenario: you need to show a "Create Ticket" dialog from multiple places—the header, context menus, and list pages.

**Traditional approach problems:**

1. **Scattered State Management**: If you declare modals where they're used, you must manage visibility state in each location
2. **Root Component Bloat**: If you declare all modals in the root component, it becomes unmaintainable as your app grows
3. **Props Drilling Hell**: Passing `setVisible` callbacks through component hierarchies is cumbersome
4. **Refactoring Overhead**: When requirements change, you often need to restructure your modal declarations

### The NiceModal Solution

NiceModal treats modals like pages in a single-page application. Just as routes manage page visibility globally by URL, NiceModal manages modal visibility globally by ID. This approach aligns with the true nature of modals: **global UI overlays that aren't necessarily tied to specific components**.

## Key Features

✨ **Zero Dependencies** - Only ~2kb gzipped, no external dependencies

🎯 **Imperative API** - Show modals programmatically from anywhere using promises

🔌 **Completely Decoupled** - Control modals by ID without importing components

⚡ **Performance Optimized** - Modal code doesn't execute when modal is invisible

🎭 **Transition Friendly** - Preserves enter/exit animations and transitions

🤝 **Promise-Based** - Interact with modals using promises, not just props

🎨 **UI Library Agnostic** - Built-in helpers for Material UI, Ant Design, Bootstrap, and easy integration with any library

📦 **TypeScript Native** - Full TypeScript support with excellent type inference

🧪 **Redux Compatible** - Optional Redux integration for debugging with DevTools

🎣 **React Hooks** - Modern hooks-based API (`useModal`)

## Installation

```bash
# with npm
npm install @ebay/nice-modal-react

# with yarn
yarn add @ebay/nice-modal-react

# with pnpm
pnpm add @ebay/nice-modal-react
```

## Quick Start

### Step 1: Add Provider

Wrap your app with `NiceModal.Provider`:

```jsx
import NiceModal from '@ebay/nice-modal-react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <React.StrictMode>
    <NiceModal.Provider>
      <App />
    </NiceModal.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

### Step 2: Create a Modal Component

Wrap your modal component with `NiceModal.create` and use the `useModal` hook to access modal state:

```jsx
import { Modal } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

export default NiceModal.create(({ name }) => {
  const modal = useModal();

  return (
    <Modal
      title="Hello Ant Design"
      open={modal.visible}
      onOk={() => modal.hide()}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
    >
      Hello {name}!
    </Modal>
  );
});
```

**Key Points:**

- `modal.visible` - Controls modal visibility
- `modal.hide()` - Hides the modal
- `modal.remove()` - Removes the modal from the React tree (call after transitions)
- `modal.resolve()` / `modal.reject()` - Resolve or reject the promise returned by `show()`

### Step 3: Show Your Modal

**Option A: Show by Component Reference**

```jsx
import NiceModal from '@ebay/nice-modal-react';
import MyModal from './MyModal';

function App() {
  const showModal = () => {
    NiceModal.show(MyModal, { name: 'World' });
  };

  return <button onClick={showModal}>Show Modal</button>;
}
```

**Option B: Show by ID (Recommended for Large Apps)**

```jsx
import NiceModal from '@ebay/nice-modal-react';
import MyModal from './MyModal';

// Register the modal (typically in a central modals.js file)
NiceModal.register('my-modal', MyModal);

function App() {
  const showModal = () => {
    NiceModal.show('my-modal', { name: 'World' });
  };

  return <button onClick={showModal}>Show Modal</button>;
}
```

## Core API

### NiceModal.show()

Shows a modal and returns a promise.

```jsx
// Show by component
NiceModal.show(MyModal, { name: 'John' })
  .then((result) => {
    console.log('Modal resolved:', result);
  })
  .catch((error) => {
    console.error('Modal rejected:', error);
  });

// Show by ID
NiceModal.show('my-modal', { name: 'John' });
```

### NiceModal.hide()

Hides a modal and returns a promise that resolves after the modal's exit transition completes.

```jsx
// Hide by component
NiceModal.hide(MyModal);

// Hide by ID
NiceModal.hide('my-modal').then(() => {
  console.log('Modal hidden and transition complete');
});
```

### NiceModal.remove()

Removes a modal from the React tree immediately.

```jsx
NiceModal.remove('my-modal');
```

### useModal()

The primary hook for managing modal state.

**Inside a modal component:**

```jsx
const modal = useModal();

// Access modal state
modal.visible;      // boolean - is the modal visible?
modal.args;         // object - props passed to modal
modal.keepMounted;  // boolean - should modal stay mounted when hidden?

// Control modal
modal.show(args);   // Show the modal with new args
modal.hide();       // Hide the modal
modal.remove();     // Remove from React tree

// Promise resolution
modal.resolve(data);     // Resolve the promise from NiceModal.show()
modal.reject(error);     // Reject the promise from NiceModal.show()
modal.resolveHide(data); // Resolve the promise from NiceModal.hide()
```

**Outside a modal component:**

```jsx
// Control any modal by ID or component reference
const modal = useModal('my-modal');
// or
const modal = useModal(MyModal);

// Use the same API as above
modal.show({ name: 'Jane' });
modal.hide();
```

### NiceModal.register()

Registers a modal component with an ID for use across your app.

```jsx
NiceModal.register('confirm-dialog', ConfirmDialog);
NiceModal.register('user-profile', UserProfileModal);
```

### NiceModal.create()

Higher-order component that wraps your modal to integrate with NiceModal state management.

```jsx
export default NiceModal.create(({ title, message }) => {
  const modal = useModal();

  return (
    <Dialog open={modal.visible} onClose={() => modal.hide()}>
      <h2>{title}</h2>
      <p>{message}</p>
    </Dialog>
  );
});
```

## Advanced Usage

### Promise-Based Workflows

Use promises to coordinate workflows involving modals:

```jsx
import NiceModal from '@ebay/nice-modal-react';
import AddUserModal from './AddUserModal';

function UserList() {
  const addUser = async () => {
    try {
      const newUser = await NiceModal.show(AddUserModal);
      // Modal resolved with new user data
      await fetchUsers(); // Refresh the list
      showSuccessNotification();
    } catch (error) {
      // Modal was rejected or cancelled
      showErrorNotification(error);
    }
  };

  return <button onClick={addUser}>Add User</button>;
}
```

In your modal, resolve or reject the promise:

```jsx
export default NiceModal.create(() => {
  const modal = useModal();

  const handleSubmit = async (userData) => {
    try {
      const newUser = await api.createUser(userData);
      modal.resolve(newUser); // Resolve with data
      modal.hide();
    } catch (error) {
      modal.reject(error); // Reject on error
    }
  };

  return (
    <Modal open={modal.visible} onClose={() => modal.hide()}>
      <UserForm onSubmit={handleSubmit} />
    </Modal>
  );
});
```

### Declarative Usage with Context Inheritance

When you need to access React Context from within a modal, use the declarative approach:

```jsx
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import MyModal from './MyModal';

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <button onClick={() => NiceModal.show('my-modal')}>
        Show Modal
      </button>

      {/* Modal component can now access ThemeContext */}
      <MyModal id="my-modal" defaultVisible={false} />
    </ThemeProvider>
  );
}
```

**Props:**

- `id` - Unique identifier for the modal
- `defaultVisible` - Show modal on mount (default: `false`)
- `keepMounted` - Keep modal mounted when hidden (default: `false`)

### UI Library Helpers

NiceModal provides pre-built helpers for popular UI libraries that automatically bind modal state to the correct props:

#### Ant Design

```jsx
import { Modal } from 'antd';
import NiceModal, { useModal, antdModalV5 } from '@ebay/nice-modal-react';

export default NiceModal.create(() => {
  const modal = useModal();

  return (
    <Modal {...antdModalV5(modal)} title="Ant Design Modal">
      Modal content
    </Modal>
  );
});
```

Available helpers:
- `antdModal` - Ant Design v4 (uses `visible` prop)
- `antdModalV5` - Ant Design v5 (uses `open` prop)
- `antdDrawer` - Ant Design Drawer v4
- `antdDrawerV5` - Ant Design Drawer v5

#### Material UI

```jsx
import { Dialog } from '@mui/material';
import NiceModal, { useModal, muiDialogV5 } from '@ebay/nice-modal-react';

export default NiceModal.create(() => {
  const modal = useModal();

  return (
    <Dialog {...muiDialogV5(modal)}>
      <DialogTitle>MUI Dialog</DialogTitle>
      <DialogContent>Modal content</DialogContent>
    </Dialog>
  );
});
```

Available helpers:
- `muiDialog` - Material UI v4
- `muiDialogV5` - Material UI v5

#### React Bootstrap

```jsx
import { Modal } from 'react-bootstrap';
import NiceModal, { useModal, bootstrapDialog } from '@ebay/nice-modal-react';

export default NiceModal.create(() => {
  const modal = useModal();

  return (
    <Modal {...bootstrapModal(modal)}>
      <Modal.Header closeButton>
        <Modal.Title>Bootstrap Modal</Modal.Title>
      </Modal.Header>
      <Modal.Body>Modal content</Modal.Body>
    </Modal>
  );
});
```

**You can override helper props:**

```jsx
const handleSubmit = async () => {
  await submitForm();
  modal.hide();
};

<Modal {...antdModalV5(modal)} onOk={handleSubmit}>
  {/* onOk is overridden */}
</Modal>
```

### Custom UI Library Integration

For any modal-like component, manually bind the modal state:

```jsx
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { CustomModal } from 'some-ui-library';

export default NiceModal.create(() => {
  const modal = useModal();

  return (
    <CustomModal
      isOpen={modal.visible}
      onClose={() => modal.hide()}
      onAfterClose={() => {
        modal.resolveHide();
        if (!modal.keepMounted) {
          modal.remove();
        }
      }}
    >
      Modal content
    </CustomModal>
  );
});
```

**Key patterns:**

1. Bind `modal.visible` to the open/show/isOpen prop
2. Call `modal.hide()` on close events
3. Call `modal.remove()` after exit transitions (unless `keepMounted` is true)
4. Call `modal.resolveHide()` when hide transition completes

### Redux Integration

Integrate with Redux to enable modal state debugging via Redux DevTools:

```jsx
import { createStore, combineReducers } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import NiceModal from '@ebay/nice-modal-react';

// Combine NiceModal reducer
const store = createStore(
  combineReducers({
    modals: NiceModal.reducer,
    // ... other reducers
  })
);

// Create provider that connects Redux to NiceModal
function ModalProvider({ children }) {
  const modals = useSelector((state) => state.modals);
  const dispatch = useDispatch();

  return (
    <NiceModal.Provider modals={modals} dispatch={dispatch}>
      {children}
    </NiceModal.Provider>
  );
}

// Use in your app
function App() {
  return (
    <Provider store={store}>
      <ModalProvider>
        <YourApp />
      </ModalProvider>
    </Provider>
  );
}
```

Now you can track modal state changes in Redux DevTools!

### Advanced Components

#### ModalDef - Declarative Registration

Register modals declaratively instead of calling `NiceModal.register()`:

```jsx
import NiceModal from '@ebay/nice-modal-react';
import MyModal from './MyModal';

function App() {
  return (
    <>
      <NiceModal.ModalDef id="my-modal" component={MyModal} />
      <YourApp />
    </>
  );
}
```

The modal is automatically unregistered when `ModalDef` unmounts.

#### ModalHolder - Props Binding

Create a reusable modal reference with bound props:

```jsx
import NiceModal, { createModalHandler } from '@ebay/nice-modal-react';
import MyModal from './MyModal';

function App() {
  const modalHandler = createModalHandler();

  return (
    <>
      <button onClick={() => modalHandler.show({ name: 'John' })}>
        Show Modal
      </button>

      <NiceModal.ModalHolder
        modal={MyModal}
        handler={modalHandler}
        // These props are always passed to the modal
        theme="dark"
        locale="en-US"
      />
    </>
  );
}
```

## TypeScript Support

NiceModal has excellent TypeScript support with full type inference:

```tsx
import NiceModal, { useModal } from '@ebay/nice-modal-react';

interface MyModalProps {
  title: string;
  userId: number;
}

const MyModal = NiceModal.create<MyModalProps>(({ title, userId }) => {
  const modal = useModal();

  // props are fully typed
  return (
    <Modal open={modal.visible} onClose={() => modal.hide()}>
      <h2>{title}</h2>
      <UserDetails userId={userId} />
    </Modal>
  );
});

// TypeScript ensures correct props
NiceModal.show(MyModal, {
  title: 'User Profile',
  userId: 123
}); // ✅

NiceModal.show(MyModal, {
  title: 'User Profile'
}); // ❌ Error: userId is required

NiceModal.show(MyModal, {
  title: 'User Profile',
  userId: '123'
}); // ❌ Error: userId must be a number
```

## Testing

Test your modals easily with `@testing-library/react`:

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import NiceModal from '@ebay/nice-modal-react';
import { MyModal } from './MyModal';

test('modal shows and hides correctly', async () => {
  render(
    <NiceModal.Provider>
      <App />
    </NiceModal.Provider>
  );

  // Show the modal
  NiceModal.show(MyModal, { title: 'Test' });

  // Assert modal is visible
  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  // Hide the modal
  NiceModal.hide(MyModal);

  // Assert modal is hidden
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

test('modal promise resolves with data', async () => {
  render(<NiceModal.Provider />);

  const promise = NiceModal.show(MyModal);

  // Simulate user completing modal task
  const modalComponent = screen.getByRole('dialog');
  const submitButton = within(modalComponent).getByText('Submit');
  userEvent.click(submitButton);

  // Assert promise resolves with expected data
  await expect(promise).resolves.toEqual({ success: true });
});
```

## API Reference

Full API documentation: **https://ebay.github.io/nice-modal-react/api/**

## FAQ

### Can modals access React Context?

**Yes!** Use the declarative approach by rendering the modal component in the tree:

```jsx
<ThemeProvider theme={theme}>
  <MyModal id="my-modal" />
  <App />
</ThemeProvider>
```

Now when you call `NiceModal.show('my-modal')`, the modal can access `ThemeContext`.

### How do I pass default props to a modal?

Use the third parameter of `NiceModal.register()`:

```jsx
NiceModal.register('my-modal', MyModal, {
  theme: 'dark',
  locale: 'en-US'
});
```

### Can I show multiple instances of the same modal?

Each modal ID can only show one instance at a time. To show multiple instances, register the same component with different IDs:

```jsx
NiceModal.register('modal-1', MyModal);
NiceModal.register('modal-2', MyModal);

NiceModal.show('modal-1');
NiceModal.show('modal-2'); // Both are shown
```

### Should I use `keepMounted`?

Use `keepMounted={true}` when:
- The modal contains form state you want to preserve
- You want to avoid re-initializing expensive components
- The modal will be shown/hidden frequently

Don't use it when:
- You want optimal performance (removing from tree is better)
- The modal is rarely used
- You want fresh state on each show

### How do I handle modal stacking?

NiceModal automatically handles z-index stacking. The order modals are shown determines their stacking order. The last shown modal appears on top.

## Contributing

We welcome contributions! Here's how to set up the development environment:

```bash
# Clone the repository
git clone https://github.com/eBay/nice-modal-react.git
cd nice-modal-react

# Install dependencies
yarn install

# Link for local development
yarn link

# Start development server
yarn dev

# In another terminal, set up examples
cd example
yarn install
yarn link @ebay/nice-modal-react

# Start examples dev server
yarn start
```

Visit http://localhost:3000 to see the examples.

## Migration Guide

### From other modal management solutions

NiceModal is designed to be incrementally adoptable. You can:

1. Add `NiceModal.Provider` to your app
2. Gradually convert modals to use `NiceModal.create()`
3. Keep existing modal implementations working alongside NiceModal

### Upgrading from v1 to v1.2+

- New helpers: `antdModalV5`, `antdDrawerV5`, `muiDialogV5` for newer library versions
- Added `resolveHide()` for handling hide transition completion
- No breaking changes - all v1 code still works

## Browser Support

NiceModal supports all modern browsers and IE11+ (with polyfills for `Promise` and `Symbol`).

## Performance

- **Bundle size**: ~2kb gzipped
- **Runtime overhead**: Negligible - uses React Context and hooks
- **Memory efficient**: Modals are removed from the tree when hidden (unless `keepMounted` is set)

## Comparison with Other Solutions

| Feature | NiceModal | react-modal | react-responsive-modal | Traditional Approach |
|---------|-----------|-------------|------------------------|---------------------|
| Bundle Size | 2kb | 6kb | 8kb | N/A |
| Imperative API | ✅ | ❌ | ❌ | ❌ |
| Promise-based | ✅ | ❌ | ❌ | ❌ |
| Decoupled by ID | ✅ | ❌ | ❌ | ❌ |
| Zero dependencies | ✅ | ❌ | ❌ | ✅ |
| UI library agnostic | ✅ | ✅ | ✅ | ✅ |
| TypeScript | ✅ | ✅ | ⚠️ | ✅ |
| Transition support | ✅ | ✅ | ✅ | ✅ |

## License

MIT © [eBay Inc.](https://github.com/eBay)

## Acknowledgments

NiceModal was created by the eBay UI Platform team. Special thanks to all contributors who have helped improve this library.

---

**Questions or suggestions?**
- [GitHub Issues](https://github.com/eBay/nice-modal-react/issues)
- [eBay Tech Blog Article](https://medium.com/ebaytech/rethink-modals-management-in-react-cf3b6804223d)

**Related Projects:**
- [nice-form-react](https://github.com/eBay/nice-form-react) - Declarative form management for React

---

Made with ❤️ by eBay
