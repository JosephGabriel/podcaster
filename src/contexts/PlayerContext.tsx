import { createContext, useState, ReactNode, useContext } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerProviderProps = {
  children: ReactNode;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffle: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  playPrevious: () => void;
  playNext: () => void;
  clearPlayerState: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  setPlayingState: (state: boolean) => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

export const PlayerContextProvider = ({ children }: PlayerProviderProps) => {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const hasNext = isShuffle || currentEpisodeIndex + 1 < episodeList.length;
  const hasPrevious = currentEpisodeIndex + 1 < episodeList.length;

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function playNext() {
    if (isShuffle) {
      const nextShuffle = Math.floor(Math.random() * episodeList.length);

      setCurrentEpisodeIndex(nextShuffle);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }

    return;
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }

    return;
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffle(!isShuffle);
  }

  function setPlayingState(state) {
    setIsPlaying(state);
  }

  function clearPlayerState() {
    setCurrentEpisodeIndex(0);
    setEpisodeList([]);
  }

  const value = {
    episodeList,
    currentEpisodeIndex,
    play,
    isShuffle,
    isLooping,
    isPlaying,
    toggleLoop,
    togglePlay,
    toggleShuffle,
    playNext,
    clearPlayerState,
    setPlayingState,
    playList,
    hasNext,
    hasPrevious,
    playPrevious,
  };
  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
