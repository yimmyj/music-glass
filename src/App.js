import logo from './logo.svg';
import './App.css';

function requestAuth(){
  let url = "https://accounts.spotify.com/authorize";
  url += "?client_id=f7c40db261574146a1341b89f2d76bfb";
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURI("http://localhost:3000/");
  url += "&show_dialog=true";
  url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
  window.location.href = url; // Show Spotify's authorization screen
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={requestAuth}>Request Auth</button>
      </header>
    </div>
  );
}

export default App;
