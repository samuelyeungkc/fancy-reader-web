import React, { useEffect, useState } from 'react';
import Sheet from 'react-modal-sheet';
import { useNavigate } from 'react-router-dom';
import Articles from '../pages/Articles';
import Container from '@mui/material/Container/Container';
import { ArticleListContext, useArticleListContext } from '../contexts/ArticleListContext';
import AudioPlayer from './AudioPlayer';

const ListenModalSheet = () => {

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const articleListContext = useArticleListContext();
  const { articles } = articleListContext;

  const getSelectedArticle = () => {
    return selectedArticleId === '' ? undefined : articles.filter(article => article.item_id === selectedArticleId)[0];
  };

  useEffect(() => setIsOpen(true), []);

  useEffect(() => {
    if (selectedArticleId === '' && articles.length > 0) {
      setSelectedArticleId(articles[0].item_id);
    }
  }, [articles, selectedArticleId]);

  return (
    <div>
      <Sheet isOpen={isOpen} onClose={() => navigate(-1)}>
        <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              <Sheet.Scroller>
                <Container>
                  <AudioPlayer article={getSelectedArticle()} />
                </Container>
                <ArticleListContext.Provider
                  value={{
                    ...articleListContext,
                    selectedArticleId,
                    setSelectedArticleId
                  }}>
                  <Articles showNonArticleAltStyle={true} isModal={true} />
                </ArticleListContext.Provider>
              </Sheet.Scroller>
            </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </div>
  );
};

export default ListenModalSheet;
