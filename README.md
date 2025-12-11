# Sécurisation d’une Application E-Learning avec OAuth2 / OpenID Connect (Keycloak + React + Spring Boot)
<img width="1147" height="799" alt="image" src="https://github.com/user-attachments/assets/8dba9067-e885-421a-8ed9-28994a620b91" />

<img width="1901" height="1014" alt="Screenshot 2025-12-11 145501" src="https://github.com/user-attachments/assets/219f9e00-2a6f-41e1-9e95-567747de5da3" />

## Objectif Général
Mettre en place une authentification moderne basée sur OAuth2 + OIDC dans une architecture composée de :
- Un serveur d’identité : Keycloak
- Un backend API : Spring Boot
- Un frontend SPA : React
L’objectif est de créer une plateforme E-Learning sécurisée où :
- Les STUDENT peuvent consulter les cours
- Les ADMIN peuvent gérer les cours
## Contexte du Projet
L’université déploie une nouvelle plateforme e-learning. La sécurité, la gestion centralisée des utilisateurs et le Single Sign-On sont des exigences essentielles.

La  mission consiste à :
- Configurer Keycloak
- Sécuriser Spring Boot avec OAuth2 Resource Server
- Intégrer React avec OIDC via keycloak-js
- Gérer les rôles et les accès aux différentes sections de l’application

## Structure du projet 
# Structure du Projet Spring Boot avec Base de Données

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── example/
│   │           └── elearning/
│   │               ├── ElearningApplication.java
│   │               ├── config/
│   │               │   └── SecurityConfig.java
│   │               ├── controller/
│   │               │   └── CourseController.java
│   │               ├── entity/
│   │               │   └── Course.java
│   │               ├── repository/
│   │               │   └── CourseRepository.java
│   │               └── service/
│   │                   └── CourseService.java
│   └── resources/
│       ├── application.properties
│       └── data.sql (optionnel)
└── test/
    └── java/
        └── com/
            └── example/
                └── elearning/
                    └── ElearningApplicationTests.java
```

## Étapes d'installation

### 1. Mettre à jour pom.xml
Ajoutez les dépendances pour JPA, H2/MySQL/PostgreSQL et Lombok.

### 2. Configurer application.properties
Choisissez votre base de données (H2 pour dev, MySQL/PostgreSQL pour prod).

### 3. Créer les packages et classes
- **entity** : Entités JPA (Course)
- **repository** : Interfaces Repository (CourseRepository)
- **service** : Logique métier (CourseService)
- **controller** : Endpoints REST (CourseController)
- **config** : Configuration de sécurité (SecurityConfig)

### 4. Tester l'application

#### Avec H2 Console
1. Démarrez l'application
2. Accédez à http://localhost:8081/h2-console
3. Utilisez les paramètres :
   - JDBC URL: `jdbc:h2:mem:elearningdb`
   - Username: `sa`
   - Password: (laisser vide)

#### Avec Postman
1. Obtenez un token depuis Keycloak
2. Testez les endpoints :
   - GET `/api/courses` (STUDENT ou ADMIN)
   - POST `/api/courses` (ADMIN uniquement)
   - PUT `/api/courses/{id}` (ADMIN uniquement)
   - DELETE `/api/courses/{id}` (ADMIN uniquement)

## Avantages de cette architecture

Séparation des responsabilités (Entity, Repository, Service, Controller)

Validation automatique des données avec `@Valid`

Gestion des transactions avec `@Transactional`

Sécurité par rôle avec OAuth2

Facilité de migration entre bases de données

Données initiales avec data.sql

Support CORS pour React




## PARTIE 1 — Configuration du Serveur d’Identité Keycloak

1. Installer Keycloak et créer un Realm : `elearning-realm`.
2. Créer un Client : `react-client`
   - Type : Public
   - Activer : Standard Flow (OIDC)
   - Redirect URI : `http://localhost:3000/*`
3. Créer deux rôles :
   - `ROLE_ADMIN`
   - `ROLE_STUDENT`
4. Créer deux utilisateurs :
   - `user1` → `ROLE_STUDENT`
   - `admin1` → `ROLE_ADMIN`
5. Vérifier que l’endpoint : `…/protocol/openid-connect/userinfo` renvoie bien les informations du profil connecté.

