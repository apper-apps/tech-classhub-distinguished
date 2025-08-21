import { useContext } from 'react';
import { AuthContext } from '../../App';
import Button from '@/components/atoms/Button';

function LogoutButton() {
  const { logout } = useContext(AuthContext);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={logout}
      icon="LogOut"
    >
      Logout
    </Button>
  );
}

export default LogoutButton;