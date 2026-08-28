import { Link } from 'react-router-dom';
import { useTranslation } from '@/contexts/TranslationContext';

const NotFound = () => {
  const { __ } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-700">404</h1>
        <p className="text-2xl md:text-3xl text-gray-500 mt-4">{__("core.not_found.title")}</p>
        <p className="text-md md:text-lg text-gray-400 mt-2">{__("core.not_found.description")}</p>
        <Link to="/" className="mt-6 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          {__("core.not_found.home")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
