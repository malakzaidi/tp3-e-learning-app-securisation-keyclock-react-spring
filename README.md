# Sécurisation d’une Application E-Learning avec OAuth2 / OpenID Connect (Keycloak + React + Spring Boot)
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

Votre mission consiste à :
- Configurer Keycloak
- Sécuriser Spring Boot avec OAuth2 Resource Server
- Intégrer React avec OIDC via keycloak-js
- Gérer les rôles et les accès aux différentes sections de l’application

## Schéma d’Architecture
Voici un schéma simplifié de l'architecture (Keycloak ↔ React ↔ Spring Boot) :

[Insérez ici un schéma d'architecture, par exemple via Draw.io ou un outil similaire]

![Schéma d'architecture](path/to/architecture-schema.png)

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
   img width="1698" height="956" alt="Screenshot 2025-12-11 011923" src="https://github.com/user-attachments/assets/8135bd25-2fd1-480a-8eb6-61c3db6b26ac" />
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
- Création de l’App React :
  ![Screenshot - Création App React](path/to/screenshot-part3-app-creation.png)
- Installation de keycloak-js :
  ![Screenshot - Installation keycloak-js](path/to/screenshot-part3-install.png)
- Initialisation OIDC :
  ![Screenshot - Initialisation OIDC](path/to/screenshot-part3-oidc-init.png)
- Récupération des Informations Utilisateur :
  ![Screenshot - Userinfo](path/to/screenshot-part3-userinfo.png)
- Récupération des Rôles via /me :
  ![Screenshot - Rôles via /me](path/to/screenshot-part3-roles.png)
- Interface Protégée (Section Cours) :
  ![Screenshot - Section Cours](path/to/screenshot-part3-cours-section.png)
- Interface Protégée (Section Gestion) :
  ![Screenshot - Section Gestion](path/to/screenshot-part3-gestion-section.png)
- Bouton Logout :
  ![Screenshot - Bouton Logout](path/to/screenshot-part3-logout.png)

## PARTIE 4 — Communication Sécurisée React → Spring Boot

1. Dans chaque appel API, envoyer le token : `Authorization: Bearer <access_token>`
2. Récupérer depuis React :
   - Liste des cours (GET `/courses`)
   - Ajouter un cours (POST `/courses`) → ADMIN uniquement
3. Gérer les erreurs :
   - 401 → token invalide
   - 403 → rôle insuffisant
4. Mettre en place une redirection vers Keycloak en cas d’expiration de session.

### Captures d’Écran pour la Partie 4
- Envoi du Token dans les Appels API :
  ![Screenshot - Envoi Token](path/to/screenshot-part4-token-send.png)
- Récupération Liste des Cours :
  ![Screenshot - GET Courses](path/to/screenshot-part4-get-courses.png)
- Ajout d’un Cours (POST) :
  ![Screenshot - POST Courses](path/to/screenshot-part4-post-courses.png)
- Gestion des Erreurs (401/403) :
  ![Screenshot - Erreurs 401-403](path/to/screenshot-part4-errors.png)
- Redirection en Cas d’Expiration :
  ![Screenshot - Redirection Expiration](path/to/screenshot-part4-redirection.png)

## PARTIE 5 — Livrable et Rapport

1. Schéma d’architecture (inclus ci-dessus).
2. Captures d’écran :
   - Connexion réussie :
     ![Screenshot - Connexion Réussie](path/to/screenshot-part5-connexion.png)
   - Informations du profil :
     ![Screenshot - Informations Profil](path/to/screenshot-part5-profil.png)
   - Rôles affichés dans React :
     ![Screenshot - Rôles dans React](path/to/screenshot-part5-roles-react.png)
   - Appels API autorisés / interdits :
     ![Screenshot - Appels API Autorises](path/to/screenshot-part5-api-autorises.png)
     ![Screenshot - Appels API Interdits](path/to/screenshot-part5-api-interdits.png)

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

## Auteurs
- Malak Zaidi 
