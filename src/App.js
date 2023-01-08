import {useEffect,useState} from 'react';
import './App.css';
import axios from 'axios';
import SelectTerm, {currentTerm} from './selectTerm';

const querystring = require('querystring');

function App() {
  //const KSHEN_CLIENT_ID = "f7c40db261574146a1341b89f2d76bfb";
  const CLIENT_ID = "0e54d22e40f44995a3b7d456f93ce9dc";

  const REDIRECT_URI = "http://localhost:3000/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = "user-read-private user-read-email user-top-read user-read-recently-played playlist-modify-private playlist-modify-public";
  const SHOW_DIALOG = true;

  const [token, setToken] = useState("")
  const [userID, setID] = useState("")
  const [userData, setUserData] = useState({})
  const [recents, setRecents] = useState([])
  const [favorites, setFavorites] = useState([])
  const [mins, setMins] = useState(null);
  const [secs, setSecs] = useState(null);
  const [playlistLink, setPlaylist] = useState("https://open.spotify.com/embed/album/2Yy84EeclNVwFDem6yIB2s?utm_source=generator");

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    if(hash){
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
      setToken(token);
      //getRecents(token);
    }
  }, [])

  const logout = () => {
    setToken("");
    setUserData({});
    setRecents([]);
    setFavorites([]);
    window.localStorage.removeItem("token");
  }

  const findUser = async (e) => {
  console.log("FindUser clicked!!!!!");
     // var div = document.getElementById('findButton');
     // div.style.display = 'none';
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    setUserData(data);
    setID(data.id);
  }

  const loadEverything = async (e) => {
  console.log("LoadEverything clicked!!!!!");
  getRecents(token);
  getFavorites(token, currentTerm);
 // console.log(currentTerm);
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

  const getRecents = async (token, terms) => {
    //https://api.spotify.com/v1/recommendations/available-genre-seeds
    const {data} = await axios.get("https://api.spotify.com/v1/me/player/recently-played", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    setRecents(data)
  }

  const renderRecent = () => {
    if(recents.length === 0){
      return;
    }
    else{
      let options = []
      for(let i=0; i<recents.items.length; i++){
        options.push({key: i, name: recents.items[i].track.name, artist: recents.items[i].track.artists[0].name})
      }
      return (
        <div>
          <label>Recently Listened</label><br></br>
          <select>
            {options.map(item => {
                return (<option key={item.key} value={item.key}>{item.name + " by "+ item.artist}</option>);
            })}
          </select>
        </div>
      )
    }
  }

  const getFavorites = async (token, terms) => {
      //https://api.spotify.com/v1/recommendations/available-genre-seeds
      const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks?time_range="+terms+"_term&limit=100", {
          headers: {
              Authorization: `Bearer ${token}`
          }
      })
      console.log(data);
      setFavorites(data)
    }


    const renderFavorites = () => {
    console.log("RenderFavorites called!!!");
      if(favorites.length === 0){
        return;
      }
      else{
        let options = []
        //let topTracks = []
        let favoritesInfo = []
        for(let i=0; i<favorites.items.length; i++){
          favoritesInfo.push({key:i, duration: Math.round(favorites.items[i].duration_ms/1000),
          uri: favorites.items[i].uri});
          console.log(favoritesInfo);

          options.push({key: i, name: favorites.items[i].name, artist: favorites.items[i].artists[0].name})
        }
        //let pickedSongs = generatePlaylist(1200, trackLengths);

        /*for(let i=0; i<favorites.items.length; i++){
           topTracks.push({key: i, duration: favorites.items[i].duration_ms,
           id: favorites.items[i].id, uri: favorites.items[i].uri, name: favorites.items[i].name})
        }*/
        return (
          <div>
            <label>Top Items</label><br></br>
            <select>
              {options.map(item => {
                  return (<option key={item.key} value={item.key}>{item.name + " by "+ item.artist}</option>);
              })}
            </select>

           <input
                     type="number"
                     value={mins}
                     placeholder="minutes"
                     min = "0" max = "59"
                     onChange={(e) => setMins(e.target.value)}
                   />
           <input
                     type="number"
                     value={secs}
                     placeholder="seconds"
                     min = "0" max = "59"
                     onChange={(e) => setSecs(e.target.value)}
                              />

            <button id="button3" onClick={() => createActualPlaylist(mins, secs, favoritesInfo)}> Create Playlist </button>

          </div>
        )
      }
    }

  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: RESPONSE_TYPE,
    redirect_uri: REDIRECT_URI,
    show_dialog: SHOW_DIALOG,
    scope: SCOPE
  });

  const generatePlaylist = (targetTime, songs) => {
      //let songs =
      const table = Array(songs.length+1).fill()
      .map(() => Array(targetTime+1).fill(false));

      for (let i = 0; i <= songs.length; i++) {
              table[i][0] = true;
          }

          for (let i = 1; i <= songs.length; i++) {
              for (let j = 1; j <= targetTime; j++) {
                  if (j - songs[i - 1] >= 0) {
                      table[i][j] = table[i - 1][j] || table[i - 1][j - songs[i - 1]];
                  } else {
                      table[i][j] = table[i-1][j];
                  }
              }
          }
          let currentCol = 0;

          for (let j = targetTime; j >= 0; j--){
              if (table[songs.length][j] !== false){
                  currentCol = j;
                  break;
              }
          }

          console.log("Closest time: " + currentCol);


          let currentRow = songs.length;
          let pickedSongs = [];


          while (currentCol > 0 && currentRow > 0){
              if (table[currentRow][currentCol - songs[currentRow - 1]]){
                  pickedSongs.push(currentRow-1);
                  currentCol -= songs[currentRow - 1];
                  currentRow--;
              }
              else if(currentCol > 0 && currentRow > 0 && (table[currentRow-1][currentCol])){
                  currentRow--;
              }
          }
          console.log(pickedSongs);
          return(pickedSongs);
  }

  const shuffle = (array) => {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

 const createActualPlaylist = async(mins, secs, tracks) => {
    if (mins > 59 || mins < 0 || secs < 0 || secs > 59){
    alert("Not valid time");
    return;
    }
 //UsableSongs should be an array with key=duration: value= song length in seconds,
 //key=uri: value = spotify URI of the track
    let usableSongs = shuffle(tracks);
    let time = 60 * Number(mins) + Number(secs);
    if (secs < 10) secs = '0'+secs;

     let trackLengths = [];
     for(let i=0; i<usableSongs.length; i++){
              trackLengths.push(usableSongs[i].duration);
      }

     let pickedSongs = generatePlaylist(time, trackLengths);

     if (pickedSongs.length === 0){
     alert("Time picked is too short!");
     return;
     }

     let pickedSongsString = usableSongs[pickedSongs[0]].uri;

     for (let i=1; i<pickedSongs.length; i++){
       pickedSongsString += ',';
       pickedSongsString += usableSongs[pickedSongs[i]].uri;
     }

     let payload = { name: 'Your ' + mins +':'+secs+' playlist',
     description: 'Generated with Musicglass', public: 'false' };

     const playlistRes = await axios.post("https://api.spotify.com/v1/users/"+userID+"/playlists", payload, {
                  headers: {
                      Authorization: `Bearer ${token}`
              }})

     let playlistData = playlistRes.data;
     let playlist_id = playlistData.id;
     setPlaylist("https://open.spotify.com/embed/album/"+playlist_id+"?utm_source=generator");
     console.log("PlaylistLink is: " + playlistLink);


     const addSongsRes = await axios.post("https://api.spotify.com/v1/playlists/"+playlist_id+"/tracks?uris="+pickedSongsString, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`
                    }})

     console.log(addSongsRes.data);
 }



  return (
    <div className="App">
        <header className="App-header">
            <h1>Music Glass</h1>
            {!token ?
                <a href={`${AUTH_ENDPOINT}?${queryParams}`}>Login
                    to Spotify</a>
                : <><button onClick={logout}>Logout</button>
                <SelectTerm />
                <button id="findUserButton" onClick={findUser}>Find User</button>
                <button id="loadInfoButton" onClick={loadEverything}>Load Information</button>
                <iframe src={playlistLink}
                                        width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        loading="lazy"></iframe></>
                }
                {renderRecent()}
                {renderFavorites()}
                {renderUser()}
        </header>
    </div>
  );
}

export default App;
