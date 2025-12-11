-- Insérer des cours d'exemple
-- Créez ce fichier dans src/main/resources/data.sql

INSERT INTO courses (title, description, instructor, duration_hours, created_at, updated_at)
VALUES
    ('Introduction à Spring Boot', 'Apprenez les bases de Spring Boot et créez votre première application', 'Dr. Ahmed Hassan', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('React pour Débutants', 'Maîtrisez React et développez des applications web modernes', 'Prof. Sarah Martin', 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Sécurité OAuth2 avec Keycloak', 'Sécurisez vos applications avec OAuth2 et OpenID Connect', 'Dr. Mohammed Ali', 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Développement Full Stack', 'Devenez développeur Full Stack avec Spring et React', 'Prof. Fatima Zahra', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Bases de données avec JPA', 'Apprenez à gérer vos données avec Spring Data JPA', 'Dr. Youssef Bennani', 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);