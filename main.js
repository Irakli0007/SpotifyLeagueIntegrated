const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
var url = require('url')
require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
})
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const https = require('https')
const agent = new https.Agent({ rejectUnauthorized:false })
const fetch = require('node-fetch')
const fs = require('fs')

const isDevelopment = process.env.NODE_ENV !== 'production'

function createWindow () {
   const win = new BrowserWindow({
    width: 1700,
    height: 1200,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      preload: path.join(__dirname, '/preload.js')
    },
  })

  win.loadURL(
    "http://localhost:8080"
    // url.format({
    //   pathname: path.join(__dirname, `./dist/index.html`),
    //   protocol: "file:",
    //   slashes: true
    // })
  );
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

ipcMain.on("LoginToSpotifyWindow", (event, arg) => {
  if (BrowserWindow.getAllWindows().length == 1) {
    new BrowserWindow({
      width: 600,
      height: 400,
      x: 1400,
      y: 800,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
      },
    })
  } 
  const win2 = BrowserWindow.getAllWindows()[0]
  win2.loadURL(arg)
  var wait = setInterval(() => {
    var currentURL = win2.webContents.getURL()
    win2.webContents.on('did-redirect-navigation', function(event2, url) {
      clearInterval(wait)
      event.reply("CloseSpotifyLoginWindow", url.split("#access_token=").pop().split("&token_type=")[0]) 
      win2.close()
    })
    if (currentURL.startsWith("http://localhost/callback")) {
      clearInterval(wait)
      event.reply("CloseSpotifyLoginWindow", currentURL.split("#access_token=").pop().split("&token_type=")[0]) 
      win2.close()
    }
  }, 1000)
})

ipcMain.on("GetLeagueClientData", async (event, arg) => {
  const { stdout, stderr } = await exec(arg)
  console.log('stout:', stdout)
  console.log('stderr:', stderr)
  let regexp = /--app-port=([0-9]*)/
  let regexp2 = /--remoting-auth-token=([\w-_]*)/
  var str = stdout.match(regexp)
  var str2 = stdout.match(regexp2)
  event.reply("ReturnLeagueClientData", [str[1], str2[1]])
})

ipcMain.on("CallLeagueApi", async (event, arg) => {
  await fetch(arg.Url, {
    method: "GET",
    headers: {
      Authorization: "Basic " + Buffer.from("riot:" + arg.password).toString('base64'),
    },
    agent:agent
  }).then(async (result) => {
    result.json().then(async (data) => {
      event.reply("ReturnCallLeagueApi", data)
    })
  })
})

ipcMain.on("SaveMusicToChampion", async (event, arg) => {
  try {
    if (!fs.existsSync('./static/ChampionSongMapping.txt')) {
      fs.readFile('./static/blank_champions.txt', 'utf-8', function(err, data) {
        if (err) {
          throw err
        }
        var championMapping = JSON.parse(data.toString())
        if (arg.method == "song") {
          championMapping[arg.champion].Songs = arg.music
        }
        else if (arg.method == "playlist") {
          championMapping[arg.champion].Playlist = arg.music
        }
        fs.writeFile('./static/ChampionSongMapping.txt', JSON.stringify(championMapping, null, 2), function (err) {
          if (err) {
            throw err
          }
        })
      })
    }
    else {
      fs.readFile('./static/ChampionSongMapping.txt', function(err, data) {
        if (err) {
          throw err
        }
        var championMapping = JSON.parse(data.toString())
        if (arg.method == "song") {
          championMapping[arg.champion].Songs = arg.music
        }
        else if (arg.method == "playlist") {
          championMapping[arg.champion].Playlist = arg.music
        }
        fs.writeFile('./static/ChampionSongMapping.txt', JSON.stringify(championMapping, null, 2), function (err) {
          if (err) {
            throw err
          }
        })
      })
    }
  }
  catch(e) {
    console.log(e)
  }
  event.reply("ReturnSaveMusicToChampion", true)
})

ipcMain.on("GetCurrentMapping", async (event, arg) => {
  try {
    if (!fs.existsSync('./static/ChampionSongMapping.txt')) {
      var ret = []
      event.reply("ReturnCurrentMapping", ret)
    }
    else {
      fs.readFile('./static/ChampionSongMapping.txt', function(err, data) {
        if (err) {
          throw err
        }
        var championMapping = JSON.parse(data.toString())
        var ret = championMapping[arg.champion].Songs
        event.reply("ReturnCurrentMapping", ret)
      })
    }
  }
  catch(e) {
    console.log(e)
  }
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})




