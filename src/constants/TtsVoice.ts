import { invert } from 'lodash';

export const availableVoices: Record<string, string> = {
  'Amy': 'Amy',
  'Joanna': 'Joanna',
  'Matthew': 'Matthew',
  'Wavenet-H': 'en-US-Wavenet-H',
  'Neural2-F': 'en-US-Neural2-F',
  'Wavenet-B': 'en-US-Wavenet-B',
  'Wavenet-G': 'en-US-Wavenet-G',
  'Wavenet-A': 'en-US-Wavenet-A',
  'Wavenet-F': 'en-US-Wavenet-F',
};
export const invertAvailableVoices = invert(availableVoices);

export const DEFAULT_VOICE = 'en-US-Wavenet-H';
