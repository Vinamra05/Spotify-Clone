let audio = new Audio();
let currentSong = '';
let pause = true;
let songs = [];

let folder;


let playerBtn = document.querySelector(".play");
let songname = document.querySelector(".songname");
let cardcontainer = document.querySelector(".cardcontainer");

async function displayCard() {

    let a = await fetch("/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    Array.from(as).forEach(async (e) => {
        // console.log(e)
        if (e.href.includes("/songs/")) {
            let fold = e.href.split("/songs/")[1]
            // console.log(fold)

            let a = await fetch("/songs/" + fold + "info.json");
            // console.log(a)
            let res = await a.json();
            // console.log(res)
            cardcontainer.innerHTML += `<div data-folder="${fold}" class="card">
            <div><img src="${res.imgurl}" alt=""></div>
            <h3>${res.name}</h3>
            <p>${res.desc}</p>
        </div>`
        }
    });


}




async function getsongs(lib) {
    songs = []; // ek baar phle khaali krna hoga fr push krenge isme 

    let a = await fetch(`/songs/${lib}`);
   
    let response = await a.text();
   
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");


    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(lib + "/")[1]);
        }
    }



    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ``
    for (const song of songs) {

        songUL.innerHTML += `
    <li onclick="playSong('${song}')">
                                <img  class="invert"  src="assets/music.svg" alt="">
                                <div class="info">
                                    <div>${song.replaceAll("%20", " ")}</div>
                                </div>
                                <div id="${song}"  class="playnow">
                                    <span>Play Now</span>
                                    <img  src="assets/playbtn.svg" class="invert" alt="">
                                </div>
                            </li>`;
    }

    return songs;
}



function playSong(e) {


    if (currentSong) {
        let playnow = document.getElementById(currentSong)

        if (playnow) {
            playnow.getElementsByTagName("span")[0].innerText = `Play Now`
            pause = true;
            playnow.getElementsByTagName("img")[0].src = "assets/playbtn.svg"
        }
    }

    currentSong = e;
    // console.log(e)
    audio.src = 'songs/' + folder + "/" + e;
    // console.log(audio.src)
    let playnow = document.getElementById(currentSong)

    playnow.getElementsByTagName("span")[0].innerText = `Playing...`
    playnow.getElementsByTagName("img")[0].src = "assets/pausebtn.svg"
    playerBtn.innerHTML = `<span class="material-symbols-outlined">
      pause_circle
      </span>`
    audio.play()
    pause = false;
    songname.innerText = currentSong.replaceAll("%20", " ")

    let currelm = document.querySelector(".current");
    let durelm = document.querySelector(".totalduration");
    let ball = document.querySelector(".ball");
    let seekbar = document.querySelector(".seekbar");

    audio.addEventListener("timeupdate", () => {
        let dur = audio.duration;
        let currTime = audio.currentTime;
        currelm.innerText = `${secondsToMinutesSeconds(currTime)}`;
        durelm.innerText = `${secondsToMinutesSeconds(dur)}`
      

        ball.style.left = currTime * 100 / dur + "%";

        seekbar.addEventListener("click", (e) => {

            let currDur = (e.offsetX * 100 / e.target.offsetWidth) * audio.duration / 100; 
            // console.log(currDur)
            audio.currentTime = currDur


        })
    })


    myRange.addEventListener("click", (e) => {

        let vol = e.offsetX / e.target.offsetWidth;


        audio.volume = vol >= 0 && vol <= 1 ? vol : 0;
        if (vol > 1) audio.volume = 1


        if (vol <= 0) {
            bhopu.innerHTML = `<span class="material-symbols-outlined">
            volume_off
            </span>`
        } else {
            bhopu.innerHTML = `<span class="material-symbols-outlined">
            volume_up
            </span>`
        }
    })

    bhopu.addEventListener("click", () => {
        audio.volume = 0;
        bhopu.innerHTML = `<span class="material-symbols-outlined">
        volume_off
        </span>`

        if (audio.volume == 0) {
            bhopu.addEventListener("click", () => {
                bhopu.innerHTML = `<span class="material-symbols-outlined">
                volume_up
                </span>`
                audio.volume = 1;
            })
        }

    })


}



const secondsToMinutesSeconds = (time) => {
    if (isNaN(time))
        return "00:00"
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    return min + ":" + sec;
}



async function main() {
    await displayCard();

    folder = "ArijitSingh"
    let songs = await getsongs(folder);
    // console.log(songs) 

    // currentSong=songs[0];
    // audio.src=`/songs/${folder}/${currentSong}`;



    forward.addEventListener("click", () => {
        let ind = songs.indexOf(currentSong);
        playSong(songs[(ind + 1) % songs.length])


    });
    backward.addEventListener("click", () => {
        let ind = songs.indexOf(currentSong);
        ind = ind - 1 < 0 ? songs.length - 1 : ind - 1;
        playSong(songs[ind])
    });

    playerBtn.addEventListener("click", () => {

        if (!currentSong) {
            playSong(songs[0]);

        }
        else if (!pause) {
            audio.pause();
            pause = true;
            playerBtn.innerHTML = `<span class="material-symbols-outlined">
        play_circle
      </span>`
            let playnow = document.getElementById(currentSong)
            playnow.getElementsByTagName("span")[0].innerText = `Play Now`

            playnow.getElementsByTagName("img")[0].src = "assets/playbtn.svg"
        } else {
            if (currentSong) {
                audio.play();
                pause = false;
                playerBtn.innerHTML = `<span class="material-symbols-outlined">
        pause_circle
      </span>`
                let playnow = document.getElementById(currentSong)

                playnow.getElementsByTagName("span")[0].innerText = `Playing...`
                playnow.getElementsByTagName("img")[0].src = "assets/pausebtn.svg"
                playerBtn.innerHTML = `<span class="material-symbols-outlined">
      pause_circle
      </span>`
            }

        }

    });

    let cards = document.querySelectorAll(".card");

    Array.from(cards).forEach((i) => {
        i.addEventListener("click", async (e) => {

            folder = (e.currentTarget.dataset.folder).split("/")[0];
            // console.log(folder)

            songs = await getsongs(folder);
            // console.log(songs)
            playSong(songs[0]);

        })
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        // console.log("open")
        document.querySelector(".left").style.left = `0%`;

    });

    // add an event listener for closing hamburger
    document.querySelector(".bandkaro").addEventListener("click", () => {
        // console.log("bandkaro")
        document.querySelector(".left").style.left = `-140%`;
    });






}
main();





