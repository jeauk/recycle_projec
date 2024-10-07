import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRef } from 'react';

const pages = [];
const settings = ['프로필', '글쓰기', '로그아웃'];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#ffffff', 0.15),
  border: '1px solid lightgray',
  '&:hover': {
    backgroundColor: alpha('#ffffff', 0.25),
  },
  marginLeft: theme.spacing(2),
  width: 'auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '250px',
    transition: theme.transitions.create('width'),
  },
}));

const ResultList = styled('ul')(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: '5%',
  right: 0,
  backgroundColor: '#ffffff',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  zIndex: 1, // 검색창 위에 나타나도록 설정
  maxHeight: '200px', // 리스트의 최대 높이 설정
  overflowY: 'auto', // 리스트가 넘칠 때 스크롤 가능
}));

const ResultItem = styled('li')(({ theme }) => ({
  padding: theme.spacing(1),
  borderBottom: '1px solid lightgray',
  '&:hover': {
    backgroundColor: alpha('#000000', 0.05),
  },
}));

function Nav() {
  const myBackDomain = "https://trashformer.site";
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchItem, setSearchItem] = useState(''); // 검색할 단어
  const [searchResult, setSearchResult] = useState([]); // 검색 결과를 저장
  const [isSearching, setIsSearching] = useState(false);
  const [filteredResult, setFilteredResult] = useState([]);
  const [showResults, setShowResults] = useState(false); //검색 결과 보이기, 보이지 않기
  const navigate = useNavigate();
  const searchRef = useRef(null); //클릭 감지

  const onChange = (e) => {
    setSearchItem(e.target.value);

    setShowResults(false);
    setFilteredResult([]);
  };


  const onSearch = async () => {
    try {
      const res = await fetch(`https://trashformer.site/mainrecycle?query=${searchItem}`);
      const data = await res.json();
      setSearchResult(data);
      const searchFilter = data.filter((item) =>
        item.mrTag?.toLowerCase().includes(searchItem.toLowerCase())
      );
      setFilteredResult(searchFilter);
      setShowResults(true); //검색 결과 보이기
    } catch (error) {
      console.error("서버에 연결하는데 실패했습니다.", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsSearching(true);
    }
  };

  const handleSearchClick = () => {
    setIsSearching(true);
  };

  useEffect(() => {
    if (isSearching) {
      onSearch();
      setIsSearching(false);
      
    }
  }, [isSearching]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const loadProfileData = async () => {
    try {
      const jwt = sessionStorage.getItem('jwt');

      if (jwt) {
        setIsLoggedIn(true);
      }

      const url = 'https://trashformer.site/user/profile';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.profileImageUrl) {
        setProfileImageUrl(data.profileImageUrl);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleMenuClick = (setting) => {
    handleCloseUserMenu();

    if (setting === '프로필') {
      navigate('/mypage');
    } else if (setting === '글쓰기') {
      navigate('/post');
    } else if (setting === '로그아웃') {
      sessionStorage.removeItem('jwt');
      setIsLoggedIn(false);
      navigate('/mypage');
      alert('로그아웃 되었습니다');
      window.location.reload();
    }
  };
  //밖을 클릭시 검색결과를 비활성화 하는 코드
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && 
        !searchRef.current.contains(event.target)) {
          setShowResults(false); //
        }      
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#ffffff',
        color: '#000000',
        borderBottom: '1px solid #98c76a',
        boxShadow: 'none',
        height: '120px',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
            }}
          >
            <img
              src="/img/logo.png"
              alt="Logo"
              style={{ width: '225px', height: 'auto' }}
            />
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'inherit', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Search Bar */}
          <Box sx={{ position: 'relative', marginRight: '3%' }} ref={searchRef}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="예)음료수병, 우산, 가위"
                inputProps={{ 'aria-label': 'search' }}
                value={searchItem}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowResults(true)} //검색창 클릭시 검색결과 보이기
              />
              <Button onClick={handleSearchClick}>검색</Button>
            </Search>

            {/* 검색 결과 출력 */}
            {/* 검색창을 클릭한 상태이고 글자가 1개 이상일때 */}
            {showResults && filteredResult.length > 0 && (
              <ResultList>
                {filteredResult.map((item) => (
                  <ResultItem
                    key={item.id}>
                    <Link to={`/RecycleMain/${item.id}`}>
                    <div style={{ display: "flex", alignItems: "center" }}> {/* Flexbox 적용 */}
                      <img 
                        style={{ width: "60px", height: "60px", marginRight: "10px" }}
                        src={myBackDomain+item.imgUrl} 
                        alt={item.mrName} 
                      />
                      <p style={{ margin: 0 }}>{item.mrName}</p> {/* 텍스트의 기본 마진 제거 */}
                    </div>
                                  
                    </Link>
                  </ResultItem>
                ))}
              </ResultList>
            )}
          </Box>
          {/* Avatar and Settings Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Profile" src={profileImageUrl || ''} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings
                .filter((setting) => (setting === '글쓰기' && isLoggedIn) || setting !== '글쓰기')
                .filter((setting) => setting !== '로그아웃' || isLoggedIn)
                .map((setting) => (
                  <MenuItem key={setting} onClick={() => handleMenuClick(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Nav;
