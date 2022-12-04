import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { tags } from '../constants/ArticleStates';
import { useArticleListContext } from '../contexts/ArticleListContext';
import { Outlet } from 'react-router-dom';
import { Article } from '../types/Article';

type FetchArticleResponse = {
  status: number;
  complete: number;
  list: {
    [key: string]: Article
  },
  since: number
};

const Articles = () => {

  const {accessToken} = useUser();
  const { selectedTag, setSelectedArticleId } = useArticleListContext();
  const [hasNextPage, setHasNextPage] = useState(false);
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

  useEffect(() => {
    const abort = loadMore(true);
    return () => abort.abort();
  }, [accessToken, selectedTag]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <List>
      <Outlet />
      {articles.map(article => {
        return (
          <ListItem
            key={article.item_id}
            onClick={() => setSelectedArticleId(`${article.item_id}`)}
          >
            <div style={{display: 'block'}}>
              <h4>
                {article.resolved_title}
              </h4>
              <div>item id {article.item_id}</div>
              <div>name {article.domain_metadata?.name}</div>
              <div>sort id {article.sort_id}</div>
              <div>status {article.status}</div>
              <div>word count {article.word_count}</div>
              <div>word count {article.time_to_read}</div>
              <div>listen {article.listen_duration_estimate}</div>
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
