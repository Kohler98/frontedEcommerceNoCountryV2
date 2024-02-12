import React, { useEffect, useState } from 'react';
import UsersData from '../components/users/UsersData';
import EditUsersData from '../components/users/EditUsersData';

export default function Users() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  })

  return (
    <div>
      {isEditing && selectedUser ? (
        <EditUsersData 
          user={selectedUser} 
          setIsEditing={setIsEditing} 
          setSelectedUser={setSelectedUser} 
        />
      ) : (
        <UsersData 
          setIsEditing={setIsEditing} 
          setSelectedUser={setSelectedUser} 
        />
      )}
    </div>
  );
}
