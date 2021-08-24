import { Drawer } from 'antd';
import { create, useModal, antdDrawer } from 'nice-modal';

export default create(({ name }: { name: string }) => {
  const modal = useModal();
  return (
    <Drawer title="Hello Antd" {...antdDrawer(modal)}>
      Greetings: {name}
    </Drawer>
  );
});
