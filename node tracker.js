import fetch from 'node-fetch';
import Lastfm from 'simple-lastfm';

const user = "OSU USER ID";
const lastfm_key = "LASTFM KEY"
const lastfm_secret = "LASTFM SECRET"
const lastfm_username = "LASTFM USERNAME"
const lastfm_password = "LASTFM PASSWORD"

var lastid = "0";
var lastfm = new Lastfm({
    api_key: lastfm_key,
    api_secret: lastfm_secret,
    username: lastfm_username,
    password: lastfm_password
});

lastfm.getSessionKey(function (session_result) {
    console.log("lastfm session established");
    if (session_result.success) {
        setInterval(() => {
            fetch("https://osu.ppy.sh/users/"+user+"/extra-pages/historical", { method: 'GET', redirect: 'follow' })
                .then(response => response.text())
                .then(result => {
                    var historical = JSON.parse(result)
                    if (historical.recent.count == 0) {
                        console.log("user has no recent scores")
                        lastid = "1";
                    } else {
                        if (lastid != historical.recent.items[0].id && lastid != "0") {
                            let artist = historical.recent.items[0].beatmapset.artist_unicode;
                            let title = historical.recent.items[0].beatmapset.title_unicode;
                            lastfm.scrobbleTrack({
                                artist: artist,
                                track: title,
                                callback: function (result) {
                                    console.log("successfully scrobbled: ", artist, " - ", title);
                                }
                            });
                        }else console.log("no new plays");
                        lastid = historical.recent.items[0].id;
                    }
                })
                .catch(error => console.log('error', error));
        }, 30000);
    } else {
        console.log("Error: " + session_result.error);
    }
});
