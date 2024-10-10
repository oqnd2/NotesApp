import React, { useState } from 'react';
import MyNavbar from '../components/myNavbar';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVerif, setPasswordVerif] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== passwordVerif) {
            alert('Las contraseñas no coinciden!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/register', {
                name,
                email,
                password
            });

            alert(response.data.message);
            navigate('/login');
        } catch (err) {
            setError(`Error: ${err.response?.data?.error || 'Error en el registro'}`);
        }
    };

    return (
        <div className='fondo'>
            <MyNavbar />
            <Container style={{ minHeight: 'calc(100vh - 56px)' }} className="d-flex justify-content-center align-items-center">
                <Form onSubmit={handleSubmit} style={{ width: '300px' }} className="text-white p-4 rounded bg-dark">
                    {error && <Alert variant='danger' className=''>{error}</Alert>}
                    <h2 className="text-center mb-4">¡Regístrate!</h2>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre:</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Correo electrónico:</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña:</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Confirmar contraseña:</Form.Label>
                        <Form.Control
                            type="password"
                            value={passwordVerif}
                            onChange={(e) => setPasswordVerif(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" variant="outline-light" className="w-100">
                        Registrarse
                    </Button>
                </Form>
            </Container>
        </div>
    );
}

export default Register;
