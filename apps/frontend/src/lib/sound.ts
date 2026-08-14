// utils/sound.ts
let audio: HTMLAudioElement | null = null;

export function playMessageSound() {
  if (!audio) {
    audio = new Audio("/sounds/notification.mp3");
    audio.volume = 0.5;
  }
  audio.currentTime = 0;
  audio.play().catch(() => {});
}
