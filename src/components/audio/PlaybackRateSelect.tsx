import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

type PlaybackRateSelectProps = {
  playbackRate: number;
  setSelectedRate: (rate: ((rate: number) => number)) => void
};

const PlaybackRateSelect = (
  { playbackRate, setSelectedRate }: PlaybackRateSelectProps
) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    // setSelectedVoice(selected);
    setAnchorEl(null);
  }
  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  // }

  const id = 'rate-selection-id';
  console.log('hereeee')

  const displayPlaybackRate = () => {
    const split = (rate: number) => {
      const rateStr = `${rate}`;
      const splitRate = rateStr.split('.');
      return `${splitRate[0]}.${splitRate[1].at(0)}x`;
    };
    return playbackRate === 1 ? '1.0x' : split(playbackRate);
  };

  return (
    <>
      <Button aria-describedby={id} onClick={handleClick} variant={'outlined'}>
        {displayPlaybackRate()}
      </Button>
      <Menu
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 50,
          horizontal: 'left',
        }}
        sx={{zIndex: 99999999}}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => setSelectedRate(rate => rate + 0.1)} sx={{textAlign: 'center'}}>
          <Typography sx={{width: '100%'}}>+</Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>{displayPlaybackRate()}</MenuItem>
        <MenuItem onClick={() => setSelectedRate(rate => rate - 0.1)} sx={{textAlign: 'center'}}>
          <Typography sx={{width: '100%'}}>-</Typography>
        </MenuItem>
      </Menu>
    </>
  )
};

export default PlaybackRateSelect;
