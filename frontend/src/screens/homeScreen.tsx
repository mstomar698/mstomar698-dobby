import { Link } from 'react-router-dom';
import { Store } from '../store';
import { useContext } from 'react';

const HomeScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return (
    <div className="min-h-screen bg-gray-600 justify-center items-center flex flex-col">
      <h1 className="flex flex-col space-y-2  text-center justify-center items-center text-3xl pt-2 text-black">
        Home <br />
        <button className="text-black focus:outline-none shadow-lg flex flex-row overflow-hidden">
          {userInfo ? (
            <Link
              to="/uploadimage"
              className="bg-green-200 p-1 border rounded-lg"
            >
              Uplaod Image
            </Link>
          ) : (
            <Link
              to="/uploadimage"
              className="bg-red-200 p-1 border rounded-lg"
            >
              Upload Image
            </Link>
          )}
        </button>
      </h1>
      <div className="p-6">
        <div className="flex flex-col max-w-md mx-auto my-6 p-6 border rounded shadow-lg text-2xl">
          Tasks Covered Here:
          <ul className="list-disc ml-4 text-white/80">
            <li>Authentication</li>
            <li>User DashBoard</li>
            <li>User Functionality</li>
            <li>Admin DashBoard</li>
            <li>Admin UserControl</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
