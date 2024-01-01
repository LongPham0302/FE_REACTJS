import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { GET_USER } from './graphql/query';
import { useNavigate } from 'react-router-dom';

const ProfileCard = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem('userId');
  const updateUser = localStorage.getItem('updateUser');
  const [userData, setUserData] = useState(null);
  const { data, refetch } = useQuery(GET_USER, {
    variables: { userId: id },
    skip: !id,
  });

  useEffect(() => {
    if (data) {
      setUserData(data.getUser);
    }
  }, [data]);
  useEffect(() => {
    if (updateUser === 'true') {
      refetch();
      setUserData(data.getUser);
      localStorage.setItem('updateUser', 'false');
    }
  }, [updateUser]);

  const handleClick = () => {
    navigate('/updateProfileUser');
  };
  const logOut = () => {
    localStorage.removeItem('key')
    localStorage.removeItem('userId')
    navigate('/login')
  }
  return (
    <div>
      {userData && <div className="hidden sm:ml-6 sm:block">
        <div className="flex space-x-4">
          <span>
            HELLO {userData.name}
          </span>
          <button className='bg-red-600	rounded p-1' onClick={logOut}>Logout</button>
        </div>
      </div>}
      {userData && <div className="bg-white rounded-lg shadow-lg p-6 w-80 mx-auto mt-2">

        <img src={userData.avatarExternalUrl || "https://placekitten.com/200/200"} alt="Profile" className="rounded-full mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{userData.name}</h2>
        <p className="text-gray-600 text-sm">Email: {userData.email}</p>
        <div className="mt-4">
          <p className="text-gray-700 text-sm">Description : {userData.description}</p>
        </div>
        <div className="mt-4">
          <p className="text-gray-700 text-sm">Date Of Birth : {userData.dateOfBirth}</p>
        </div>
        <div className="mt-6">
          <button onClick={handleClick} className="text-blue-500 hover:underline">Update Profile</button>
        </div>
      </div>}
    </div>
  );
}

export default ProfileCard;
