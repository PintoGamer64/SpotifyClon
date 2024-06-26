import { INITIALPROPS_PLAYER, INITIALPROPS_QUEUE, SongProps, controls } from "@types"

export function formatTime(time: number) {
  if (time == null) return `0:00`

  const seconds = Math.floor(time % 60)
  const minutes = Math.floor(time / 60)

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function getDominantColor(imageUrl: string, transparency?: number): Promise<string> {
  return new Promise((resolve, reject) => {
    let imgEl = new Image();
    imgEl.src = imageUrl;
    imgEl.crossOrigin = "Anonymous";

    imgEl.onload = function () {
      let canvas = document.createElement('canvas');
      canvas.width = imgEl.width;
      canvas.height = imgEl.height;

      let ctx = canvas.getContext('2d')!;
      if (!ctx) {
        reject('No se pudo obtener el contexto 2D del canvas');
      }

      ctx.drawImage(imgEl, 0, 0, imgEl.width, imgEl.height);

      let data = ctx.getImageData(0, 0, imgEl.width, imgEl.height).data;
      let r = data[0];
      let g = data[1];
      let b = data[2];

      if (transparency) {
        resolve('rgba(' + (r < 100 ? r + 50 : r) + ',' + (g < 100 ? g + 50 : g) + ',' + (b < 100 ? b + 50 : b) + ',' + transparency + '%)');
        } else {
        resolve('rgb(' + (r < 100 ? r + 50 : r) + ',' + (g < 100 ? g + 50 : g) + ',' + (b < 100 ? b + 50 : b) + ')');
      }
    }
  });
}

export function createMetaDataPlayer(PlayerState: INITIALPROPS_PLAYER, QueueState: INITIALPROPS_QUEUE, playAudio: () => void, pauseAudio: () => void, handleNextSong: (QueueList: SongProps[], PlaylistQueue: SongProps[], PlaylistID: string | number) => void, handlePreviusSong: () => void) {

  const { Title, Artist, Album, imageURL } = PlayerState.Data;

  if (Title && Artist && Album && imageURL) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: Title,
      artist: Artist[0].Name,
      album: Album.Name,
      artwork: [
        {
          src: imageURL,
          sizes: "192x192",
          type: "image/png"
        }
      ]
    });
    navigator.mediaSession.setActionHandler("play", playAudio);
    navigator.mediaSession.setActionHandler("pause", pauseAudio);
    navigator.mediaSession.setActionHandler("previoustrack", handlePreviusSong);
    navigator.mediaSession.setActionHandler("nexttrack", () => handleNextSong(QueueState.QueueList, QueueState.PlaylistQueue, QueueState.PlaylistID));
  }

}

export function WindowControls() {
    // @ts-ignore: Unreachable code error
    if (window.controls !== undefined) {
        // @ts-ignore: Unreachable code error
        const { Maximize, Minimize, Close }: controls = window.controls

        return {
            MaximizeWindow: Maximize,
            MinimizeWindow: Minimize,
            CloseWindow: Close
        }
    } else {
        return {
            MaximizeWindow: () => { }
        }
    }
}