### Captures d’Écran pour la Partie 1
- Installation et création du Realm 
- Création du Client :
  <img width="1844" height="1025" alt="Screenshot 2025-12-10 215503" src="https://github.com/user-attachments/assets/aa678805-a2f8-43c5-bcd3-f6fe6e142d54" />
  <img width="1875" height="1023" alt="Screenshot 2025-12-10 220529" src="https://github.com/user-attachments/assets/7eda6bc7-791d-4a93-acef-c3d2260dbec2" />
  <img width="1890" height="1011" alt="Screenshot 2025-12-10 220543" src="https://github.com/user-attachments/assets/49c0de35-45b0-4f1a-bfe5-ee083497a56e" />
  <img width="1868" height="1014" alt="Screenshot 2025-12-10 220647" src="https://github.com/user-attachments/assets/b3b66f09-fae8-4b01-a795-8e8095986c6c" />
  <img width="1860" height="1015" alt="Screenshot 2025-12-10 220704" src="https://github.com/user-attachments/assets/6c7f9bdd-8a4f-4379-a891-5a495e8b243b" />
- Création des Rôles :
 <img width="1876" height="997" alt="Screenshot 2025-12-10 221754" src="https://github.com/user-attachments/assets/a759ac5a-741f-40ed-b5ef-0882d0711054" />
 - Création des Utilisateurs :
 <img width="1494" height="1023" alt="Screenshot 2025-12-10 221906" src="https://github.com/user-attachments/assets/0dd36420-f93b-429f-a907-f0c64de4c2bc" />
- Affecter les roles aux utilisateurs:
  <img width="1524" height="977" alt="Screenshot 2025-12-10 223240" src="https://github.com/user-attachments/assets/989f3c39-18ea-4ff0-91f8-6cdb56363ca8" />
  <img width="1496" height="991" alt="Screenshot 2025-12-10 223312" src="https://github.com/user-attachments/assets/010542ce-c49d-414a-86a6-ca0ab64efd26" />
- Vérification de l’Endpoint Userinfo :
  <img width="1704" height="966" alt="Screenshot 2025-12-10 234721" src="https://github.com/user-attachments/assets/15fc6ce9-a171-402d-a80b-c8b26006422c" />

## PARTIE 2 — Sécurisation du Backend Spring Boot

1. Créer un projet Spring Boot avec les dépendances :
   - Spring Web
   - Spring Security
   - OAuth2 Resource Server
2. Activer la validation JWT via l’issuer Keycloak.
3. Créer les endpoints :
   - GET `/courses` → accessible à STUDENT et ADMIN
   - POST `/courses` → réservé à ADMIN
   - GET `/me` → renvoie les claims du token
4. Activer la sécurité par rôle avec `@PreAuthorize`.
5. Tester les appels API via Postman :
   - Obtenir un token STUDENT → vérifier accès interdit au POST
   - Obtenir un token ADMIN → vérifier accès autorisé

### Captures d’Écran pour la Partie 2
- Création du Projet Spring Boot :
  <img width="1382" height="938" alt="image" src="https://github.com/user-attachments/assets/de7ab872-fad6-451a-9fe8-efb781d5bdec" />
- Configuration de la Validation JWT :
  <img width="1589" height="1006" alt="image" src="https://github.com/user-attachments/assets/1a9b2c52-1703-4cbf-be84-50e6df3eeb24" />
- Définition des Endpoints :
  <img width="1644" height="952" alt="image" src="https://github.com/user-attachments/assets/69e8efbb-7f27-469f-be3b-75def919c596" />
  ## Student
-  Test endpoint me en tant qu'étudiant avec l acesss token:
   <img width="1698" height="956" alt="Screenshot 2025-12-11 011923" src="https://github.com/user-attachments/assets/8135bd25-2fd1-480a-8eb6-61c3db6b26ac" />
-  Test de l'endpoint api/courses par l'étudiant:
   <img width="1691" height="947" alt="Screenshot 2025-12-11 013642" src="https://github.com/user-attachments/assets/c9c443c7-c788-4dd4-8d92-7d900f4624e8" />
-  Test via Postman (Token STUDENT - Accès Interdit) :
  <img width="1706" height="846" alt="image" src="https://github.com/user-attachments/assets/0461d0e9-96bc-48e0-b25b-f2416491f29d" />

  ## Admin 
-  Test endpoint me en tant qu'admin avec l acesss token:
  <img width="1664" height="960" alt="image" src="https://github.com/user-attachments/assets/07d89d45-3bba-4516-9219-6a1620019ef4" />
