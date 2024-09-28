// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../services/Dashbord/usersSlice';
import { RootState, AppDispatch } from '../services/Dashbord/store';
import { User } from '../types/User';
import ViewIcon from '../assets/view.svg';
import EditIcon from '../assets/edit.svg';
import DeleteIcon from '../assets/delete.svg';
import Navbar from '../components/navbar';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const { users, status, error } = useSelector(
    (state: RootState) => state.dashboard,
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    // Implement your delete functionality here
    console.log(`Deleting user with id: ${userToDelete?.id}`);
    setIsDeleteModalVisible(false);
    //api call delet item whit this id ...
  };

  const handleEdit = (user: User) => {
    setUserToEdit(user);
    navigate('/registration', { state: { user, mode: 'edit' } }); // Navigate to Registration with user data
  };

  const handleView = (user: User) => {
    setUserToEdit(user);
    navigate('/registration', { state: { user, mode: 'view' } }); // Navigate to Registration with user data
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md ">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">
          Dashboard
        </h1>
        <Navbar />
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr className="bg-blue-200 text-gray-700">
                <th className="p-2">Title</th>
                <th className="p-2">Last Name</th>
                <th className="p-2">First Name</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User, index: number) => (
                <tr
                  key={user.id}
                  className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="p-2 text-center">{user.title}</td>
                  <td className="p-2 text-center">{user.lastName}</td>
                  <td className="p-2 text-center">{user.firstName}</td>
                  <td className="p-2 text-center">
                    <button
                      className="btn btn-outline btn-sm mr-2"
                      onClick={() => handleView(user)}
                    >
                      <ViewIcon />
                    </button>
                    <button
                      className="btn btn-outline btn-sm mr-2"
                      onClick={() => handleEdit(user)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="btn btn-outline btn-sm mr-2"
                      onClick={() => handleDelete(user)}
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          title="Delete Confirmation"
          open={isDeleteModalVisible}
          onOk={confirmDelete}
          onCancel={() => setIsDeleteModalVisible(false)}
          okText="Yes"
          cancelText="No"
        >
          <p>
            Are you sure you want to delete {userToDelete?.title}{' '}
            {userToDelete?.firstName}
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
