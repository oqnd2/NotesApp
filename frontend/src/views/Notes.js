import React, { useEffect, useState } from 'react'
import MyNavbar from '../components/myNavbar'
import { useNavigate } from 'react-router-dom';
import FloatingButton from '../components/floatingButton';
import { Button, Form, Modal } from 'react-bootstrap';

function Notes() {
    const userName = localStorage.getItem('userName');

    const [show, setShow] = useState(false);

    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    

    useEffect(() => {
        if (!userName) {
            navigate('/login');
        }
    });

    const handleAddNote = async (e) => {
        e.preventDefault();


    }


    return (
        <div className='fondo'>
            <MyNavbar />
            <FloatingButton onClick={handleShow} />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar una nota</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Titulo:</Form.Label>
                            <Form.Control
                                type="email"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Nota:</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button className='blue' onClick={handleAddNote}>
                        Agregar nota
                    </Button>
                </Modal.Footer>
            </Modal>
            
        </div>
    )
}

export default Notes;