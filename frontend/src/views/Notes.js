import React, { useEffect, useState, useCallback } from 'react';
import MyNavbar from '../components/myNavbar';
import { useNavigate } from 'react-router-dom';
import FloatingButton from '../components/floatingButton';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import trash from '../assets/trash.png'
import axios from 'axios';

function Notes() {
    const userId = localStorage.getItem('userId');

    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [notes, setNotes] = useState([]);

    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Consultar las notas
    const fetchNotes = useCallback(async () => {
        try {
            const response = await axios.post('http://localhost:5000/notes', {
                userId
            });

            setNotes(response.data);
        } catch (err) {
            alert(`Error: ${err.response?.data?.error || 'Error al crear la nota'}`);
        }
    }, [userId]);

    //Agregar una nota
    const handleAddNote = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/addnote', {
                userId,
                title,
                note
            });

            alert(response.data.message);
            handleClose();
            fetchNotes();
        } catch (err) {
            alert(`Error: ${err.response?.data?.error || 'Error al crear la nota'}`);
        }
    }

    //Eliminar una nota
    const handleDeleteNote = async (noteId) => {
        try {
            const response = await axios.post('http://localhost:5000/deletenote', {
                noteId
            });

            alert(response.data.message);
            fetchNotes();

        } catch (err) {
            alert(`Error: ${err.response?.data?.error || 'Error al eliminar la nota'}`);
        }
    }

    useEffect(() => {
        if (!userId) {
            navigate('/login'); //Si no esta logueado, se redirige al inicio de sesión
        } else {
            fetchNotes(); 
        }
    }, [userId, navigate, fetchNotes]);

    return (
        <div className='fondo'>
            <MyNavbar />
            <FloatingButton onClick={handleShow} />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar una nota</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddNote}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Titulo:</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Nota:</Form.Label>
                            <Form.Control as="textarea"
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button className='blue' type="submit">
                                Agregar nota
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                maxHeight: '30rem',
                overflowY: 'auto'
            }}>
                <h2 className='text-white'>Mis notas</h2>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '1rem'
                }}>
                    {notes.length > 0 ? (
                        notes.slice(0, 12).map((note) => (
                            <Card key={note._id} style={{ width: '18rem' }} className='bg-dark text-white'>
                                <Card.Body>
                                    <Card.Title>{note.title}</Card.Title>
                                    <Card.Text>
                                        {note.note}
                                    </Card.Text>
                                    <Button variant="danger" onClick={() => handleDeleteNote(note._id)}>
                                        <img alt='Delete' src={trash} style={{ width: '20px' }} />
                                    </Button>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <h2 className='text-white'>¡Aun no tienes notas!</h2>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Notes;