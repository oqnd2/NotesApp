import React, { useState, useEffect } from 'react'
import MyNavbar from '../components/myNavbar'
import { Form, Button, Container, Alert } from 'react-bootstrap';
import '../index.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function Login() {
    const userId = localStorage.getItem('userId');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post('http://localhost:5000/login', {
                email: email.toLowerCase(),
                password
            });

            // Guardar el token.
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userName', response.data.name);
            localStorage.setItem('userId', response.data.id);

            // Redirigir al usuario a la página deseada después del inicio de sesión.
            navigate('/notes');

        } catch (err) {
            setError(`Error: ${err.response?.data?.error}`);
        }
    };

    useEffect(() => {
        if (userId) {
            navigate('/');
        }
    });

    return (
        <div className='fondo'>
            <MyNavbar />
            <Container style={{ minHeight: 'calc(100vh - 56px)' }} className="d-flex justify-content-center align-items-center">
                <Form onSubmit={handleLogin} style={{ width: '300px' }} className="text-white p-4 rounded bg-dark">
                    {error && <Alert variant='danger' className=''>{error}</Alert>}
                    <h2 className="text-center mb-4">Iniciar sesión</h2>
                    <Form.Group className="mb-3">
                        <Form.Label>Correo electronico:</Form.Label>
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
                    <Button type="submit" variant="outline-light" className="w-100">
                        Ingresar
                    </Button>
                    <p className="text-center text-light mt-3">
                        ¿No tienes una cuenta? <a href="/register" className="text-decoration-none">Crea una!</a>
                    </p>
                </Form>
            </Container>
        </div>
    );
}

export default Login