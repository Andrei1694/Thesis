export default function UserCard({ user }) {
  return (
    <div className="bg-white rounded-[10px] shadow p-6 mb-4">
      <div className="flex items-center mb-4">
        <img
          src={user.profileImage || "default-profile.png"}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-20 h-20 rounded-full mr-4"
        />
        <div>
          <h2 className="text-2xl font-bold text-customPrimary">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-customDark">{user.jobTitle}</p>
        </div>
      </div>
      <div>
        <p className="text-customDark">Email: {user.email}</p>
        <p className="text-customDark">Phone: {user.phone}</p>
        <p className="text-customDark">Location: {user.location}</p>
      </div>
    </div>
  );
}
