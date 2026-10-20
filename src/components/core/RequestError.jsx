import PropTypes from 'prop-types';
import { useTranslation } from '@/contexts/TranslationContext';

export default function RequestError({ onRetry }) {
  const { __ } = useTranslation();
  return (
    <div role="alert" className="mx-auto my-10 max-w-md rounded-2xl border border-rose-100 bg-rose-50/50 p-6 text-center">
      <p className="text-sm text-slate-700">{__('common.load_error')}</p>
      <button type="button" onClick={onRetry} className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm ring-1 ring-indigo-100 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500">
        {__('common.retry')}
      </button>
    </div>
  );
}

RequestError.propTypes = { onRetry: PropTypes.func.isRequired };
