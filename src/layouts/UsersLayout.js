import { Outlet } from 'react-router-dom';

const UsersLayout = () => {
  return (
    <div> {/*add container styles here */}
    <div> {/*add card/form container here */}
      <Outlet /> {/* Login/Signup components will render here */}
    </div>
  </div>
  );
};

export default UsersLayout