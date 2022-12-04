import React, { useEffect, useState } from 'react';
import Sheet from 'react-modal-sheet';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import Articles from '../pages/Articles';
import Container from '@mui/material/Container/Container';
import { ArticleListContext, useArticleListContext } from '../contexts/ArticleListContext';

const ListenModalSheet = () => {

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const articleListContext = useArticleListContext();

  useEffect(() => setIsOpen(true), []);

  return (
    <div>
      <Sheet isOpen={isOpen} onClose={() => navigate(-1)}>
        <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              <Container>
                <Typography>Playback speed: 1</Typography>
              </Container>
              <ArticleListContext.Provider
                value={{
                  ...articleListContext,
                  selectedArticleId,
                  setSelectedArticleId
                }}>
                <Articles />
              </ArticleListContext.Provider>
            </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </div>
  );
};

export default ListenModalSheet;
