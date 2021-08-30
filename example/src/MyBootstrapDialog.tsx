import BootstrapModal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import NiceModal, { useModal, bootstrapDialog } from '@ebay/nice-modal-react';

const MyBootstrapDialog = NiceModal.create(({ name = 'Bootstrap' }: { name: string }) => {
  const modal = useModal();
  return (
    <BootstrapModal {...bootstrapDialog(modal)} title="Nice Modal">
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>Modal title</BootstrapModal.Title>
      </BootstrapModal.Header>

      <BootstrapModal.Body>
        <p>Modal body text goes here. {name}</p>
      </BootstrapModal.Body>

      <BootstrapModal.Footer>
        <Button variant="secondary" onClick={modal.hide}>
          Close
        </Button>
        <Button variant="primary" onClick={modal.hide}>
          Save changes
        </Button>
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
});
export default function BootstrapSample() {
  return (
    <>
      <Button variant="primary" onClick={() => NiceModal.show(MyBootstrapDialog, { name: 'Bootstrap' })}>
        Show Dialog
      </Button>
    </>
  );
}
