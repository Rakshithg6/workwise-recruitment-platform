import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center">
              <span className="text-lg font-black text-black">WW</span>
            </div>
            <span className="text-2xl font-bold text-white">WorkWise</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
