import React, { PropsWithRef, useState } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

type Props = {
  message: string;
  p: number;
};

export type EditMessageResponse = {
  message: string;
};

export const EditMessage = NiceModal.create(({ message, p }: PropsWithRef<Props>) => {
  const [newMessage, setNewMessage] = useState(message);
  const modal = useModal();

  const cancel = () => {
    modal.remove();
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    modal.resolve({
      message: newMessage,
      p,
    } as EditMessageResponse);
    modal.remove();
  };

  return (
    <div>
      <form onSubmit={submit}>
        <input name="message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
        <button type="submit">Update</button>
        <button onClick={cancel}>Cancel</button>
      </form>
    </div>
  );
});

function App() {
  const handleClick = async () => {
    const result: EditMessageResponse = await NiceModal.show(EditMessage, {
      message: 'foo',
    });
    alert(`New message: ${result.message}`);
  };
  return (
    <div className="App">
      <h1>React + Vite</h1>
      <div className="card">
        <button onClick={handleClick}>Click to open modal</button>
      </div>
    </div>
  );
}

export default App;
