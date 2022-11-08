import {useEffect,useState} from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const CLIENT_ID = "f7c40db261574146a1341b89f2d76bfb";
  const REDIRECT_URI = "http://localhost:3000/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SHOW_DIALOG = true;

  const [token, setToken] = useState("")
  const [userData, setUserData] = useState({})
  const [genres, setGenres] = useState([])

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    if(hash){
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
      setToken(token);
      getGenres(token);
    }
  }, [])

  const logout = () => {
    setToken("");
    setUserData({});
    setGenres([]);
    window.localStorage.removeItem("token");
  }

  const findUser = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    setUserData(data);
    console.log(data);
  }

  const renderUser = () => {
    if(Object.keys(userData).length === 0){
      return;
    }
    else
      return (
        <div>
          <p>
            Display Name: {userData["display_name"]}
          </p>
          <p>
            <img src={userData["images"][0]["url"]} alt="pfp"/>
          </p>
        </div>
      );
  }

  const getGenres = async (token) => {
    const {data} = await axios.get("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    setGenres(data["genres"])
  }

  const renderGenres = () => {
    if(genres.length === 0){
      return;
    }
    else{
      let options = []
      for(let i=0; i<genres.length; i++){
        options.push({value: "value-"+i, text: genres[i]})
      }
      return (
        <div>
          <label>Genre List</label><br></br>
          <select>
            {options.map(item => {
                return (<option key={item.value} value={item.value}>{item.text}</option>);
            })}
          </select>
        </div>
      )
    }
  }

  return (
    <div className="App">
        <header className="App-header">
            <h1>Music Glass</h1>
            {!token ?
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&show_dialog=${SHOW_DIALOG}`}>Login
                    to Spotify</a>
                : <button onClick={logout}>Logout</button>}
            <button disabled={!token} onClick={findUser}>Find User</button>
            {renderGenres()}
            {renderUser()}
        </header>
    </div>
  );
}

export default App;
