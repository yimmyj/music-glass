import {useEffect,useState} from 'react';
import './App.css';
import axios from 'axios';

// const redirect_uri = "http://localhost:3000/";
// const client_id = "f7c40db261574146a1341b89f2d76bfb";
// const client_secret = "0c40d7bdae54488f834880e795c27f9c";
// var access_token = null;
// var refresh_token = null;

// function requestAuth(){
//   let url = "https://accounts.spotify.com/authorize";
//   url += "?client_id="+client_id;
//   url += "&response_type=code";
//   url += "&redirect_uri=" + encodeURI(redirect_uri);
//   url += "&show_dialog=true";
//   url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
//   window.location.href = url; // Show Spotify's authorization screen
// }

// function onLoad(){
//   if (window.location.search.length > 0){
//     handleRedirect();
//   }
// }

// function handleRedirect(){
//   let code = getCode();
//   console.log(code);
//   fetchAccessToken( code );
//   window.history.pushState("", "", redirect_uri); // remove param from url
// }

// function fetchAccessToken( code ){
//   let body = "grant_type=client_credentials";
//   body += "&code=" + code; 
//   body += "&redirect_uri=" + encodeURI(redirect_uri);
//   body += "&client_id=" + client_id;
//   body += "&client_secret=" + client_secret;
//   callAuthorizationApi(body);
// }

// function callAuthorizationApi(body){
//   let xhr = new XMLHttpRequest();
//   xhr.open("POST", "https://accounts.spotify.com/api/token", true);
//   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//   xhr.setRequestHeader('Authorization', 'Basic ' + new Buffer(client_id + ':' + client_secret).toString('base64'));
//   xhr.send(body);
//   xhr.onload = handleAuthorizationResponse;
// }

// function handleAuthorizationResponse(){
//   if ( this.status === 200 ){
//       var data = JSON.parse(this.responseText);
//       data = JSON.parse(this.responseText);
//       console.log(data);
//       getUser(data["access_token"]);
//       if ( data.access_token !== undefined ){
//           access_token = data.access_token;
//           localStorage.setItem("access_token", access_token);
//       }
//       if ( data.refresh_token !== undefined ){
//           refresh_token = data.refresh_token;
//           localStorage.setItem("refresh_token", refresh_token);
//       }
//       onLoad();
//   }
//   else {
//       console.log(this.responseText);
//       alert(this.responseText);
//   }
// }

// function getUser(token){
//   console.log(token);
//   let xhr = new XMLHttpRequest();
//   xhr.open("GET", "https://api.spotify.com/v1/me", true);
//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.setRequestHeader('Authorization', 'Bearer ' + token);
//   xhr.send();
//   xhr.onload = handleUserResponse;
// }

// function handleUserResponse(){
//   if ( this.status === 200 ){
//       var data = JSON.parse(this.responseText);
//       data = JSON.parse(this.responseText);
//       console.log(data);
//       onLoad();
//   }
//   else {
//       console.log(this.responseText);
//       alert(this.responseText);
//   }
// }

// function getCode(){
//   let code = null;
//   const queryString = window.location.search;
//   if ( queryString.length > 0 ){
//       const urlParams = new URLSearchParams(queryString);
//       code = urlParams.get('code')
//   }
//   return code;
// }

// function callApi(method, url, body, callback){
//   let xhr = new XMLHttpRequest();
//   xhr.open(method, url, true);
//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
//   xhr.send(body);
//   xhr.onload = callback;
// }

function App() {
  const CLIENT_ID = "f7c40db261574146a1341b89f2d76bfb";
  const REDIRECT_URI = "http://localhost:3000/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")
  const [userData, setUserData] = useState({}) 

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    if(!token && hash){
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
      setToken(token);
    }
  }, [])

  const logout = () => {
    setToken("");
    setUserData({});
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
    return (
      <div>
        <p>
          Display Name: {userData["display_name"]}
        </p>
        <p>
          <img src={userData["images"] ? userData["images"][0]["url"] : "//:0"} alt="pfp"/>
        </p>
      </div>
    )
  }

  return (
    <div className="App">
        <header className="App-header">
            <h1>Music Glass</h1>
            {!token ?
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                    to Spotify</a>
                : <button onClick={logout}>Logout</button>}
            <button disabled={!token} onClick={findUser}>Find User</button>
            {renderUser()}
        </header>
    </div>
  );
}

export default App;
