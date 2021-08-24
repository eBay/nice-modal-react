import NiceModal, { useModal } from 'nice-modal';
import MyAntdModal from './MyAntdModal';
import MyAntdDrawer from './MyAntdDrawer';
import MyBootstrapDialog from './MyBootstrapDialog';
import MyMuiDialog from './MyMuiDialog';
import './App.css';

NiceModal.register('mm', MyAntdModal, { name: 'nate333' });

function App() {
  const antdModal = useModal('mm');
  const antdDrawer = useModal(MyAntdDrawer);
  const muiDialog = useModal(MyMuiDialog);

  const showAntdModal = () => {
    antdModal
      .show()
      .then((res) => {
        console.log('resolved: ', res);
      })
      .catch((err) => {
        console.log('rejected: ', err);
      });
  };
  return (
    <div className="app">
      <h1>Nice Modal Examples</h1>
      <div className="demo-buttons">
        <button onClick={showAntdModal}>Antd Modal</button>
        <button onClick={() => antdDrawer.show({ name: 'drawer' })}>Antd Drawer</button>
        <button onClick={() => muiDialog.show()}>Material UI Dialog</button>
        <button onClick={() => NiceModal.show(MyBootstrapDialog, { name: 'nnnn' })}>Bootstrap Dialog</button>
        <button onClick={() => NiceModal.hide(MyBootstrapDialog)}>Hide Bootstrap Dialog</button>
        {/* <button onClick={() => modal.show()}>Antd Modal</button> */}
      </div>
      <MyAntdModal defaultVisible id="test-antd-modal" name="nate" />
    </div>
  );
}

export default App;
