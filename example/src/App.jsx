import NiceModal from '@ebay/nice-modal-react';
import useHash from './useHash';
import CodeViewer from './CodeViewer';
import UserList from './UserList';
import './App.css';
import PromiseSample from './PromiseSample';
import Declarative from './Declarative';
import MyMuiDialog from './MyMuiDialog';
import MyAntdModal from './MyAntdModal';
import MyBootstrapDialog from './MyBootstrapDialog';
import ReduxIntegration from './ReduxIntegration';

const examples = {
  real: {
    name: 'Real Case',
    component: UserList,
    description: 'Show a dialog to create a new user or edit user info.',
    code: ['UserList.jsx', 'UserInfoModal.jsx'],
  },
  mui: {
    name: 'Material UI',
    description: 'Show material UI dialog',
    component: MyMuiDialog,
    code: ['MyMuiDialog.tsx'],
  },
  antd: {
    name: 'Ant Design',
    description: 'Show/hide antd modal or drawer.',
    component: MyAntdModal,
    code: ['MyAntdModal.tsx'],
  },
  bootstrap: {
    name: 'Bootstrap React',
    descript: 'Show/hide bootstrap dialog.',
    component: MyBootstrapDialog,
    code: ['MyBootstrapDialog.tsx'],
  },
  promise: {
    name: 'Promise',
    description: 'Use promise to interact with the dialog.',
    component: PromiseSample,
    code: ['PromiseSample.jsx'],
  },
  declarative: {
    name: 'Declarative',
    description: 'Declarative way to register a modal with id.',
    component: Declarative,
    code: ['Declarative.jsx'],
  },
  redux: {
    name: 'Redux Integration',
    description: 'Use Redux to manage modals state so that you can use Redux dev tools to debug nice modals.',
    component: ReduxIntegration,
    code: ['ReduxIntegration.jsx'],
  },
};

function App() {
  const current = useHash() || 'real';

  const renderExample = () => {
    const item = examples[current];
    if (!item || !item.component) {
      return <span style={{ color: 'red' }}>Error: example "{current}" not found.</span>;
    }
    const Comp = item.component;
    return (
      <>
        <h1>
          {item.name}
          <p className="example-description">{item.description}</p>
        </h1>
        <Comp />
      </>
    );
  };
  const example = examples[current] || {};
  const ele = (
    <div className="app">
      <div className="sider">
        <h1>
          <span className="header-name">@ebay/nice-modal-react</span>
          <span className="example-title">Examples</span>
        </h1>
        <div className="scroll-container">
          <ul>
            {Object.keys(examples).map((key) => (
              <li key={key}>
                <a href={`#${key}`} className={current === key ? 'active' : ''}>
                  {examples[key].name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="social">
          <a href="https://github.com/ebay/nice-modal-react">
            <img src="https://img.shields.io/github/stars/eBay/nice-modal-react?style=social" alt="Github Repo" />
          </a>
          <br />
          <a href="https://ebay.github.io/nice-modal-react/api">
            <img src="https://img.shields.io/badge/API-Reference-green" alt="api reference" />
          </a>
          <br />
          <a href="https://codesandbox.io/s/github/ebay/nice-modal-react/tree/main/example">
            <img width="150px" src="https://codesandbox.io/static/img/play-codesandbox.svg" alt="codesandbox" />
          </a>
        </div>
      </div>
      <div>
        <div className="example-container">{renderExample()}</div>
        <div className="code-container">
          {example.code?.map((f) => (
            <CodeViewer key={f} filename={f} />
          ))}
        </div>
      </div>
    </div>
  );

  if (current === 'redux') return ele;
  else return <NiceModal.Provider>{ele}</NiceModal.Provider>;
}

export default App;
