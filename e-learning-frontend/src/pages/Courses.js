import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';

const Courses = ({ token }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/courses', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Erreur chargement cours');
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [token]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Cours disponibles
            </Typography>
            <Grid container spacing={3}>
                {courses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} key={course.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{course.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {course.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Instructeur : {course.instructor}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {courses.length === 0 && <Typography>Aucun cours disponible.</Typography>}
        </div>
    );
};

export default Courses;