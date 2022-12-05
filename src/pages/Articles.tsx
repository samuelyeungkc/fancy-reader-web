import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { tags } from '../constants/ArticleStates';
import { useArticleListContext } from '../contexts/ArticleListContext';
import { Article } from '../types/Article';
import Typography from '@mui/material/Typography';
import { getDomain } from '../utils/ArticleUtil';
import Chip from '@mui/material/Chip';

type FetchArticleResponse = {
  status: number;
  complete: number;
  list: {
    [key: string]: Article
  },
  since: number
};

type ArticlesProps = {
  showNonArticleAltStyle: boolean;
  isModal?: boolean;
};

const Articles = (
  {
    showNonArticleAltStyle,
    isModal
  }: ArticlesProps
) => {

  const {accessToken} = useUser();
  const { selectedTag, setSelectedArticleId } = useArticleListContext();
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const { articles, setArticles } = useArticleListContext();

  const loadMore = (refreshAll: boolean) => {
    const abort = new AbortController();
    setLoading(true);
    const body = {
      state: 'unread',
      count: 10,
      since: 0,
      offset: refreshAll ? 0 : articles.length,
      sort: 'newest',
      detailType: 'complete',
      ...(selectedTag === tags.ALL ? {} : {tag: selectedTag})
    };
    const config: RequestInit = {
      signal: abort.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    fetch(`https://apps.samykc.com/pocket/articles/fetch?access_token=${accessToken}`, config)
      .then(res => res.json())
      .then((res: FetchArticleResponse) => ((res) => {
        const newArticles = Object.values(res.list).sort((a, b) => a.sort_id - b.sort_id);
        console.log(res.list);
        setArticles((articles) => [...(refreshAll ? [] : articles), ...newArticles]);
        setHasNextPage(Object.keys(res.list).length > 0);
      })(res))
      .finally(() => setLoading(false));
    return abort;
  };
  const error = false;

  const isArticleErrorStyle = (article: Article) => showNonArticleAltStyle && article.is_article === '0';

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: () => loadMore(false),
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    disabled: error,
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    // rootMargin: '0px 0px 400px 0px',
  });

  // init load
  useEffect(() => {
    // init load is not required if in modal as there are existing articles in context loaded
    if (!isModal) {
      const abort = loadMore(true);
      return () => abort.abort();
    }
  }, [accessToken, selectedTag]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <List>
      {articles.map(article => {
        return (
          <ListItem
            key={article.item_id}
            onClick={() => setSelectedArticleId(`${article.item_id}`)}
            sx={{ backgroundColor: isArticleErrorStyle(article) ? 'red' : ''}}
          >
            <div style={{display: 'block'}}>
              {/*<Typography variant={'body1'}>*/}
              <Typography variant={'body1'} color={isArticleErrorStyle(article) ? 'white' : 'black'}>
                {article.resolved_title}
              </Typography>
              <Typography variant={'caption'} color={isArticleErrorStyle(article) ? 'white' : 'black'}>
                {article.time_to_read ? `${article.time_to_read} mins · ` : ''}
                {getDomain(article)}
              </Typography>
              <Typography>
                {
                  Object.keys(article.tags ?? {})
                    .map((tag) =>
                      <Chip
                        key={tag}
                        size={'small'}
                        color={tag.includes('issue') ? 'error' : 'info'}
                        label={tag}
                      />
                    )
                }
              </Typography>
            </div>
          </ListItem>
        )
      })}

      {(loading || hasNextPage) && (
        <ListItem ref={sentryRef}>
          <div>Loading</div>
        </ListItem>
      )}
    </List>
  );
};

export default Articles;
