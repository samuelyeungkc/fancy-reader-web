import React, { createContext, useContext, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import HomeIcon from '@mui/icons-material/Home';
import { Outlet } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { tags } from '../constants/ArticleStates';
import TagSelectionModalSheet from '../components/TagSelectionModalSheet';
import { ArticleListContext } from '../contexts/ArticleListContext';

type FetchTagResponse = {
  tags: string[];
};

const Main = () => {
  const [dialogOpened, setDialogOpened] = React.useState(false);
  const [value, setValue] = React.useState('home');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>(tags.ALL);
  const { accessToken } = useUser();

  const handleTabChange = (event: React.SyntheticEvent, newTab: string) => {
    if (value === newTab) {
      setDialogOpened(true);
    } else {
      setValue(newTab);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const body = {
      state: 'all',
      count: 1,
      since: 0,
      offset: 0,
      forcetaglist: 1,
      taglist: 1,
      sort: 'newest',
      detailType: 'simple',
    };
    const config: RequestInit = {
      signal: abortController.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    fetch(`https://apps.samykc.com/pocket/tag/list?access_token=${accessToken}`, config)
      .then(res => res.json())
      .then((res: FetchTagResponse) => {
        setAllTags([...Object.values(tags), ...res.tags]);
        console.log('tagList', res);
      })
      .catch(err => console.error('fetch tag error!', err));

    return () => abortController.abort();
  }, [accessToken]);

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {alert('listen')}}
          >
            <HeadphonesIcon />
          </IconButton>
          <Typography variant={'h6'} sx={{flexGrow: 1}}>
            Articles
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />

      <ArticleListContext.Provider value={{ selectedTag }}>
        <Outlet context={{ selectedTag }}/>
      </ArticleListContext.Provider>

      <TagSelectionModalSheet
        dialogOpened={dialogOpened}
        setDialogOpened={setDialogOpened}
        allTags={allTags}
        setSelectedTag={setSelectedTag}
      />

      <BottomNavigation
        showLabels
        sx={{ width: '100%', position: 'fixed', left: 0, right: 0, bottom: 0 }}
        value={value}
        onChange={handleTabChange}
      >
        <BottomNavigationAction
          label="Recents"
          value="home"
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<FavoriteIcon />}
        />
        <BottomNavigationAction
          label="Nearby"
          value="nearby"
          icon={<LocationOnIcon />}
        />
      </BottomNavigation>
    </>
  );
};

export default Main;
