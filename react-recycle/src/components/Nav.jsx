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
import AdbIcon from '@mui/icons-material/Adb';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';  // useNavigate import
import { useEffect, useState } from 'react'; // useEffect 및 useState 추가

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Logout'];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#ffffff', 0.15),  // 검색창 배경을 흰색으로 유지
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
    width: '250px', // 여기에서 크기를 250px로 고정
    transition: theme.transitions.create('width'),
  },
}));

function Nav() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');  // 프로필 이미지 상태 관리
  const navigate = useNavigate();  // useNavigate 훅 사용

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

  // 컴포넌트 마운트 시 데이터 패칭
  useEffect(() => {
    const getData = async () => {
      try {
        const jwt = sessionStorage.getItem('jwt');
        const url = 'http://localhost:8080/user/profile';
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
        });

        // 응답 상태 체크
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        // 프로필 이미지가 있으면 상태에 저장
        if (data && data.profileImageUrl) {
          setProfileImageUrl(data.profileImageUrl); 
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    getData();
  }, []); // 빈 배열로 의존성을 지정해 최초 렌더링 시에만 호출

  // 프로필 메뉴 항목을 클릭할 때 페이지 이동 처리
  const handleMenuClick = (setting) => {
    handleCloseUserMenu();

    if (setting === 'Profile') {
      navigate('/mypage');
    } else if (setting === 'Account') {
      navigate('/account');
    } else if (setting === 'Dashboard') {
      navigate('/dashboard');
    } else if (setting === 'Logout') {
      sessionStorage.removeItem('jwt');
      navigate('/');
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#ffffff', color: '#000000', borderBottom: '1px solid #98c76a', boxShadow: 'none', height:'120px', justifyContent: 'center' }}>
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
              src="/img/logo.png" // 여기에 로고 이미지 경로를 입력
              alt="Logo"
              style={{ width: '225px', height: 'auto' }} // 이미지 크기 조절
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
          <Search style={{ marginRight: '3%' }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="예)음료수병, 우산, 가위"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          {/* Avatar and Settings Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {/* 프로필 이미지가 있을 때 보여주기 */}
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
              {settings.map((setting) => (
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
