import Game2048 from "./components/Game2048.jsx";
import Footer from "./Footer";

export default function App() {
  return (
    <div className="App">
      <div className="game-container">
        <Game2048 />
      </div>
      <Footer />
    </div>
  );
}