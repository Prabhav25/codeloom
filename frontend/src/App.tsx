import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home.tsx";
import { Builder } from "./pages/Builder.tsx";
// import { parseXml } from "./steps";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
