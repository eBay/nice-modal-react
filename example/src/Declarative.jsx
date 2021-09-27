import { Modal, Button } from 'antd';
import NiceModal, { useModal, ModalDef } from '@ebay/nice-modal-react';

export const MyAntdModal = NiceModal.create(({ name }) => {
  const modal = useModal();
  return (
    <Modal title="Hello Antd" visible={modal.visible} onOk={modal.hide} onCancel={modal.hide} afterClose={modal.remove}>
      Greetings: {name}!
    </Modal>
  );
});

export default function AntdSample() {
  return (
    <>
      <Button type="primary" onClick={() => NiceModal.show('my-antd-modal', { name: 'Nate' })}>
        Show Modal
      </Button>
      <ModalDef id="my-antd-modal" component={MyAntdModal} />
    </>
  );
}
