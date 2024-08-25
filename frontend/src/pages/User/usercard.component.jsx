import React from 'react';

const getInitials = (firstName, lastName) => {
  if (firstName && lastName) {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }
  return "";
};

export default function UserCard({ user, onClick }) {
  const initials = getInitials(user.firstName, user.lastName);
  return (
    <div className="hover:bg-customSecondary bg-white rounded-[10px] shadow px-3 mb-4 h-72 overflow-hidden" onClick={onClick}>
      <div className="flex flex-col items-center mb-4 mt-2">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-20 h-20 rounded-full mr-4 object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full mr-4 bg-customLight flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
        )}
        <div className='mt-2'>
          <h2 className="text-2xl font-bold text-customPrimary whitespace-nowrap text-center">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-customDark">{user.jobTitle}</p>
        </div>
      </div>
      <div>
        <p className="text-customDark">Email: {user.email}</p>
        <p className="text-customDark">First Name: {user.firstName}</p>
        <p className="text-customDark">Last Name: {user.lastName}</p>
      </div>
    </div>
  );
}