import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { initKeycloak, getToken, logout } from './keycloak';
import {
    AppBar, Toolbar, Typography, Button, Container, Avatar, Box, Chip, CircularProgress,
    Alert, Tabs, Tab, Paper, Divider, IconButton, Tooltip, Menu, MenuItem
} from '@mui/material';
import { Home as HomeIcon, School as SchoolIcon, AdminPanelSettings as AdminIcon, Logout as LogoutIcon } from '@mui/icons-material';
import Courses from './pages/Courses';
import Admin from './pages/Admin';

function AppContent() {
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [userRoles, setUserRoles] = useState([]);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState('/');
    const [anchorEl, setAnchorEl] = useState(null);

    const navigate = useNavigate();

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

    const isAdmin = userRoles.includes('ROLE_ADMIN');
    const isStudent = userRoles.includes('ROLE_STUDENT') || isAdmin;

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        navigate(newValue);
    };

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Alert severity="error" variant="filled">
                    {error}
                </Alert>
            </Container>
        );
    }

    const availableTabs = [];
    if (isStudent) availableTabs.push({ label: 'Mes Cours', value: '/courses', icon: <SchoolIcon /> });
    if (isAdmin) availableTabs.push({ label: 'Administration', value: '/admin', icon: <AdminIcon /> });

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="#f9f9fb">
            {/* Enhanced AppBar */}
            <AppBar position="static" elevation={2} color="primary">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        E-Learning Platform
                    </Typography>

                    {/* User Info Section */}
                    {userInfo && (
                        <Box display="flex" alignItems="center" gap={2}>
                            <Tooltip title="Rôles de l'utilisateur">
                                <Button
                                    onClick={handleMenuOpen}
                                    startIcon={<Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                        {userInfo.given_name?.[0] || 'U'}
                                    </Avatar>}
                                    sx={{ color: 'white', textTransform: 'none' }}
                                >
                                    <Box textAlign="left">
                                        <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }}>
                                            {userInfo.given_name} {userInfo.family_name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                            {userInfo.email}
                                        </Typography>
                                    </Box>
                                </Button>
                            </Tooltip>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{ sx: { minWidth: 200 } }}
                            >
                                <MenuItem disabled>
                                    <Typography variant="subtitle2">Rôles :</Typography>
                                </MenuItem>
                                <Divider />
                                {userRoles.length > 0 ? (
                                    userRoles.map(role => (
                                        <MenuItem key={role} disabled>
                                            <Chip label={role.replace('ROLE_', '')} size="small" color="primary" variant="outlined" />
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>Aucun rôle</MenuItem>
                                )}
                            </Menu>

                            <IconButton color="inherit" onClick={logout} title="Déconnexion">
                                <LogoutIcon />
                            </IconButton>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {/* Navigation Tabs */}
            {availableTabs.length > 0 && (
                <Paper elevation={1} square>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        centered
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="standard"
                        sx={{ bgcolor: 'background.paper' }}
                    >
                        <Tab icon={<HomeIcon />} label="Accueil" value="/" />
                        {availableTabs.map(tab => (
                            <Tab key={tab.value} icon={tab.icon} label={tab.label} value={tab.value} />
                        ))}
                    </Tabs>
                </Paper>
            )}

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 6, flexGrow: 1 }}>
                <Routes>
                    <Route path="/courses" element={isStudent ? <Courses token={getToken()} /> : <Navigate to="/" />} />
                    <Route path="/admin" element={isAdmin ? <Admin token={getToken()} refreshCourses={() => {}} /> : <Navigate to="/" />} />
                    <Route path="/" element={
                        <Box textAlign="center" py={8}>
                            <Typography variant="h4" gutterBottom color="primary" fontWeight={600}>
                                Bienvenue, {userInfo.given_name || 'Utilisateur'} !
                            </Typography>
                            <Typography variant="h6" color="text.secondary" paragraph>
                                {availableTabs.length > 0
                                    ? 'Utilisez le menu ci-dessus pour accéder à vos cours ou gérer la plateforme.'
                                    : 'Vous n\'avez actuellement aucun accès actif. Contactez l\'administrateur.'}
                            </Typography>
                        </Box>
                    } />
                </Routes>
            </Container>

            {/* Footer */}
            <Box component="footer" py={3} bgcolor="grey.100" mt="auto">
                <Container>
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} Plateforme E-Learning. Tous droits réservés.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;