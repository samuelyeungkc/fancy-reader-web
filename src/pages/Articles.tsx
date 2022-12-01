import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

type Article = {
  item_id: number;
  resolved_id: number;
  given_url: string;
  given_title: string;
  favorite: string;
  status: string;
  time_added: string;
  time_updated: string;
  time_read: string;
  sort_id: number;
  resolved_title: string;
  resolved_url: string;
  is_article: string; // 1/0
  word_count: string; // "1010"
  time_to_read: number;
  top_image_url: string;
  image: {
    item_id: string; // "3750857667"
    src: string; // url
  },
  domain_metadata?: {
    name: string;
    logo: string;
  },
  listen_duration_estimate: number
};

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
  const [articles, setArticles] = useState<Article[]>([]);
  console.log('haha articles!', accessToken);

  useEffect(() => {
    const abort = new AbortController();
    const body = {
      state: 'unread',
      count: 5,
      since: 0,
      sort: 'newest',
      detailType: 'complete',
    };
    const config: RequestInit = {
      signal: abort.signal,
      method: 'POST',
      body: JSON.stringify(body)
    };
    fetch(`https://apps.samykc.com/pocket/articles/fetch?access_token=${accessToken}`, config)
      .then(res => res.json())
      .then((res: FetchArticleResponse) => {
        setArticles(Object.values(res.list).sort((a, b) => a.sort_id - b.sort_id));
        console.log(res.list);
      })
      .catch(res => console.error('fetch Article aborted', res));

    return () => {
      abort.abort();
    };
  }, []);

  return (
    <List>
      {articles.map(article => {
        return (
          <ListItem key={article.item_id}>
            <div style={{display: 'block'}}>
              <div>
                {article.resolved_title}
              </div>
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
      {[...new Array(120)].map((i, index) => <div key={Math.random()}>Articles here</div>)}
    </List>
  );
};

export default Articles;
