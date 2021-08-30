import { useMemo, useCallback, useState } from 'react';
import { Button, Table } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useModal } from '@ebay/nice-modal-react';
import UserInfoModal from './UserInfoModal';
import mockData from './mock';

export default function UserList() {
  const userModal = useModal(UserInfoModal);
  const [users, setUsers] = useState(mockData);

  const handleNewUser = useCallback(() => {
    userModal.show().then((newUser) => {
      setUsers([newUser, ...users]);
    });
  }, [userModal, users]);

  const handleEditUser = useCallback(
    (user) => {
      userModal.show({ user }).then((newUser) => {
        setUsers((users) => {
          // Modify users immutablly
          const i = users.findIndex((u) => u.id === newUser.id);
          const updated = { ...users[i], ...newUser };
          const arr = [...users];
          arr.splice(i, 1, updated);
          return arr;
        });
      });
    },
    [userModal],
  );

  const columns = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        width: '150px',
      },
      {
        title: 'Job Title',
        dataIndex: 'job',
      },
      {
        title: 'Edit',
        width: '100px',
        render(value, user) {
          return (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                handleEditUser(user);
              }}
            />
          );
        },
      },
    ],
    [handleEditUser],
  );

  return (
    <div>
      <Button type="primary" onClick={handleNewUser}>
        + New User
      </Button>
      <Table
        size="small"
        rowKey="id"
        pagination={false}
        columns={columns}
        dataSource={users}
        style={{ marginTop: '20px' }}
      />
    </div>
  );
}
