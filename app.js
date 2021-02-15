const express = require('express')
const app = express()
const port = 3000
const fetch = require('node-fetch')
let apiKey = "yourlastfmapikeyhere"
let lastUsername = "unresisting"

app.get('/track', (req, res) => {
    fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastUsername}&api_key=${apiKey}&format=json`).then(resp => resp.json()).then(json => {
        if (json.recenttracks.track[0]["@attr"]) {
            res.setHeader('Content-type', 'text/html')
            res.status(200)
            res.send(`<html>
<head><meta charset="utf-8">
	<title>Spotify Status</title>
	<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" /><script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
</head>
<body>
<div>
<h1 id="songData" data-aos="fade-up"><img src="${json.recenttracks.track[0].image[3]["#text"]}"><br></br>${json.recenttracks.track[0].name}<span id="thing">${json.recenttracks.track[0].artist["#text"]}</span></h1>
</div>
<style type="text/css">div{ background:black;
         height: 100%;
         width: 100%;
             text-align: center;
         vertical-align:middle; 
         display:table;}
         h1{
         font-size: 3em;
         font-family: 'Source Sans Pro', sans-serif !important;
         font-weight: 700; display:table-cell; 
         color:#1DB954;
         vertical-align:middle; 
         text-align:center;
         }
         span{
         display:block;
         margin-top: 10px;
         color:white;
         font-size:16px
         }
         body{background:black; margin: 0; height: 100%; overflow: hidden}
</style>
<script>
         AOS.init();
</script>
<script>
setInterval(()=>{
    fetch('/api/trackStatus').then(resp=>resp.json()).then((json)=>{
        console.log(json.isPlaying)
        if(json.isPlaying == true){
            if(document.querySelector("#songData").textContent.includes(json.name) == false){
                             new Audio('https://sythe.app/noti.mp3').play();
            }
            document.getElementById('songData').innerHTML = `
            <img src="${json.img}"><br></br>${json.name}<span id="thing">${json.artist}</span>`
        }
    })
}, 5000)
</script>
</body>
</html>`)
        } else {
            res.status(200)
            res.send('Not playing anything!')
        }
    })
})

app.get('/api/trackStatus', (req, res) => {
    fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastUsername}&api_key=${apiKey}&format=json`).then(resp => resp.json()).then(json => {
        if (json.recenttracks.track[0]["@attr"]) {
            res.json({
                'isPlaying': true,
                "name": `${json.recenttracks.track[0].name}`,
                "img": `${json.recenttracks.track[0].image[3]["#text"]}`,
                "artist": `${json.recenttracks.track[0].artist["#text"]}`
            })
        } else {
            res.json({
                "isPlaying": false
            })
        }
    })
})

app.set('trust proxy', true)


app.listen(port, () => {
    console.log(`Spotify-lastfm initialized @ http://localhost:${port}`)
})
