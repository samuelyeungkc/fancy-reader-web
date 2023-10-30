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
import PlaybackRateSelect from './audio/PlaybackRateSelect';
import VoiceSelect from './audio/VoiceSelect';
import CircularProgress from '@mui/material/CircularProgress';
import { useUser } from '../contexts/UserContext';

const host = `https://apps.samykc.com`;
const AudioControls = (
  {
    isLoading,
    isPlaying,
    onPlayPauseClick,
    onPrevClick,
    onNextClick,
    VoiceComponent,
    PlaybackComponent
  }: {
    isLoading: boolean;
    isPlaying: boolean;
    onPlayPauseClick: (play: boolean) => void;
    onPrevClick: () => void;
    onNextClick: () => void;
    VoiceComponent: JSX.Element;
    PlaybackComponent: JSX.Element;
  }) => (
  <Stack direction={'row'} justifyContent={'space-between'} sx={{width: '100%'}}>

    <Stack direction={'row'} sx={{flexGrow: 1, flexBasis: 0}}>
      {VoiceComponent}
      {PlaybackComponent}
    </Stack>

    <Stack direction={'row'} sx={{flexGrow: 1, justifyContent: 'center', flexBasis: 0}}>
      {isLoading ?
        <CircularProgress />
        :
        <>
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
        </>
      }
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

const getAudioSrcFromArticle = (article: Article, accessToken: string, voice: string) => {
  const host = `https://apps.samykc.com`;
  const endpt = `${host}/pocket/articles/article/tts`;
  const url = article.resolved_url;
  const isArticle = article.is_article === '1';
  const key = 'slfjaslfjslfjdsklfjsdklfjafiowpepqzvcnlvlvriwuehkjnvnkjxcyviLKDFJVIDCDQNZpq';
  return `${endpt}?key=${key}&url=${url}&pocket_id=${article.item_id}&voice=${voice}&access_token=${accessToken}&is_article=${isArticle}`;
};

const getAudioProgressEndpoint = (article: Article | undefined) => {
  const endpt = `${host}/articles/tts/progress`;
  return `${endpt}?pocket_id=${article?.item_id}`;
};

const getAudioSrc = (article: Article | undefined, accessToken: string, ttsVoice: string) => {
  return article ? getAudioSrcFromArticle(article, accessToken, ttsVoice) : '';
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
  const [networkLoading, setNetworkLoading] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [ttsVoice, setTtsVoice] = useState(availableVoices['Wavenet-H']);
  const [playbackRate, setPlaybackRate] = useState(2.6);
  const { accessToken } = useUser();

  const audioRef = useRef(new Audio(''));
  const intervalRef = useRef<number>();
  const refAudioUrl = useRef<string>('');
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
        case audioRef.current.NETWORK_IDLE:
        case audioRef.current.NETWORK_NO_SOURCE:
          setNetworkLoading(false);
          break;
        case audioRef.current.NETWORK_LOADING:
          setNetworkLoading(true);
          break;
      }
      setTrackProgress(audioRef.current.currentTime);
    };

    intervalRef.current = setInterval(handler, 1000);
  }

  useEffect(() => {
    updateAudioProgress(0);
    setTitle(article?.resolved_title || article?.given_title || '');
    setArtist(article?.domain_metadata?.name || article?.resolved_url.split('/')[2] || '');
  }, [article]);

  useEffect(() => {
    if (isPlaying) {
      setNetworkLoading(true);
      const newSrc = getAudioSrc(article, accessToken, ttsVoice);
      if (newSrc !== refAudioUrl.current) {
        refAudioUrl.current = newSrc;
        fetch(newSrc).then((res) => {
          return res.text();
        }).then((data) => {
          console.log('audio src', data);
          audioRef.current.src = `data:audio/mp3;base64,${data}`;
          audioRef.current.playbackRate = playbackRate;
          audioRef.current.play();
          startTimer();
        }).finally(() => {
          setNetworkLoading(false);
        });
      } else {
        audioRef.current.play();
        startTimer();
      }
    } else {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
    }
  }, [isPlaying, accessToken]);

  useEffect(() => {
    setIsPlaying(false);
    setTrackProgress(audioRef.current.currentTime);
    // Pause and clean up on unmount
    return () => {
      pauseAudio(audioRef, intervalRef);
    }
  }, [article]);

  useEffect(() => {
    audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  const onScrub = (value: number) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    updateAudioProgress(value);
  }

  const updateAudioProgress = (newProgress: number) => {
    audioRef.current.currentTime = newProgress;
    setTrackProgress(newProgress);
  };

  const getProgressBarMarker = (number: number) => {
    const seconds = isNaN(number) ? 0 : number;
    return (
      <Typography sx={{fontSize: '14px', mt: -0.5, ml: -1.4}}>
        {getDisplayTime(seconds)}
      </Typography>
    )
  };

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
        max={isNaN(duration) ? 0 : duration}
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
        isLoading={networkLoading}
        VoiceComponent={<VoiceSelect selectedVoice={ttsVoice} setSelectedVoice={setTtsVoice} />}
        PlaybackComponent={<PlaybackRateSelect playbackRate={playbackRate} setSelectedRate={setPlaybackRate}/>}
        isPlaying={isPlaying}
        onPlayPauseClick={setIsPlaying}
        onPrevClick={backward}
        onNextClick={forward}
      />
    </Stack>
  );
};

export default AudioPlayer;

