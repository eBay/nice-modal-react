// This a test file to check if typescript is working properly
import React from 'react';
import NiceModal, { useModal, antdModalV5 } from '@ebay/nice-modal-react';

const MyModal1 = NiceModal.create(({ p1, p2, id }: { p1: string; p2: number; id: string }) => {
  const modal = useModal();
  return (
    <div {...antdModalV5(modal)}>
      <h1>Foo</h1>
      <button onClick={modal.hide}>Close</button>
    </div>
  );
});

const MyModal2 = NiceModal.create(() => {
  const modal = useModal();
  return (
    <div {...antdModalV5(modal)}>
      <h1>Foo</h1>
      <button onClick={modal.hide}>Close</button>
    </div>
  );
});

NiceModal.register('modal-1', MyModal1, { p2: 1, p1: 'abc' });

export default function TsTest() {
  const modal1 = useModal(MyModal1, { p1: 'abc', p2: 123 });
  modal1.show({ p1: 'foo', p2: 123, p4: 'hello' }); // expected: p4 should not be accepted
  modal1.show({ p2: 1, p1: '1' });
  modal1.show({ p2: 1, p1: 1 }); // expected: p1 should be string
  modal1.show();

  NiceModal.show(MyModal1);
  NiceModal.show(MyModal1, { p1: 'foo', p2: 123 });
  NiceModal.show(MyModal1, { p1: 'foo', p2: '123' }); // expected ts error: p2 should be number
  NiceModal.show(MyModal1, { p1: 'foo' });
  NiceModal.show(MyModal1, { p2: 123 });
  NiceModal.show(MyModal1, { p2: '123' }); // expected ts error: p2 should be number

  NiceModal.show('modal-1', { p1: 'foo', p2: 123 });

  const modal1_1 = useModal('modal-1', { p3: 'foo', p2: 123 });
  modal1_1.show();

  const modal2 = useModal(MyModal2);
  modal2.show();
  modal2.show({ p1: 'foo', p2: 123 });

  const modal3 = useModal(MyModal1, { p1: 'abc' });
  modal3.show({ p1: 1 }); // expected ts error: p1 should be a string
  const modal4 = useModal(MyModal1, { p1: 123 }); // expected ts error: p1 should be a string

  // If already type error, can't detect below type error
  modal4.show({ p1: 'abc', p2: 'a' });

  return <>hello ts</>;
}
