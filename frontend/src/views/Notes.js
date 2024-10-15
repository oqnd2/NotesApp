import React, { useEffect, useState, useCallback } from 'react';
import MyNavbar from '../components/myNavbar';
import { useNavigate } from 'react-router-dom';
import FloatingButton from '../components/floatingButton';
import { Alert, Button, Card, Form, Modal } from 'react-bootstrap';
import trash from '../assets/trash.png'
import edit from '../assets/pencil.png'
import axios from 'axios';

function Notes() {
    const userId = localStorage.getItem('userId');

    const [show, setShow] = useState(false);
    const [info, setInfo] = useState(false);
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState([]);
    const [editNoteId, setEditNoteId] = useState(null);

    const navigate = useNavigate();

    const handleClose = () => {
        setShow(false);
        setError(null);
        setEditNoteId(null);
        setNote('');
        setTitle('');
    }

    const handleInfo = (message) => {
        setInfo(message);
        
        setTimeout(() =>{
            setInfo(false);
        }, 3000);
    }

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

        if (title === '') {
            setError('Debes ponerle un título a la nota');
            return;
        } else if (note === '') {
            setError('Debes ponerle contenido a la nota');
            return;
        }

        setError('');

        try {
            const response = await axios.post('http://localhost:5000/addnote', {
                userId,
                title,
                note
            });

            handleInfo(response.data.message);
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

            handleInfo(response.data.message);
            fetchNotes();

        } catch (err) {
            alert(`Error: ${err.response?.data?.error || 'Error al eliminar la nota'}`);
        }
    }

    //Mostrar datos de la nota para su edición
    const showNoteData = (note) => {
        setEditNoteId(note._id);
        setTitle(note.title);
        setNote(note.note);
        handleShow();
    }

    const handleEditNote = async (noteId) => {
        if (title === '') {
            setError('Debes ponerle un título a la nota');
            return;
        } else if (note === '') {
            setError('Debes ponerle contenido a la nota');
            return;
        }

        setError('');

        try {
            const response = await axios.post('http://localhost:5000/editnote', {
                noteId,
                title,
                note
            });

            handleInfo(response.data.message);
            handleClose();
            fetchNotes();
        } catch (err) {
            setError(`Error: ${err.response?.data?.error || 'Error al editar la nota'}`);
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
            {info && <Alert variant='info' className='mt-3 mb-3 mx-auto' style={{ width: '80%' }}>{info
                }</Alert>}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    {editNoteId ? (
                        <Modal.Title>Editar nota</Modal.Title>
                    ) : (
                        <Modal.Title>Agregar una nota</Modal.Title>
                    )}
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {error && <Alert variant='danger' className=''>{error}</Alert>}
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
                            {editNoteId ? (
                                <Button className='blue' onClick={() => handleEditNote(editNoteId)}>
                                    Editar nota
                                </Button>
                            ) : (
                                <Button className='blue' onClick={handleAddNote}>
                                    Agregar nota
                                </Button>
                            )
                            }

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
                                    <Button variant="danger" className='me-3' onClick={() => handleDeleteNote(note._id)}>
                                        <img alt='Delete' src={trash} style={{ width: '20px' }} />
                                    </Button>
                                    <Button variant="primary" onClick={() => showNoteData(note)}>
                                        <img alt='Edit' src={edit} style={{ width: '20px' }} />
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