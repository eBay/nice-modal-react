import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import NiceModal from '@ebay/nice-modal-react';
import { Button } from 'antd';
import { MyAntdModal } from './MyAntdModal';
import logger from 'redux-logger';

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const enhancer = composeEnhancers(applyMiddleware(logger));

const store = createStore(
  combineReducers({
    __nice_modals: NiceModal.reducer,
    // other reducers...
  }),
  enhancer,
);

const ModalsProvider = ({ children }) => {
  const modals = useSelector((s) => s.__nice_modals);
  const dispatch = useDispatch();
  return (
    <NiceModal.Provider modals={modals} dispatch={dispatch}>
      <p style={{ color: '#999' }}>NOTE: open dev console or Redux dev tools to see actions log.</p>
      <Button
        type="primary"
        onClick={() => {
          NiceModal.show(MyAntdModal, { name: 'Redux' });
        }}
      >
        Show Modal
      </Button>
    </NiceModal.Provider>
  );
};

export default function ReduxIntegration({ children }) {
  return (
    <Provider store={store}>
      <ModalsProvider>{children}</ModalsProvider>
    </Provider>
  );
}
