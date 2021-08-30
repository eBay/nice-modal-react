import { useCallback } from 'react';
import { Form, Modal } from 'antd';
import FormBuilder from 'antd-form-builder';
import NiceModal, { useModal, antdModal } from '@ebay/nice-modal-react';

export default NiceModal.create(({ user }) => {
  const modal = useModal();
  const [form] = Form.useForm();
  const meta = {
    initialValues: user,
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'job', label: 'Job Title', required: true },
    ],
  };

  const handleSubmit = useCallback(() => {
    form.validateFields().then(() => {
      const newUser = { ...form.getFieldsValue() };
      // In real case, you may call API to create user or update user
      if (!user) {
        newUser.id = String(Date.now());
      } else {
        newUser.id = user.id;
      }
      modal.resolve(newUser);
      modal.hide();
    });
  }, [modal, user, form]);
  return (
    <Modal
      {...antdModal(modal)}
      title={user ? 'Edit User' : 'New User'}
      okText={user ? 'Update' : 'Create'}
      onOk={handleSubmit}
    >
      <Form form={form}>
        <FormBuilder meta={meta} form={form} />
      </Form>
    </Modal>
  );
});
