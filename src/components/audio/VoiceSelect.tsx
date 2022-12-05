import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { availableVoices } from '../../constants/TtsVoice';
import MenuItem from '@mui/material/MenuItem';

type VoiceSelectProps = {
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void
};

const VoiceSelect = ({ selectedVoice, setSelectedVoice }: VoiceSelectProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (selected: string) => {
    setSelectedVoice(selected);
    setAnchorEl(null);
  }
  const handleMenuClose = () => {
    setAnchorEl(null);
  }

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {Object.entries(availableVoices).filter(([name, value]) => value === selectedVoice)[0][0]}
      </Button>
      <Menu
        sx={{zIndex: 99999999}}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {Object.entries(availableVoices).map(([voiceDisplay, voiceValue], index) => (
          <MenuItem
            key={voiceValue}
            onClick={() => handleClose(voiceValue)}
          >
            {voiceDisplay}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
};

export default VoiceSelect;
