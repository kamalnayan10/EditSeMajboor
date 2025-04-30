import "./App.css";
import Header from "./components/Header";
import Main from "./components/Main";

function App() {
  return (
    <div className="h-screen bg-white-pink flex justify-start items-center flex-col font-roboto text-white">
      <Header />
      <Main />
    </div>
  );
}

export default App;
