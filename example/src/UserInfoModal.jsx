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
      modal.hide({ ...user, ...form.getFieldsValue() });
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
