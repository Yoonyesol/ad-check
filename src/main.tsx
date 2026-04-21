import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// async function prepare() {
//   if (import.meta.env.DEV) {
//     const { worker } = await import("./mocks/browser");
//     return worker.start({
//       onUnhandledRequest: "bypass",
//       serviceWorker: {
//         url: "/mockServiceWorker.js",
//       },
//     });
//   }
// }

// prepare().then(() => {
//   createRoot(document.getElementById("root")!).render(<App />);
// });

createRoot(document.getElementById("root")!).render(<App />);
