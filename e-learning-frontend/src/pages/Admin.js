import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import Courses from './Courses'; // Réutilise la liste des cours

const Admin = ({ token }) => {
    const [newCourse, setNewCourse] = useState({ title: '', description: '', instructor: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [courses, setCourses] = useState([]); // Pour rafraîchir la liste après ajout

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/courses', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                setError('Erreur chargement cours');
            }
        };
        fetchCourses();
    }, [token]);

    const handleAddCourse = async (e) => {
        e.preventDefault();
        if (!newCourse.title || !newCourse.description || !newCourse.instructor) {
            setError('Tous les champs sont requis.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('http://localhost:8081/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(newCourse)
            });
            if (!response.ok) throw new Error('Erreur ajout cours');
            const added = await response.json();
            setCourses([...courses, added]);
            setNewCourse({ title: '', description: '', instructor: '' });
            setSuccess('Cours ajouté avec succès !');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Gestion des cours
            </Typography>

            <Box component="form" onSubmit={handleAddCourse} sx={{ mb: 4 }}>
                <TextField
                    label="Titre"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Instructeur"
                    value={newCourse.instructor}
                    onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                    fullWidth
                    margin="normal"
                    required
                />
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Ajouter le cours'}
                </Button>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            </Box>

            <Typography variant="h5" gutterBottom>
                Liste des cours actuels
            </Typography>
            <Courses token={token} />
        </div>
    );
};

export default Admin;