import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import UserContext from '../../context/UserContext';
import api from '../../api/api';

const Header = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error(error);
    } finally {
      setUserInfo(null);
      navigate('/');
    }
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>cloudjp E-commerce</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userInfo ? (
                <NavDropdown title={userInfo.username} id="username">
                  <NavDropdown.Item onClick={logoutHandler}>
                    ログアウト
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> サインイン
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.username === 'admin' && (
                <NavDropdown title="管理者メニュー" id="adminmenu">
                  <LinkContainer to="/admin/manageproducts">
                    <NavDropdown.Item>商品管理</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;