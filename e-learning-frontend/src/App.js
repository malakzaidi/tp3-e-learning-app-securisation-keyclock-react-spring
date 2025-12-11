import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { initKeycloak, getToken, logout } from './keycloak';
import { AppBar, Toolbar, Typography, Button, Container, Avatar, Box, Chip, CircularProgress, Alert } from '@mui/material';
import Courses from './pages/Courses';
import Admin from './pages/Admin';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [userRoles, setUserRoles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        initKeycloak(async () => {
            try {
                await fetchUserInfo();
                await fetchUserRoles();
            } catch (err) {
                setError('Erreur lors du chargement des données utilisateur.');
            } finally {
                setIsLoading(false);
            }
        });
    }, []);

    const fetchUserInfo = async () => {
        const response = await fetch('http://localhost:8080/realms/e-learning-realm/protocol/openid-connect/userinfo', {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (!response.ok) throw new Error('Erreur userinfo');
        const data = await response.json();
        setUserInfo(data);
    };

    const fetchUserRoles = async () => {
        const response = await fetch('http://localhost:8081/api/me', {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (!response.ok) throw new Error('Erreur rôles');
        const data = await response.json();
        const roles = data.realm_access?.roles || [];
        setUserRoles(roles);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" style={{ marginTop: '50px' }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    const isAdmin = userRoles.includes('ROLE_ADMIN');
    const isStudent = userRoles.includes('ROLE_STUDENT') || isAdmin;

    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Plateforme E-Learning
                    </Typography>
                    {userInfo && (
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar>{userInfo.given_name?.[0] || 'U'}</Avatar>
                            <Box>
                                <Typography variant="body1">
                                    {userInfo.given_name} {userInfo.family_name} ({userInfo.email})
                                </Typography>
                                <Box display="flex" gap={1}>
                                    {userRoles.map((role) => (
                                        <Chip key={role} label={role} color="secondary" size="small" />
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    )}
                    <Button color="inherit" onClick={logout} sx={{ ml: 2 }}>
                        Déconnexion
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box display="flex" justifyContent="center" gap={4} mb={4}>
                    {isStudent && <Link to="/courses">Cours disponibles</Link>}
                    {isAdmin && <Link to="/admin">Gestion des cours</Link>}
                </Box>

                <Routes>
                    <Route path="/courses" element={isStudent ? <Courses token={getToken()} /> : <Navigate to="/" />} />
                    <Route path="/admin" element={isAdmin ? <Admin token={getToken()} refreshCourses={() => {}} /> : <Navigate to="/" />} />
                    <Route path="/" element={<Typography variant="h5">Bienvenue ! Sélectionnez une section ci-dessus.</Typography>} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;