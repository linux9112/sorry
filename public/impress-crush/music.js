// Playlist definition
const playlist = [
  { id: 1, name: "-------------- 🌸 ", path: "music/1.mp3" },
  { id: 2, name: "-------------- 💕 ", path: "music/2.mp3" },
  { id: 3, name: "-------------- ⭐️ ", path: "music/3.mp3" }
];

let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio();

// Elements
const playPauseBtn = document.getElementById("play-pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const titleDisplay = document.getElementById("song-title");
const visualizerBars = document.querySelectorAll(".visualizer-bar");
const playlistItems = document.querySelectorAll(".playlist-item");

// SVG Icon templates
const playIcon = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
const pauseIcon = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

// Initialize player
function initPlayer() {
  loadTrack(currentTrackIndex);
  
  // Event Listeners for Controls
  playPauseBtn.addEventListener("click", togglePlay);
  prevBtn.addEventListener("click", playPrev);
  nextBtn.addEventListener("click", playNext);
  
  // Event listener for audio ended (go to next track but do not autoplay)
  audio.addEventListener("ended", () => {
    isPlaying = false;
    currentTrackIndex++;
    if (currentTrackIndex >= playlist.length) {
      currentTrackIndex = 0;
    }
    loadTrack(currentTrackIndex);
    playPauseBtn.innerHTML = playIcon;
    toggleVisualizer(false);
  });

  // Setup playlist items click handlers
  playlistItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (currentTrackIndex === index) {
        togglePlay();
      } else {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        playTrack();
      }
    });
  });
}

// Load track
function loadTrack(index) {
  audio.src = playlist[index].path;
  audio.load();
  titleDisplay.textContent = playlist[index].name;
  updatePlaylistUI(index);
}

// Play track
function playTrack() {
  audio.play()
    .then(() => {
      isPlaying = true;
      playPauseBtn.innerHTML = pauseIcon;
      toggleVisualizer(true);
      updatePlaylistUI(currentTrackIndex);
    })
    .catch(err => {
      console.log("Audio playback was blocked or failed:", err);
    });
}

// Pause track
function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.innerHTML = playIcon;
  toggleVisualizer(false);
}

// Toggle Play/Pause
function togglePlay() {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

// Play previous track
function playPrev() {
  currentTrackIndex--;
  if (currentTrackIndex < 0) {
    currentTrackIndex = playlist.length - 1;
  }
  loadTrack(currentTrackIndex);
  playTrack();
}

// Play next track
function playNext() {
  currentTrackIndex++;
  if (currentTrackIndex >= playlist.length) {
    currentTrackIndex = 0;
  }
  loadTrack(currentTrackIndex);
  playTrack();
}

// Toggle Visualizer bars
function toggleVisualizer(play) {
  visualizerBars.forEach(bar => {
    if (play) {
      bar.classList.add("playing");
    } else {
      bar.classList.remove("playing");
    }
  });
}

// Update active highlight in playlist
function updatePlaylistUI(activeIndex) {
  playlistItems.forEach((item, index) => {
    const statusEl = item.querySelector(".playlist-item-status");
    if (index === activeIndex) {
      item.classList.add("active");
      // Set status to playing or paused icon
      statusEl.textContent = isPlaying ? "🎵" : "⏸️";
    } else {
      item.classList.remove("active");
      statusEl.textContent = "";
    }
  });
}

// Watch audio state to ensure UI updates if played/paused externally
audio.addEventListener("play", () => {
  isPlaying = true;
  playPauseBtn.innerHTML = pauseIcon;
  toggleVisualizer(true);
  updatePlaylistUI(currentTrackIndex);
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  playPauseBtn.innerHTML = playIcon;
  toggleVisualizer(false);
  updatePlaylistUI(currentTrackIndex);
});

// Video Playlist Handler
function initVideoPlayer() {
  const videoPlayer = document.getElementById("video-player");
  const videoItems = document.querySelectorAll(".video-playlist-item");

  if (!videoPlayer || videoItems.length === 0) return;

  videoItems.forEach(item => {
    item.addEventListener("click", () => {
      // Remove active class from all items
      videoItems.forEach(btn => btn.classList.remove("active"));
      
      // Add active class to clicked item
      item.classList.add("active");
      
      // Update video source
      const videoSrc = item.getAttribute("data-video");
      const videoSourceElement = videoPlayer.querySelector("source");
      if (videoSourceElement) {
        videoSourceElement.src = videoSrc;
        videoPlayer.load();
        
        // Pause audio if it is playing
        pauseTrack();
        
        videoPlayer.play().catch(err => {
          console.log("Video playback blocked or failed:", err);
        });
      }
    });
  });

  // Pause audio when video starts playing
  videoPlayer.addEventListener("play", () => {
    pauseTrack();
  });
}

// Run initializer on load
document.addEventListener("DOMContentLoaded", () => {
  initPlayer();
  initVideoPlayer();
});
