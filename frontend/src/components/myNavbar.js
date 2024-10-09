import React from 'react';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import '../index.css'


const MyNavbar = () => {
    const userName = localStorage.getItem('userName');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.reload(); // Recargar la página para actualizar el navbar
    };

    return (
        <Navbar className='blue' data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">Notes App</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                </Nav>
                {userName ? (
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-light">
                            {userName} {/* Muestra el nombre del usuario */}
                        </Dropdown.Toggle>

                        <Dropdown.Menu align="end">
                            <Dropdown.Item href={''}>Notas</Dropdown.Item>
                            <Dropdown.Item href='/' onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                ) : (
                    <>
                        <Button href='/register' variant="outline-light" className='ms-auto'>Register</Button>
                        <Button href='/login' variant="light" className="ms-2">Login</Button>
                    </>
                )}
            </Container>
        </Navbar>
    );
};

export default MyNavbar;
