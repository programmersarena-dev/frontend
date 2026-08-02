import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-700">404</h1>
        <p className="text-2xl md:text-3xl text-gray-500 mt-4">Sahypa tapylmady</p>
        <p className="text-md md:text-lg text-gray-400 mt-2">Gözleýän sahypaňyz ýok.</p>
        <Link to="/" className="mt-6 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Baş sahypa
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
