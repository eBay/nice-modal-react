import { Modal, Button, Space, Alert } from 'antd';
import NiceModal, { useModal, antdModal } from '@ebay/nice-modal-react';

const PromiseModal = NiceModal.create(() => {
  const modal = useModal();
  const handleResolve = () => {
    modal.resolve({ resolved: true });
    modal.hide();
  };
  const handleReject = () => {
    modal.reject(new Error('Rejected'));
    modal.hide();
  };
  return (
    <Modal title="Promise Example" {...antdModal(modal)}>
      <p>Choose the promise action:</p>
      <Space>
        <Button onClick={handleResolve}>Resolve</Button>
        <Button onClick={handleReject} danger>
          Reject
        </Button>
      </Space>
    </Modal>
  );
});

export default function PromiseSample() {
  const showPromiseModal = () => {
    NiceModal.show(PromiseModal)
      .then((res) => {
        console.log('Resolved: ', res);
      })
      .catch((err) => {
        console.log('Rejected: ', err);
      });
  };
  return (
    <>
      <p>
        <Alert type="info" message="NOTE: please open dev console to see the output." showIcon />
      </p>
      <Button type="primary" onClick={showPromiseModal}>
        Show Modal
      </Button>
    </>
  );
}
