import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

const PdfViewer = ({ file }) => {
  const { __ } = useTranslation();
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setFileUrl(null);
      return;
    }

    const url = typeof file === 'string' ? file : URL.createObjectURL(file);
    setFileUrl(url);

    return () => {
      if (typeof file !== 'string') {
        URL.revokeObjectURL(url);
      }
    };
  }, [file]);

  if (!file) {
    return <div className="p-4 text-slate-500">{__("problem.loading-pdf")}</div>;
  }

  return (
    <div className="w-full h-[700px] border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {fileUrl && (
        <embed
          src={fileUrl}
          type="application/pdf"
          width="100%"
          height="100%"
          className="w-full h-full"
        />
      )}
    </div>
  );
};

export default PdfViewer;