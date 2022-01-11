import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./style.module.scss";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { stringToTime } from "../../utils/utils";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    currentEpisodeIndex,
    episodeList,
    isPlaying,
    clearPlayerState,
    isLooping,
    isShuffle,
    toggleShuffle,
    toggleLoop,
    playNext,
    playPrevious,
    togglePlay,
    setPlayingState,
    hasNext,
    hasPrevious,
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
      console.log(progress);
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;

    setProgress(amount);
  }

  function handleEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <span>Tocando agora</span>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>{stringToTime(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                onChange={handleSeek}
                max={episode.duration}
                value={progress}
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ backgroundColor: "#04d361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{stringToTime(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            onEnded={handleEnded}
            src={episode.url}
            autoPlay
            loop={isLooping}
            ref={audioRef}
            onLoadedMetadata={setupProgressListener}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffle ? styles.isActive : ""}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            disabled={!episode}
            className={styles.playButton}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button
            type="button"
            disabled={!episode || !hasNext}
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ""}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
