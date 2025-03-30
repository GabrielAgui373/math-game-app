import { useEffect, useRef, useState } from "react";

type SoundOptions = {
  volume?: number;
  playbackRate?: number;
};

const useSound = (soundFile: string, options: SoundOptions = {}) => {
  const { playbackRate = 1, volume = 1 } = options;
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    //audio instance
    soundRef.current = new Audio(soundFile);
    const audio = soundRef.current;

    audio.volume = volume;
    audio.playbackRate = playbackRate;
    audio.preload = "auto";

    const handleCanPlay = () => setIsLoaded(true);
    const handleError = () =>
      console.error(`Erro ao carregar o arquivo: ${soundFile}`);

    audio.addEventListener("canplaythrough", handleCanPlay);
    audio.addEventListener("error", handleError);

    //cleaning
    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.remove();
      soundRef.current = null;
    };
  }, [soundFile, volume, playbackRate]);

  const play = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!soundRef.current || !isLoaded) {
        reject(new Error("Áudio não carregado"));
        return;
      }

      soundRef.current.currentTime = 0;
      soundRef.current
        .play()
        .then(resolve)
        .catch((error) => {
          console.error("Erro ao reproduzir som:", error);
          reject(error);
        });
    });
  };

  return { play, isLoaded };
};

export default useSound;
