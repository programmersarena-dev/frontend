const PdfViewer = ({ file }) => (
  <div>
    <embed src={`data:application/pdf;base64,${file}`} type="application/pdf" width="100%" height="700px" />
  </div>
);

export default PdfViewer;
