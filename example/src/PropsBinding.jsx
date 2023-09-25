import { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

export const MyAntdModal = NiceModal.create(({ time }) => {
  const modal = useModal();
  return (
    <Modal
      title="Props Binding"
      visible={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
    >
      Time: {time}
    </Modal>
  );
});

export default function Example() {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const p = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(p);
  }, []);

  return (
    <>
      <Button type="primary" onClick={() => NiceModal.show('props-binding-modal')}>
        Show Modal
      </Button>
      <MyAntdModal id="props-binding-modal" time={time} />
    </>
  );
}
