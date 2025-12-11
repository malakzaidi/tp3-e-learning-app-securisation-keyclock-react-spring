import React, { useState, useEffect } from 'react';
import Keycloak from 'keycloak-js';

// Configuration Keycloak - AJUSTE SI NÉCESSAIRE
const keycloakConfig = {
    url: 'http://localhost:8080/',
    realm: 'e-learning-realm',
    clientId: 'react-client'
};

const keycloak = new Keycloak(keycloakConfig);

function App() {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [userClaims, setUserClaims] = useState(null);
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({ title: '', description: '' });
    const [error, setError] = useState(null);

    // Initialiser Keycloak au chargement
    useEffect(() => {
        keycloak.init({
            onLoad: 'login-required',
            checkLoginIframe: false,
            pkceMethod: 'S256'
        }).then(authenticated => {
            setAuthenticated(authenticated);
            setLoading(false);

            if (authenticated) {
                console.log('✅ Authentification réussie');
                console.log('Token:', keycloak.token);
                loadUserData();
                loadCourses();

                // Refresh token automatiquement toutes les 60 secondes
                setInterval(() => {
                    keycloak.updateToken(70).then(refreshed => {
                        if (refreshed) {
                            console.log('🔄 Token rafraîchi');
                        }
                    }).catch(() => {
                        console.error('❌ Échec du rafraîchissement du token');
                    });
                }, 60000);
            }
        }).catch(err => {
            console.error('❌ Échec de l\'initialisation Keycloak', err);
            setLoading(false);
        });
    }, []);

    // Charger les données utilisateur
    const loadUserData = async () => {
        try {
            // 1. Récupérer userinfo depuis Keycloak (/userinfo)
            const userInfoData = await keycloak.loadUserInfo();
            console.log('📄 UserInfo depuis Keycloak:', userInfoData);
            setUserInfo(userInfoData);

            // 2. Récupérer les claims depuis le backend (/me)
            const response = await fetch('http://localhost:8081/api/me', {
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`
                }
            });

            if (response.ok) {
                const claims = await response.json();
                console.log('🎫 Claims depuis backend:', claims);
                setUserClaims(claims);
            } else {
                console.error('❌ Erreur lors de la récupération des claims');
            }
        } catch (err) {
            console.error('❌ Erreur lors du chargement des données utilisateur:', err);
            setError('Erreur lors du chargement des données utilisateur');
        }
    };

    // Charger les cours (GET /courses)
    const loadCourses = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/courses', {
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('📚 Cours chargés:', data);
                setCourses(data);
                setError(null);
            } else if (response.status === 403) {
                setError('❌ Accès refusé : vous n\'avez pas les permissions pour voir les cours');
            } else {
                setError('❌ Erreur lors du chargement des cours');
            }
        } catch (err) {
            console.error('❌ Erreur de connexion:', err);
            setError('❌ Erreur de connexion au serveur');
        }
    };

    // Ajouter un cours (POST /courses - ADMIN uniquement)
    const addCourse = async () => {
        if (!newCourse.title || !newCourse.description) {
            setError('⚠️ Veuillez remplir tous les champs');
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/api/courses', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCourse)
            });

            if (response.ok) {
                const course = await response.json();
                console.log('✅ Cours ajouté:', course);
                setCourses([...courses, course]);
                setNewCourse({ title: '', description: '' });
                setError(null);
            } else if (response.status === 403) {
                setError('❌ Accès refusé : vous devez être ADMIN pour ajouter des cours');
            } else {
                setError('❌ Erreur lors de l\'ajout du cours');
            }
        } catch (err) {
            console.error('❌ Erreur lors de l\'ajout du cours:', err);
            setError('❌ Erreur de connexion au serveur');
        }
    };

    // Déconnexion
    const handleLogout = () => {
        keycloak.logout({
            redirectUri: window.location.origin
        });
    };

    // Vérifier si l'utilisateur a un rôle
    const hasRole = (role) => {
        return userClaims?.realm_access?.roles?.includes(`ROLE_${role}`) || false;
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>🔄 Chargement...</div>
            </div>
        );
    }

    if (!authenticated) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>🔐 Redirection vers la connexion...</div>
            </div>
        );
    }

    const isAdmin = hasRole('ADMIN');
    const isStudent = hasRole('STUDENT');

    return (
        <div style={styles.page}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <h1 style={styles.title}>📚 E-Learning Platform</h1>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        🚪 Déconnexion
                    </button>
                </div>
            </header>

            <main style={styles.main}>
                {/* User Info Card */}
                <div style={styles.card}>
                    <div style={styles.userHeader}>
                        <div style={styles.avatar}>👤</div>
                        <div style={{flex: 1}}>
                            <h2 style={styles.userName}>
                                {userInfo?.given_name} {userInfo?.family_name}
                            </h2>
                            <div style={styles.userDetails}>
                                <p><strong>Email:</strong> {userInfo?.email}</p>
                                <p><strong>Username:</strong> {userInfo?.preferred_username}</p>
                                <p><strong>Email vérifié:</strong> {userInfo?.email_verified ? '✅ Oui' : '❌ Non'}</p>
                            </div>
                            <div style={styles.roles}>
                                <span style={styles.rolesLabel}>🛡️ Rôles:</span>
                                {isAdmin && <span style={styles.adminBadge}>ADMIN</span>}
                                {isStudent && <span style={styles.studentBadge}>STUDENT</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                {/* Cours disponibles - STUDENT et ADMIN */}
                {(isStudent || isAdmin) && (
                    <div style={styles.card}>
                        <h2 style={styles.sectionTitle}>📖 Cours Disponibles</h2>
                        <div style={styles.coursesGrid}>
                            {courses.map(course => (
                                <div key={course.id} style={styles.courseCard}>
                                    <h3 style={styles.courseTitle}>{course.title}</h3>
                                    <p style={styles.courseDesc}>{course.description}</p>
                                </div>
                            ))}
                        </div>
                        {courses.length === 0 && (
                            <p style={styles.noCourses}>Aucun cours disponible</p>
                        )}
                    </div>
                )}

                {/* Gestion des cours - ADMIN uniquement */}
                {isAdmin && (
                    <div style={styles.card}>
                        <h2 style={styles.sectionTitle}>➕ Gestion des Cours (ADMIN)</h2>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Titre du cours</label>
                            <input
                                type="text"
                                value={newCourse.title}
                                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                style={styles.input}
                                placeholder="Ex: Spring Boot avancé"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Description</label>
                            <textarea
                                value={newCourse.description}
                                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                style={styles.textarea}
                                rows="3"
                                placeholder="Description du cours..."
                            />
                        </div>
                        <button onClick={addCourse} style={styles.addBtn}>
                            ➕ Ajouter le cours
                        </button>
                    </div>
                )}

                {/* Message si pas de rôle */}
                {!isStudent && !isAdmin && (
                    <div style={styles.warning}>
                        ⚠️ Vous n'avez pas les rôles nécessaires pour accéder aux cours.
                    </div>
                )}
            </main>
        </div>
    );
}

// Styles CSS-in-JS
const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8'
    },
    loading: {
        fontSize: '1.5rem',
        color: '#4a5568'
    },
    header: {
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '1rem'
    },
    headerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#2d3748',
        margin: 0
    },
    logoutBtn: {
        padding: '0.5rem 1rem',
        backgroundColor: '#e53e3e',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '500'
    },
    main: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    userHeader: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start'
    },
    avatar: {
        width: '60px',
        height: '60px',
        backgroundColor: '#e6f2ff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        flexShrink: 0
    },
    userName: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#2d3748',
        marginTop: 0,
        marginBottom: '0.5rem'
    },
    userDetails: {
        fontSize: '0.9rem',
        color: '#4a5568',
        lineHeight: '1.6',
        marginBottom: '0.5rem'
    },
    roles: {
        marginTop: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap'
    },
    rolesLabel: {
        fontSize: '0.9rem',
        fontWeight: '500'
    },
    adminBadge: {
        padding: '0.25rem 0.75rem',
        backgroundColor: '#fed7d7',
        color: '#c53030',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600'
    },
    studentBadge: {
        padding: '0.25rem 0.75rem',
        backgroundColor: '#c6f6d5',
        color: '#22543d',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600'
    },
    error: {
        backgroundColor: '#fed7d7',
        border: '1px solid #fc8181',
        color: '#c53030',
        padding: '1rem',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem'
    },
    warning: {
        backgroundColor: '#fefcbf',
        border: '1px solid #f6e05e',
        color: '#744210',
        padding: '1rem',
        borderRadius: '0.5rem'
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#2d3748',
        marginTop: 0,
        marginBottom: '1rem'
    },
    coursesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem'
    },
    courseCard: {
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
        padding: '1rem',
        transition: 'box-shadow 0.2s',
        cursor: 'pointer'
    },
    courseTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#2d3748',
        marginTop: 0,
        marginBottom: '0.5rem'
    },
    courseDesc: {
        fontSize: '0.9rem',
        color: '#4a5568',
        margin: 0
    },
    noCourses: {
        textAlign: 'center',
        color: '#718096',
        padding: '2rem'
    },
    formGroup: {
        marginBottom: '1rem'
    },
    label: {
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: '500',
        color: '#4a5568',
        marginBottom: '0.25rem'
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #cbd5e0',
        borderRadius: '0.375rem',
        fontSize: '1rem',
        boxSizing: 'border-box'
    },
    textarea: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #cbd5e0',
        borderRadius: '0.375rem',
        fontSize: '1rem',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        resize: 'vertical'
    },
    addBtn: {
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#4299e1',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer'
    }
};

export default App;