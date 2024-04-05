import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import BaseLayout from "./layouts/BaseLayout";
import Test from "./pages/Test";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