-  Test de l'endpoint api/courses par l'admin:
  <img width="1691" height="947" alt="Screenshot 2025-12-11 013642" src="https://github.com/user-attachments/assets/c9c443c7-c788-4dd4-8d92-7d900f4624e8" />
-  Test via Postman (Token ADMIN - Accès Autorisé) :
  <img width="1712" height="815" alt="image" src="https://github.com/user-attachments/assets/cd12c4a8-03b8-4ae6-89a2-128a4bf59799" />


## PARTIE 3 — Intégration du Frontend React avec Keycloak

1. Créer une app React (CRA ou Vite).
2. Installer `keycloak-js`.
3. Initialiser OIDC :
   - Authentification automatique au démarrage
   - Gestion du token et refresh
4. Récupérer les informations utilisateur via l’endpoint `/userinfo`.
5. Récupérer les rôles depuis le backend via `/me`.
6. Protéger l’interface React :
   - Section “Cours disponibles” → STUDENT + ADMIN
   - Section “Gestion des cours” → ADMIN
   - Afficher le prénom, nom, email, etc.
7. Ajouter un bouton Logout (redirection Keycloak).

### Captures d’Écran pour la Partie 3
- Création de l’App React 
- Keycloak démarré avec docker :
  <img width="1721" height="782" alt="image" src="https://github.com/user-attachments/assets/81063485-59cb-40f5-85ba-13c4385409d1" />
- Installation de keycloak-js :
 <img width="1685" height="355" alt="image" src="https://github.com/user-attachments/assets/f9145837-a801-4548-b195-ad92100964ea" />
- Récupération des Informations Utilisateur :
  <img width="491" height="457" alt="image" src="https://github.com/user-attachments/assets/18136414-b761-45c5-9ebd-1b60b552bb60" />
  <img width="1889" height="1049" alt="image" src="https://github.com/user-attachments/assets/5053b941-c4e6-485e-b60f-85c4fcd6fdcb" />
- Interface Protégée (Section Cours) :
 <img width="1891" height="1055" alt="image" src="https://github.com/user-attachments/assets/2a85a751-2830-4027-b52d-37fde09573de" />
- ## Note : interface de gestion consacré seulement à l'administrateur
- Interface Protégée (Section Gestion) :
 <img width="1873" height="1041" alt="image" src="https://github.com/user-attachments/assets/3fbb0744-c45b-4195-9acf-3e5f255e84f0" />
<img width="1916" height="970" alt="image" src="https://github.com/user-attachments/assets/5c1d1ec7-7d88-4db7-9919-b2ab25401f23" />
<img width="1819" height="817" alt="image" src="https://github.com/user-attachments/assets/5f9024fb-1d09-4822-87a3-952c38de4502" />

- Bouton Logout :
 <img width="1863" height="874" alt="image" src="https://github.com/user-attachments/assets/be7462fb-3ee8-41fa-a787-8dbb348faf66" />
- Déconnexion: 
<img width="1885" height="1030" alt="image" src="https://github.com/user-attachments/assets/3e07d2c2-a237-44ac-a5e3-4d534e85681d" />


## PARTIE 4 — Communication Sécurisée React → Spring Boot: - Déjà implémenté

1. Dans chaque appel API, envoyer le token : `Authorization: Bearer <access_token>`
2. Récupérer depuis React :
   - Liste des cours (GET `/courses`)
   - Ajouter un cours (POST `/courses`) → ADMIN uniquement
3. Gérer les erreurs :
   - 401 → token invalide
   - 403 → rôle insuffisant
4. Mettre en place une redirection vers Keycloak en cas d’expiration de session.

  
## Instructions d’Installation et d’Exécution
1. **Keycloak** : Téléchargez et lancez Keycloak, configurez le Realm comme décrit.
2. **Backend Spring Boot** : Clonez le repo, lancez avec `mvn spring-boot:run`.
3. **Frontend React** : Clonez le repo, installez les dépendances avec `npm install`, lancez avec `npm start`.
4. Assurez-vous que les ports sont corrects (Keycloak: 8080, Spring Boot: 8081, React: 3000).

## Technologies Utilisées
- Keycloak pour l’authentification
- Spring Boot pour le backend
- React pour le frontend
- OAuth2 / OpenID Connect pour la sécurité

## Auteur
- Malak Zaidi 
