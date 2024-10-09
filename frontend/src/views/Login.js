import React, { useState} from 'react'
import MyNavbar from '../components/myNavbar'
import { Form, Button, Container } from 'react-bootstrap';
import '../index.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:5000/login', {
                email,
                password
            });
    
            // Guardar el token (por ejemplo, en localStorage)
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userName', response.data.name);
    
            alert(response.data.message);
    
            // Redirigir al usuario a la página deseada después del inicio de sesión
            navigate('/');  // Cambia '/dashboard' por la ruta a la que quieres redirigir
    
        } catch (err) {
            alert(`Error: ${err.response?.data?.error}`);
        }
    };

    return (
        <div className='fondo'>
            <MyNavbar />
            <Container style={{ minHeight: 'calc(100vh - 56px)'}} className="d-flex justify-content-center align-items-center">
                <Form onSubmit={handleLogin} style={{ width: '300px' }} className="text-white p-4 rounded bg-dark">
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
                </Form>
            </Container>
        </div>
    );
}

export default Login