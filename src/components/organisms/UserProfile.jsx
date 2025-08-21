import { useSelector } from 'react-redux';
import Avatar from '@/components/atoms/Avatar';

function UserProfile() {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center space-x-3">
        <Avatar
          initials="U"
          size="md"
        />
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-900">User</p>
          <p className="text-xs text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const initials = getInitials(user.firstName, user.lastName) || user.emailAddress?.charAt(0).toUpperCase() || "U";

  return (
    <div className="flex items-center space-x-3">
      <Avatar
        initials={initials}
        size="md"
      />
      <div className="hidden md:block">
        <p className="text-sm font-medium text-gray-900">
          {user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.emailAddress?.split('@')[0] || 'User'}
        </p>
        <p className="text-xs text-gray-500">ClassHub User</p>
      </div>
    </div>
  );
}

export default UserProfile;