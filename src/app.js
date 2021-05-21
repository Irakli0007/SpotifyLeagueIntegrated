const util = require("util")
const exec = util.promisify(require('child_process').exec)
const app = require('electron')
const BrowserWindow = require('electron').remote.BrowserWindow
const { Http2ServerRequest } = require("http2")
const https = require('https')
const nfetch = require('node-fetch')

async function getData() {
    const { stdout, stderr } = await exec("wmic PROCESS WHERE name='LeagueClientUx.exe' GET commandline")
    // console.log('stout:', stdout)
    // console.log('stderr:', stderr)
    let regexp = /--app-port=([0-9]*)/
    let regexp2 = /--remoting-auth-token=([\w-_]*)/
    var str = stdout.match(regexp)
    var str2 = stdout.match(regexp2)
    return [str[1], str2[1]]
}

var leagueAPIReturn = ""

async function callLocalLeagueApi(port, password, endpoint) {
    var url = "https://127.0.0.1:" + port + endpoint
    const agent = new https.Agent({rejectUnauthorized:false})
    await nfetch(url, {
        method: "GET",
        headers: {
            Authorization: "Basic " + Buffer.from("riot:" + password).toString('base64'),
        },
        agent:agent
    }).then(async (result) => {
        result.json().then(async (data) => {
            leagueAPIReturn = data
        })
    })
}

async function getSpotifyToken() {
    var redirect_uri = "http://localhost/callback"
    var spotifyURL = `https://accounts.spotify.com/authorize?client_id=1313a38061744d86a9537ef2bd563767&redirect_uri=${redirect_uri}&response_type=token&state=123&scope=user-read-private%20user-read-email%20user-top-read%20user-read-playback-state%20user-modify-playback-state`
    const authWindow = window.open(spotifyURL, "Spotify Auth", "top=600,left=800,frame=true,nodeintegration=no")
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            BrowserWindow.getAllWindows()[0].webContents.on('did-redirect-navigation', function(event, url) {
                var access_token = url.split("#access_token=").pop().split("&token_type=")[0]
                authWindow.close()
                resolve(access_token)
            })
        }, 1000)
    })
}

spotifyApiDeviceDataReturn = ""

async function playSpotify() {
    var endpoint = "https://api.spotify.com/v1/me/player/play"
    await fetch(endpoint, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${spotifyToken}`,
        },
        body: JSON.stringify({
            "uris": ["spotify:track:4bcMxSXijaZ9cGXynsRD3I"],
            "position_ms": 125000
        }),
    }).then(async (result) => {
        console.log(result)
    })
}

var spotifyToken = ""
var leagueData = []

document.getElementById("loginBtn").addEventListener("click", async () => {
    var token = await getSpotifyToken()
    var data = await getData()
    spotifyToken = token
    leagueData = data

    //getData().then(result => callLocalLeagueApi(result[0], result[1], "/lol-summoner/v1/current-summoner"))
    //getData().then(result => callLocalLeagueApi(result[0], result[1], "/lol-match-history/v1/recently-played-summoners"))
    //getData().then(result => callLocalLeagueApi(result[0], result[1], "/lol-lobby/v2/lobby/members"))
    //getData().then(result => callLocalLeagueApi(result[0], result[1], "/lol-champ-select/v1/current-champion"))
})

document.getElementById("listenBtn").addEventListener("click", async () => {
    if (leagueData[0] != undefined && leagueData[1] != undefined) {
        var poll = setInterval(async () => {
            await callLocalLeagueApi(leagueData[0], leagueData[1], "/lol-champ-select/v1/current-champion")
            //leagueAPIReturn = 105 //remove this later
            if(leagueAPIReturn == 105) {
                clearInterval(poll)
                await playSpotify()
            }
        }, 1000);
    }
    else {
        console.log("login first")
    }
})
