import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { Article } from '../types/Article';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward10Icon from '@mui/icons-material/Forward10';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import { getDisplayTime } from '../utils/TimeUtil';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { availableVoices } from '../constants/TtsVoice';
import InventoryIcon from '@mui/icons-material/Inventory';
import StarIcon from '@mui/icons-material/Star';
import VoiceSelect from './audio/VoiceSelect';

const AudioControls = (
  {
    isPlaying,
    onPlayPauseClick,
    onPrevClick,
    onNextClick,
    VoiceComponent
  }: {
    isPlaying: boolean;
    onPlayPauseClick: (play: boolean) => void;
    onPrevClick: () => void;
    onNextClick: () => void;
    VoiceComponent: JSX.Element;
  }) => (
  <Stack direction={'row'} justifyContent={'space-between'} sx={{width: '100%'}}>

    <Stack style={{flexGrow: 1, flexBasis: 0}}>
      {VoiceComponent}
    </Stack>

    <Stack direction={'row'} sx={{flexGrow: 1, justifyContent: 'center', flexBasis: 0}}>
      <IconButton onClick={onPrevClick}>
        <Replay10Icon />
      </IconButton>
      {isPlaying ?
        <IconButton onClick={() => onPlayPauseClick(false)}>
          <PauseCircleOutlineIcon />
        </IconButton>
        :
        <IconButton onClick={() => onPlayPauseClick(true)}>
          <PlayCircleOutlineIcon />
        </IconButton>
      }
      <IconButton onClick={onNextClick}>
        <Forward10Icon />
      </IconButton>

    </Stack>

    <Stack direction={'row'} style={{flexGrow: 1, justifyContent: 'end', flexBasis: 0}}>
      <IconButton>
        <StarIcon />
      </IconButton>
      <IconButton>
        <InventoryIcon />
      </IconButton>
    </Stack>
  </Stack>
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
  const [ttsVoice, setTtsVoice] = useState(availableVoices.WavenetH);

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

  const getProgressBarMarker = (number: number) => (
    <Typography sx={{fontSize: '14px', mt: -0.5, ml: -1.4}}>
      {getDisplayTime(number)}
    </Typography>
  );

  return (
    <Stack alignItems={'center'}>
      <Typography>
        {title}
      </Typography>
      <Typography>
        {artist}
      </Typography>
      <Slider
        value={trackProgress}
        max={duration}
        onChange={(e, value) => {
          onScrub(value as number);
        }}
        aria-label="audio volume slider"
      />
      <Stack direction={'row'} justifyContent={'space-between'} sx={{width: '100%'}}>
        {getProgressBarMarker(trackProgress)}
        {getProgressBarMarker(duration)}
      </Stack>
      <AudioControls
        VoiceComponent={<VoiceSelect selectedVoice={ttsVoice} setSelectedVoice={setTtsVoice} />}
        isPlaying={isPlaying}
        onPlayPauseClick={setIsPlaying}
        onPrevClick={backward}
        onNextClick={forward}
      />
    </Stack>
  );
};

export default AudioPlayer;

