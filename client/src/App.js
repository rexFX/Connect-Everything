import { Route, Routes } from "react-router";
import PlayerLogic from "./components/playerlogic/playerlogic.component";

const App = () => {
  return (
    <Routes>
      <Route index element={<PlayerLogic />} />
    </Routes>
  );
};

export default App;