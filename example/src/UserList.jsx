import { useMemo, useCallback, useState } from 'react';
import _ from 'lodash';
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
      if (newUser) setUsers([newUser, ...users]);
    });
  }, [userModal, users]);

  const handleEditUser = useCallback(
    (user) => {
      userModal.show({ user }).then((newUser) => {
        if (!newUser) return;
        setUsers((users) => {
          // Modify users immutablly
          const byId = _.keyBy(users, 'id');
          byId[newUser.id] = newUser;
          return _.values(byId);
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
      <Table size="small" pagination={false} columns={columns} dataSource={users} style={{ marginTop: '20px' }} />
    </div>
  );
}
