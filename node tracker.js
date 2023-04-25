import fetch from 'node-fetch';
import Lastfm from 'simple-lastfm';
var GetOptions = {method: 'GET',redirect: 'follow'};
var osu_key = "OSU API V1 KEY";
var user = "OSU USER ID";
var lastfm_key = "LASTFM KEY"
var lastfm_secret = "LASTFM SECRET"
var lastfm_username = "LASTFM USERNAME"
var lastfm_password = "LASTFM PASSWORD"
var lastdate = "0";
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
            fetch("https://osu.ppy.sh/api/get_user_recent?k=" + osu_key + "&u=" + user + "&type=id", GetOptions)
                .then(response => response.text())
                .then(result => {
                    if (!JSON.parse(result)[0]) {
                        console.log("user has no recent scores")
                        lastdate = "1";
                    }
                    else {
                        if (lastdate != JSON.parse(result)[0].date && lastdate != "0") {
                            if (JSON.parse(result)[0].rank != "F") {
                                fetch("https://osu.ppy.sh/api/get_beatmaps?k=" + osu_key + "&b=" + JSON.parse(result)[0].beatmap_id, GetOptions)
                                    .then(response2 => response2.text())
                                    .then(result2 => {
                                        var artist = !JSON.parse(result2)[0].artist_unicode ? JSON.parse(result2)[0].artist : JSON.parse(result2)[0].artist_unicode;
                                        var title = !JSON.parse(result2)[0].title_unicode ? JSON.parse(result2)[0].title : JSON.parse(result2)[0].title_unicode;
                                        console.log("scrobbling: ",artist," - ", title);
                                        lastfm.scrobbleTrack({
                                            artist: artist,
                                            track: title,
                                            callback: function (result) {
                                                console.log("successfully scrobbled: ", artist, " - ", title);
                                            }
                                        });
                                    })
                                    .catch(error2 => console.log('error', error2));
                            }

                        } else console.log("no new plays");
                        lastdate = JSON.parse(result)[0].date;

                    }
                })
                .catch(error => console.log('error', error));
        }, 10000);
    } else {
        console.log("Error: " + session_result.error);
    }
});






