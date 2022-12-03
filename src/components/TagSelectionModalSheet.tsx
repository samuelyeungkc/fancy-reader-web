import React from 'react';
import Sheet from 'react-modal-sheet';
import Container from '@mui/material/Container/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

type TagSelectionModalSheetProps = {
  dialogOpened: boolean;
  setDialogOpened: (open: boolean) => void;
  allTags: string[];
  setSelectedTag: (tag: string) => void;
};

const TagSelectionModalSheet = (
  {
    dialogOpened,
    setDialogOpened,
    setSelectedTag,
    allTags
  }: TagSelectionModalSheetProps
) => {
  return (
    <Sheet isOpen={dialogOpened} onClose={() => setDialogOpened(false)}>
      <Sheet.Container>
        <Container sx={{pt: 1}}>
          <Sheet.Header>
            <Box
              sx={{
                py: 2,
                pb: 3,
                borderBottom: '5px solid #D3D3D3'
              }}
            >
              <Typography variant={'h5'}>
                Tags
              </Typography>
            </Box>
          </Sheet.Header>
          <Sheet.Content>
            {allTags.map((tag, i) => (
              <Box
                key={tag}
                sx={{
                  // justifyContent: 'start',
                  py: 2,
                  px: 2,
                  borderBottom: i === allTags.length - 1 ? '' : '1px solid #D3D3D3'
                }}
              >
                <Link
                  underline={'none'}
                  onClick={() => {
                    setSelectedTag(tag);
                    setDialogOpened(false);
                  }}
                >
                  {tag}
                </Link>
              </Box>
            ))}
          </Sheet.Content>
        </Container>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
};

export default TagSelectionModalSheet;
