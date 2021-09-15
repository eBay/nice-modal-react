import { Modal, Button, Space } from 'antd';
import NiceModal, { useModal, antdModal } from '@ebay/nice-modal-react';

const PromiseModal = NiceModal.create(({ name }) => {
  const modal = useModal();
  const handleResolve = () => {
    modal.resolve({ resolved: true });
  };
  const handleReject = () => {
    modal.reject(new Error('Rejected'));
    modal.hide();
  };
  return (
    <Modal title="Promise Example" {...antdModal(modal)}>
      <p>Choose the promise action: {name}</p>
      <Space>
        <Button onClick={handleResolve}>Resolve</Button>
        <Button onClick={handleReject} danger>
          Reject
        </Button>
      </Space>
    </Modal>
  );
});

const ChainingModal = NiceModal.create(({ times }) => {
  const modal = useModal();
  return (
    <Modal title="Chaining Same Modal Example" {...antdModal(modal)}>
      <Button type="primary" onClick={() => modal.resolve()}>
        Hide with resolve.
      </Button>
      <br />
      <br />
      Showed {times}/3 times.
    </Modal>
  );
});

export default function PromiseSample() {
  const chainingModal = useModal(ChainingModal);
  const showPromiseModal = () => {
    NiceModal.show(PromiseModal, { name: 'nate' })
      .then((res) => {
        console.log('Resolved: ', res);
        NiceModal.show(PromiseModal, { name: 'nate2' });
      })
      .catch((err) => {
        console.log('Rejected: ', err);
      });
  };
  const showChainingModal = async () => {
    for (let i = 0; i < 3; i++) {
      await chainingModal.show({ times: i + 1 });
      await chainingModal.hide();
    }
  };

  return (
    <>
      <p style={{ color: '#888' }}>NOTE: please open dev console to see the output.</p>
      <Space>
        <Button type="primary" onClick={showPromiseModal}>
          Show Modal
        </Button>

        <Button type="primary" onClick={showChainingModal}>
          Chaining Same Modal
        </Button>
      </Space>
    </>
  );
}
