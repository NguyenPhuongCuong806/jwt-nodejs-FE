import React, { useContext, useEffect, useState } from 'react';
import "./Nav.scss"
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { logoutUser } from '../../services/userService';
import { toast } from 'react-toastify';

const NavHeader = () => {
    const { user, logoutCT } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();


    const handleLogout = async () => {
        let res = await logoutUser();
        localStorage.removeItem('jwt');
        logoutCT()
        if (res && +res.EC === 0) {
            toast.success('logout success!')
            navigate('/login')
        } else {
            toast.error(res.EM)
        }
    }

    if (user && user.isAuthenticated === true || location.pathname === '/') {
        return (
            <>
                {/* <div>
                    <ul>
                        <li><NavLink to="/" exact>Home</NavLink></li>
                        <li><NavLink to="/users">Users</NavLink></li>
                        <li><NavLink to="/projects">Projects</NavLink></li>
                        <li><NavLink to="/about">About</NavLink></li>
                    </ul>
                </div> */}
                <div className='nav-header'>
                    <Navbar bg='header' expand="lg">
                        <Container>
                            <Navbar.Brand href="#home">React</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    <NavLink to="/" className="nav-link">Home</NavLink>
                                    <NavLink to="/users" className="nav-link">Users</NavLink>
                                    <NavLink to="/roles" className="nav-link">Roles</NavLink>
                                    <NavLink to="/group-roles" className="nav-link">Group-Role</NavLink>
                                    <NavLink to="/projects" className="nav-link">Projects</NavLink>
                                    <NavLink to="/about" className="nav-link">About</NavLink>

                                </Nav>
                                <Nav>
                                    {
                                        user && user.isAuthenticated === true
                                            ?
                                            <>
                                                <Nav.Item className='nav-link'>
                                                    Welcome {user.account.username} !
                                                </Nav.Item>
                                                <NavDropdown title="Settings" id="basic-nav-dropdown">
                                                    <NavDropdown.Item>Change Password</NavDropdown.Item>
                                                    <NavDropdown.Divider />
                                                    <NavDropdown.Item>
                                                        <span onClick={() => handleLogout()}>
                                                            Logout
                                                        </span>
                                                    </NavDropdown.Item>
                                                </NavDropdown>
                                            </>
                                            :
                                            <>
                                                <Link to="/login" className="nav-link">Login</Link>

                                            </>
                                    }


                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </div>

            </>
        );
    }
    else {
        return <></>
    }

};

export default NavHeader;