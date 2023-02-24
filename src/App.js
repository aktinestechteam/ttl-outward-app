import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import UserStore from './UserStore';

function App() {
  const store = new UserStore()
  return (
    <div className="App">
      <Home  store={store}/>
    </div>
  );
}

export default App;
