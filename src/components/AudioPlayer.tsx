import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { Article } from '../types/Article';

const AudioControls = (
  {
    isPlaying,
    onPlayPauseClick,
    onPrevClick,
    onNextClick,
  }: {
    isPlaying: boolean;
    onPlayPauseClick: (play: boolean) => void;
    onPrevClick: () => void;
    onNextClick: () => void;
  }) => (
  <>
    <button onClick={onPrevClick}>
      Prev
    </button>
    {isPlaying ?
      <button onClick={() => onPlayPauseClick(false)}>
        Pause
      </button>
      :
      <button onClick={() => onPlayPauseClick(true)}>
        Play
      </button>
    }
    <button onClick={onNextClick}>
      Next
    </button>
  </>
)

const getAudioSrcFromArticle = (article: Article) => {
  const endpt = `https://apps.samykc.com/pocket/articles/article/tts`;
  const key = `slfjaslfjslfjdsklfjsdklfjafiowpepqzvcnlvlvriwuehkjnvnkjxcyviLKDFJVIDCDQNZpq`;
  const url = article.resolved_url;
  const voice = 'en-US-Wavenet-H';
  const audioSrc = `${endpt}?key=${key}&url=${url}&pocket_id=${article.item_id}&voice=${voice}`;
  return audioSrc;
};

const getAudioSrc = (article: Article | undefined) => {
  return article ? getAudioSrcFromArticle(article) : '';
};

const pauseAudio = (
  audioRef: MutableRefObject<HTMLAudioElement>,
  intervalRef: MutableRefObject<number | undefined>
) => {
  clearInterval(intervalRef.current);
  audioRef.current.pause();
};

const AudioPlayer = ({ article }: { article: Article | undefined; }) => {

  // State
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');

  const audioRef = useRef(new Audio(''));
  const intervalRef = useRef<number>();
  const { duration } = audioRef.current;

  const forward = () => {
    audioRef.current.currentTime = audioRef.current.currentTime + 10;
  };

  const backward = () => {
    audioRef.current.currentTime = audioRef.current.currentTime - 15;
  };

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);


    const handler: TimerHandler = () => {
      const { networkState } = audioRef.current;
      switch (networkState) {
        case audioRef.current.NETWORK_EMPTY:
          console.log('network empty');
          break;
        case audioRef.current.NETWORK_IDLE:
          console.log('network IDLE');
          break;
        case audioRef.current.NETWORK_NO_SOURCE:
          console.log('network NOSOURCE');
          break;
        case audioRef.current.NETWORK_LOADING:
          console.log('network LOADING');
          break;
      }
      setTrackProgress(audioRef.current.currentTime);
    };

    intervalRef.current = setInterval(handler, 1000);
  }

  useEffect(() => {
    audioRef.current.src = getAudioSrc(article);
    setTitle(article?.resolved_title || article?.given_title || '');
    setArtist(article?.domain_metadata?.name || article?.resolved_url.split('/')[2] || '');
  }, [article]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    setIsPlaying(false);
    setTrackProgress(audioRef.current.currentTime);
    // Pause and clean up on unmount
    return () => {
      pauseAudio(audioRef, intervalRef);
    }
  }, [article]);

  const onScrub = (value: number) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  }

  const onScrubEnd = () => {
    // If not already playing, start
    // if (!isPlaying) {
    //   setIsPlaying(true);
    // }
    startTimer();
  }

  const currentPercentage = duration ? `${(trackProgress / duration) * 100}%` : '0%';
  const trackStyling = `
  -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
`;

  return (
    <>
      <div>{title}</div>
      <div>{artist}</div>
      <div>{trackProgress}</div>
      <AudioControls
        isPlaying={isPlaying}
        onPlayPauseClick={setIsPlaying}
        onPrevClick={backward}
        onNextClick={forward}
      />
      <input
        type="range"
        value={trackProgress}
        step="1"
        min="0"
        max={duration ? duration : `${duration}`}
        className="progress"
        onChange={(e) => onScrub(Number(e.target.value))}
        onMouseUp={onScrubEnd}
        onKeyUp={onScrubEnd}
        style={{ background: trackStyling}}
      />
    </>
  );
};

export default AudioPlayer;

