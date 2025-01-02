import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Use react-router-dom for navigation
import logo from '../assets/logo.PNG'; // Replace with your actual logo path

const Header = () => {
  return (
    <Navbar
      expand="lg"
      style={{
        backgroundColor: '#121212',
        color: '#e0e0e0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      }}
      variant="dark"
      fixed="top"
    >
      <Container>
        {/* Logo Section */}
        <Navbar.Brand href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              height: '40px',
              width: 'auto',
              marginRight: '10px',
            }}
          />
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>ColdOutReach</span>
        </Navbar.Brand>

        {/* Toggler for Mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Collapsible Menu */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" style={{ fontSize: '16px' }}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/services" style={{ fontSize: '16px' }}>
              Services
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" style={{ fontSize: '16px' }}>
              Contact Us
            </Nav.Link>
          </Nav>

          <Nav>
            <Nav.Link as={Link} to="/business" style={{ fontSize: '16px' }}>
              BUSINESS
            </Nav.Link>
            <Nav.Link as={Link} to="/pricing" style={{ fontSize: '16px' }}>
              Pricing
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/signup"
              style={{
                fontSize: '16px',
                padding: '5px 15px',
                borderRadius: '4px',
                backgroundColor: '#333',
                color: '#e0e0e0',
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              SIGN-IN
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
