
export default function RenderHTML(data) {
  const container = document.getElementById("root");
  const root = ReactDOM.createRoot(container);

  return root.render(data);
}
