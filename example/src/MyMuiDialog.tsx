import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MyMuiDialog = NiceModal.create(() => {
  const modal = useModal();
  return (
    <Dialog
      TransitionComponent={Transition}
      open={modal.visible}
      onClose={() => modal.hide()}
      TransitionProps={{
        onExited: () => modal.remove(),
      }}
    >
      <DialogTitle id="alert-dialog-slide-title">{"Use Google's location service?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Let Google help apps determine location. This means sending anonymous location data to Google, even when no
          apps are running.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => modal.hide()} color="primary">
          Disagree
        </Button>
        <Button onClick={() => modal.hide()} color="primary">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default function MuiDialogSample() {
  return (
    <Button variant="contained" onClick={() => NiceModal.show(MyMuiDialog)} color="primary">
      Agree
    </Button>
  );
}
