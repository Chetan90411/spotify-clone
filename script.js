let currentSong = new Audio();

function secondsToMinutesAndSeconds(seconds) {
  let minutes = parseInt(seconds / 60);
  seconds = parseInt(seconds % 60);

  if(minutes === NaN || seconds === NaN){
    minutes = 0;
    seconds = 0;
  }

  return `${(minutes > 9) ? minutes : "0" + minutes}:${(seconds > 9) ? seconds : "0" + seconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track, pause = "false") => {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = "/songs/" + track;
  if(!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  // Get List of all the Songs
  let songs = await getSongs();
  playMusic(songs[0], true);

  // Show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
              <img class="invert" src="music.svg" alt="">
              <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Chetan</div>
              </div>
              <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="">
              </div>
    </li>`;
  }

  // Attach an event Listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  // Attach event listener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  // Listen for timeupdate Event
  currentSong.addEventListener('timeupdate', () => {
    console.log(currentSong.currentTime, secondsToMinutesAndSeconds(currentSong.duration))
    document.querySelector('.songtime').innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)}/${secondsToMinutesAndSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })

  // Add an event listener to the seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector('.circle').style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100;
  })
}

main();
