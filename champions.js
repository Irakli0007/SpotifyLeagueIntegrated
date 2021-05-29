var readFile = function(path) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null);
    return request.responseText;
}

var text = readFile("champions.txt")
var champions = JSON.parse(text)

// for(const [key, value] of Object.entries(champions.data)) {
//     var btn = document.createElement("BUTTON") 
//     btn.innerHTML = value.name
//     btn.id = key + "_btn"
//     document.body.appendChild(btn)
//     document.getElementById(key + "_btn").addEventListener("click", async () => {
//         console.log(key + " clicked!")
//     })
// }



// document.getElementById("backBtn").addEventListener("click", async () => {
//     window.location.pathname = "D:\\Github\\SpotifyLeagueIntegration\\src\\index.html"
// })
