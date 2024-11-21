import { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import NiceModal, {
	useModal, ModalHolder,
	// TS type friendly
	createModalHandler
} from '@ebay/nice-modal-react';

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

  // modalHandler will be assign show/hide method.
  const modalHandler = {};
	// TS type friendly
	// const modalHandler = createModalHandler<typeof MyAntdModal>()

  return (
    <>
      <Button type="primary" onClick={() => modalHandler.show({ time })}>
        Show Modal
      </Button>
      <ModalHolder modal={MyAntdModal} handler={modalHandler} />
    </>
  );
}
