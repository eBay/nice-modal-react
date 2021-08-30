import { Modal, Button, Drawer, Space } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

export const MyAntdModal = NiceModal.create(({ name }: { name: string }) => {
  const modal = useModal();
  return (
    <Modal title="Hello Antd" visible={modal.visible} onOk={modal.hide} onCancel={modal.hide} afterClose={modal.remove}>
      Greetings: {name}!
    </Modal>
  );
});

const MyAntdDrawer = NiceModal.create(({ name }: { name: string }) => {
  const modal = useModal();
  return (
    <Drawer
      title="Hello Antd"
      visible={modal.visible}
      onClose={modal.hide}
      afterVisibleChange={(visible) => {
        if (!visible) modal.remove();
      }}
    >
      Greetings: {name}!
    </Drawer>
  );
});

export default function AntdSample() {
  return (
    <Space>
      <Button type="primary" onClick={() => NiceModal.show(MyAntdModal, { name: 'Nate' })}>
        Show Modal
      </Button>
      <Button type="primary" onClick={() => NiceModal.show(MyAntdDrawer, { name: 'Bood' })}>
        Show Drawer
      </Button>
    </Space>
  );
}
