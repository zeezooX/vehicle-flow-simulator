import Select from "./pages/Select";
import Simulate from "./pages/Simulate";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route path="select" element={<Select />} />
        <Route path="simulate/:lat/:lng" element={<Simulate />} />
        <Route path="*" element={<Navigate to="/select" />} />
        <Route index element={<Navigate to="/select" />} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
