import { useEffect, useState } from 'react';
import './App.css'

function App() {
  const [ogLink, setOgLink] = useState("");
  const [tinyLink, setTinyLink] = useState("");
  const [displayTinyLink, setDisplayTinyLink] = useState(false)

  const shrink = async () => {
    let link = ogLink
    if (!ogLink.startsWith('http://') && !ogLink.startsWith('https://')) {
        link = 'https://' + ogLink;
    }
    console.log(ogLink);
    fetch('/.netlify/functions/createTinyLink?link='+link)
    .then(res => res.json())
    .then(data => {
      setTinyLink("https://tiny.nulldog.xyz/" + data);
      setDisplayTinyLink(true);
    })
  };

  const handleLinkField = (event) => {
    setOgLink(event.target.value);
  };

  return (
    <div>
      <h1>Shrink URL</h1>
      <h2>Free forever, links never expire!</h2>
      <br></br>
      <input type='text' id='ogLink' value={ogLink} onChange={handleLinkField} placeholder='Big link here'></input>
      {displayTinyLink && <h2>Your link: <a href={tinyLink}>{tinyLink}</a></h2>}
      <br></br>
      <button onClick={shrink}>Shrink</button>
      <br></br>
      <a href='https://github.com/spikest3r/URLShortener'>Source code</a>
      <p>Made by spikest3r</p>
    </div>
  );
}

export default App;
