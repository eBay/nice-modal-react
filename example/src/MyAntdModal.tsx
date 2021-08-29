import { Modal, Button, Space } from 'antd';
import { create, useModal, antdModal } from '@ebay/nice-modal-react';

export default create(({ name }: { name: string }) => {
  const modal = useModal();
  const handleResolve = () => {
    modal.hide({ resolved: true });
  };
  const handleReject = () => {
    modal.hide(new Error('Failed to do something.'));
  };
  return (
    <Modal title="Hello Antd" {...antdModal(modal)}>
      Greetings:{name}{' '}
      <Space>
        <Button onClick={handleResolve}>Resolve</Button>
        <Button type="primary" onClick={handleReject}>
          Reject
        </Button>
      </Space>
    </Modal>
  );
});
