import { Modal, Button, Drawer, Space } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

export const MyAntdModal = NiceModal.create(({ id, name }: { id: string; name: string }) => {
  const modal = useModal();
  return (
    <Modal
      title="Hello Antd"
      visible={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
    >
      Greetings: {id},{name}!
    </Modal>
  );
});

const MyAntdDrawer = NiceModal.create(({ name, id }: { name: string; id: string }) => {
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
      Greetings:{id} {name}!
    </Drawer>
  );
});

export default function AntdSample() {
  const modal = useModal(MyAntdModal);
  return (
    <Space>
      <Button type="primary" onClick={() => modal.show({ id: 'test', name: 'Nate' })}>
        Show Modal
      </Button>
      <Button
        type="primary"
        onClick={() => NiceModal.show(MyAntdDrawer, { id: 'test2', name: 'Bood' })}
      >
        Show Drawer
      </Button>
    </Space>
  );
}
