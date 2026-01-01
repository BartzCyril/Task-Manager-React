# Gestionnaire de Tâches (React)

# MDV - Tests et sécurité des applications - PROJET

## Phase 1 - Observation

### 1.1 - Test manuel de l'app Individuel

#### État du front

##### Page d'accueil

| **Aspect**                  | **Problème détecté**                                                                                          | **Suggestions d'amélioration**                                                                                           |
|-----------------------------|--------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| **Design (UI)**             | - Couleur de fond trop vive                                                      | - Utiliser une couleur plus douce en arrière-plan.                                                                              |
|                             | - Positionnement désordonné des éléments (texte en haut à gauche).                                           | - Centrer ou aligner correctement le texte.                                                                               |
| **Manque d'identité visuelle** | - Absence de logo                                            | - Ajouter un logo ou une bannière en haut de la page.                                                                    |
|                             | - Aucun élément structurant pour organiser le contenu.                                                       | - Ajouter des sections ou des séparations visuelles pour structurer la page.                                             |
| **Accessibilité**           | - Contraste insuffisant entre le texte noir et le fond bleu pour les personnes ayant des déficiences visuelles.| - Améliorer le contraste pour respecter les normes d'accessibilité (WCAG).                                               |
|                             | - Pas de support pour les lecteurs d'écran ni de navigation alternative.                                     | - Ajouter des balises ARIA et indiquer les raccourcis claviers.                                                          |
| **Expérience utilisateur (UX)** | - Le lien "go to login page" n'est pas présenté comme un bouton, ce qui peut être confus.                    | - Transformer le lien en bouton bien visible avec un design clair.                                                       |
|                             | - Message d'accueil peu informatif ("Welcome to DTM! (Dumb Task Manager)").                                  | - Ajouter une courte description expliquant les fonctionnalités ou l’objectif de l'application.                         |
|                             | - Absence d'explication, on ne sait pas pourquoi on doit se connecter                                 |       - Ajouter une phrase expliquant la raison ou les avantages de la connexion.               |                                                              | 
|                             | - On ne peut pas se déconnecter                                |       - Ajouter un bouton de déconnection.               |                                                              | 
|                             | - Le numéro de tâche correspond à l'id de la tâche et non le numéro de la tâche créer par l'utilisateur                                |       - Il faut utiliser le numéro de la tâche crée par l'utilisateur    |                                                              | 
|                             | - Task completed est inutile                                |       - Il n'y a aucun indicateur pour dire si la tâche est faite où non               |                                                              | 

##### Page d'inscription et de connexion

| **Aspect**                  | **Problème détecté**                                                                                                   | **Suggestions d'amélioration**                                                                                           |
|-----------------------------|-----------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| **Design (UI)**             | - Couleur de fond turquoise trop vive, similaire à la page d'accueil.                                                | - Utiliser une couleur plus douce.                                                                                       |
|                             | - Alignement des champs incorrect : les champs de formulaire sont alignés horizontalement, rendant la lecture difficile.| - Aligner verticalement les champs pour une meilleure lisibilité et organisation.                                        |
|                             | - Bouton "Register!" peu visible et non attractif.                                                                   | - Utiliser un bouton plus grand avec un design clair et attractif.                                                       |
| **Accessibilité**           | - Pas d'indication sur les formats attendus (ex. email, mot de passe, etc.).                                           | - Ajouter des placeholders ou des labels expliquant les formats requis (ex. "Enter a valid email").                      |
|                             | - Absence de contrôle de saisie ou de messages d'erreur en cas de données incorrectes ou incomplètes.                  | - Implémenter une validation des champs et afficher des messages d'erreur clairs et descriptifs.                         |
| **Expérience utilisateur (UX)** | - Pas d'informations sur l’objectif de l'inscription ou sur ce qui se passe après.                                      | - Ajouter une explication claire du processus d'inscription et des étapes suivantes.                                     |
|                             | - L'utilisateur peut saisir des données invalides ou incomplètes sans avertissement.                                  | - Vérifier les champs avant soumission (ex. email valide, mot de passe suffisamment long).                                |
|                             | - La connexion au serveur échoue, entraînant une erreur générique.                                                    | - Vérifier si le serveur est en cours d'exécution et si les ports sont configurés correctement (par défaut `localhost:3000`). |
|                             | - Le formulaire d'inscription utilise la méthode GET, exposant les données sensibles dans l'URL.                      | - Utiliser la méthode POST pour transmettre les données de manière sécurisée.                                            |
|                             | - Dans le champ "mot de passe", le texte saisi est visible en clair.                                                  | - Configurer le champ "mot de passe" pour masquer le texte à l'aide de l'attribut `type="password"`.                     |
|                             | - Champ "confirmation mot de passe" manquant.                                                                        | - Ajouter un champ de confirmation pour que l'utilisateur puisse vérifier la saisie de son mot de passe.                 |
| **Fonctionnalité**          | - Pas de contrôle sur les champs de saisie, aucune validation des données (ex. email non valide accepté).              | - Ajouter une validation côté client (JS) et côté serveur pour empêcher l'envoi de données incorrectes.                  |
|                             | - La connexion échoue car le serveur semble inaccessible, mal configuré ou une erreur sur les champs envoyés par le formulaire. | - Assurer que le serveur est démarré correctement, que les routes sont configurées, que les dépendances sont installées et que les données sont correctement utilisées. |
|                             | - Aucun retour en cas de succès ou d'échec sur la page d'inscription.                                                 | - Afficher un message de confirmation pour une inscription réussie ou des erreurs si elle échoue.                        |

### 1.2 - Tentatives d'attaque de l'app Individuel

| **Méthode d'Attaque**       | **Description**                                                                                                                                              | **Résultat**                                                                                              | **Solution Proposée**                                                                                                                                                                                                                                                                                       |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **BAC (Bypass Access Control)** | Accès à la page admin sans authentification.                                                                                                              | Possible : La page est accessible directement sans vérification.                                         | Ajouter un middleware d'authentification                                           |
|                             |                                                                                                                                                              |                                                                                                          | Implémenter un contrôle des rôles pour l'accès admin                                                                                                                             |
| **Suppression de tâches sans authentification** | Les tâches d’un utilisateur peuvent être modifiées ou supprimées sans authentification.                                                             | Possible : Les requêtes ne vérifient pas si l'utilisateur est connecté et autorisé.                      | Ajouter une vérification d'autorisation                             |
| **CSRF (Cross-Site Request Forgery)** | Requête envoyée via un formulaire externe pour supprimer une tâche sans l’autorisation de l’utilisateur.                                               | Possible : Test réussi avec le formulaire suivant : ```html<br><!DOCTYPE html><br><html lang="fr"><br><head><br>    <meta charset="UTF-8"><br>    <title>Test CSRF</title><br></head><br><body><br>    <form action="http://localhost:3000/tasks/remove" method="GET"><br>        <input type="hidden" name="taskId" value="1"><br>        <input type="hidden" name="userId" value="1"><br>        <button type="submit">Envoyer</button><br>    </form><br></body><br></html><br>``` | Configurer les cookies avec `SameSite=Lax` ou `SameSite=Strict` Ajouter un token CSRF |
| **XSS (Cross-Site Scripting)** | Injection de code JavaScript malveillant dans les entrées utilisateur pour exécuter des scripts sur d'autres utilisateurs.                                  | Aucun vecteur exploitable trouvé : Les entrées semblent protégées contre les injections.                 |                                                                                   |
| **Injection SQL**           | Test avec `sqlmap` pour vérifier les vulnérabilités sur les paramètres dans les requêtes SQL.                                                                | Aucun vecteur exploitable trouvé : Les requêtes semblent sécurisées.                                     |                                                                                              |


### 1.3 - Etat de la codebase Individuel
#### Models
| **Problème**              | **Description**                                                                                                                                         | **Solution**                                                                                                                                                                   |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Connexion à la base de données** | Connexion répétée dans chaque fichier, ce qui entraîne une duplication.                                                                                  | Centraliser la connexion dans un fichier comme `app.js` et l'importer où nécessaire.                                                                                        |
| **Validation des entrées**        | Absence de validation des paramètres pour les méthodes, ce qui rend le code vulnérable aux erreurs et à la mauvaise utilisation.                        | Valider systématiquement les entrées avec conditions explicites.                                                      |
| **Gestion des erreurs**           | Plusieurs méthodes ne gèrent pas correctement les erreurs (ex. : ne pas transmettre l'erreur dans le `callback` ou laisser des erreurs silencieuses).   | Respecter la convention `callback(err, result)` pour toutes les méthodes. Toujours vérifier et transmettre les erreurs.                                                     |
| **Prévention des injections SQL** | Certaines requêtes utilisent des concaténations de chaînes pour intégrer des paramètres, ce qui ouvre la porte aux injections SQL.                      | Utiliser des requêtes paramétrées pour toutes les interactions avec la base de données.                                                                                     |
| **Logging**                       | Usage de `console.log` et `console.error` pour gérer les logs, ce qui n’est pas adapté pour la production.                                              | Adopter une bibliothèque de journalisation comme `winston` un suivi structuré des erreurs et des événements (recevoir un email dès qu'il y a une erreur).                                                |
| **Mot de passe en clair**         | Le fichier `User.js` compare les mots de passe directement, sans utiliser de hash sécurisé.                                                            | Implémenter un hashage des mots de passe avec des outils comme `bcrypt` pour sécuriser l’authentification.                                                                  |

#### Views 
| **Problème**                                           | **Description**                                                                                                                                           | **Solution**                                                                                                   |
|--------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| **Absence de vérification des entrées côté client**    | Il n'y a aucune vérification ou validation des champs de formulaire côté client, ce qui permet à l'utilisateur de soumettre des données incorrectes ou incomplètes. | Ajouter une validation des entrées côté client en JavaScript pour s'assurer que les données sont correctes avant l'envoi.  |
| **Absence de lien entre les `<label>` et les `<input>`** | Les labels ne sont pas associés aux champs de formulaire, ce qui nuit à l’accessibilité pour les utilisateurs et les outils comme les lecteurs d’écran.   | Ajouter l’attribut `for` aux `<label>` et lui assigner l’`id` correspondant des `<input>`.                     |
| **Méthodes des formulaires sensibles**                 | Les formulaires sensibles comme la connexion ou l’enregistrement utilisent une méthode `GET` au lieu de `POST`, exposant les données dans l'URL.          | Utiliser la méthode `POST` pour tous les formulaires contenant des données sensibles comme les mots de passe. |
| **Messages d’erreur utilisateur absents**              | Pas de retour visuel sur les erreurs pour guider les utilisateurs en cas de problème (ex. : champ obligatoire non rempli).                                | Implémenter des messages d’erreur clairs à afficher sous ou près des champs concernés.                         |
| **Manque d'instructions dans les formulaires**         | Les formulaires manquent d’indications claires sur le format attendu (ex. : mot de passe, email, etc.).                                                   | Ajouter des `placeholder`, des descriptions ou des info-bulles pour guider les utilisateurs.                  |
| **La mise en commun des balises**         | Des sections comme le header sont dupliquées dans plusieurs fichiers, ce qui complique les mises à jour et la gestion des modifications.                                                 | Regrouper les balises dans des fichiers communs.                  |

#### app.js

| **Problème**                                               | **Description**                                                                                                                                                               | **Solution**                                                                                                      |
|------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| **Utilisation de `var` au lieu de `let` ou `const`**        | L'utilisation de `var` pour déclarer des variables peut entraîner des problèmes de portée (scope) et des comportements inattendus dans le code.                                 | Remplacer `var` par `let` ou `const` en fonction de la nécessité de redéclarer la variable.                        |
| **Gestion des cookies et des attaques CSRF**               | La gestion des sessions via `express-session` peut être vulnérable aux attaques CSRF si les cookies ne sont pas correctement sécurisés.                                         | Ajouter des options de sécurité aux cookies (ex. : `httpOnly: true`, `secure: true`, `sameSite: 'strict'`) pour limiter les risques de CSRF et garantir que les cookies sont uniquement envoyés par des connexions HTTPS. |
| **Sécurisation des cookies de session**                    | Les cookies de session peuvent être interceptés ou volés s'ils ne sont pas configurés correctement.                                                                          | Configurer `cookie.secure = true` et `cookie.httpOnly = true` dans les options de session pour sécuriser les cookies. |
| **Mauvaise gestion des erreurs**                            | Aucune gestion des erreurs en cas de requêtes échouées ou de problème de session, ce qui peut entraîner une mauvaise expérience utilisateur.                                    | Ajouter un gestionnaire d'erreurs global pour gérer les erreurs et rendre l'application plus robuste.               |

#### Routes

| **Problème**                                                 | **Description**                                                                                                                                                               | **Solution**                                                                                                      |
|--------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| **Utilisation de `var` dans les routes**                     | L'utilisation de `var` dans les routes peut entraîner des problèmes de portée (scope) et des comportements inattendus dans le code.                                             | Remplacer `var` par `let` ou `const` dans toutes les déclarations de variables dans les routes.                  |
| **Validation des données (`req.body` ou `params`)**          | Il n'y a aucune vérification des données reçues dans les requêtes (par exemple `req.body` ou `req.params`), ce qui peut entraîner l'insertion ou l'utilisation de données incorrectes. | Ajouter des validations pour vérifier la cohérence des données reçues dans `req.body` ou `req.params`. Utiliser des bibliothèques comme `express-validator` ou des vérifications manuelles pour s'assurer que les données sont valides. |
| **Absence de messages d'erreur pour les données invalides**  | Lorsqu'une donnée est manquante ou incorrecte, il n'y a pas de retour d'erreur clair pour l'utilisateur.                                                                     | Retourner des messages d'erreur explicites lorsque les données sont invalides (par exemple, "Email invalide" ou "Mot de passe manquant"). |
| **Manque de protection des routes sensibles**                | Certaines routes sensibles, comme la connexion ou l'inscription, ne sont pas protégées contre les accès non autorisés.                                                        | Utiliser des middlewares pour protéger les routes sensibles, comme un middleware de vérification de session ou d'authentification avant d'accéder aux routes. |
| **Incohérence dans les noms de route**                       | Les noms de routes pour des actions similaires (par exemple, `login` et `register`) ne sont pas cohérents.                                                                    | Harmoniser les noms des routes. Par exemple, utiliser `/user/login` et `/user/register` pour des actions similaires, afin de respecter une structure uniforme et cohérente dans l'API. |

#### BDD

Mettre en place une gestion de droits d'accès afin que chaque utilisateur est chacun leurs droits. Par exemple que seul les administrateurs on accés à la route /admin. Que seul les utilisateurs connectés on accès à la route /task et accès uniquement à leurs informations. Les solutions peuvent être :

Mettre un champ dans la base de données afin de déterminer si l'utilisateur est administrateur ou non et vérifier dans le code si la valeur est bien à 1. Si il est un 1 on le laisse accès à la page, sinon on le redirige sur une autre page.
Pour les routes en /tasks on vérifie que l'utilisateur est connecté grâce à la présence d'un token JWT. Ce même token permettra à l'utilisateur d'intéragir avec ces données et non celle des autres.

#### Package.json

Mettre à jour les dépendances.

#### Global

Dans certains fichiers, il y a des problèmes au niveau de l'indentation. Cela empêche le bon maintient du code

#### Qualité des tests
Les tests n'existent pas.


# Post-Mortem
## Déroulement de l'application
Dans un premier temps, nous avons analysé l’application afin d’identifier les dysfonctionnements, les failles de sécurité et les pistes d’amélioration.
Ensuite, nous avons mis en commun notre travail pour rassembler tous les éléments à prendre en compte lors de notre développement.
Nous nous sommes réparti les tâches en fonction des corrections à apporter. Cyril s’est chargé de la refonte du front-end, incluant une amélioration graphique, l’implémentation de la gestion des erreurs côté front, ainsi que la mise en place de la fonctionnalité de liste de tâches (CRUD). Pierre, quant à lui, a pris en charge la refonte du back-end, avec l’implémentation de la gestion des erreurs, des sessions et des tokens.
La deuxième étape consistait à fusionner nos travaux, corriger les incompatibilités et effectuer des tests globaux sur l’application.
Par la suite, nous avons réalisé des tests unitaires et fonctionnels, tout en mettant en place GitHub Actions. Cette phase a été menée en pair-programming.
Enfin, nous avons conclu avec des tests de bout en bout (E2E) à l’aide de Cypress.

## Comment êtes vous particulièrement satisfait?
Notre collaboration s’est très bien déroulée. Nous avons apprécié travailler aussi bien individuellement qu’en équipe. Globalement, nous sommes satisfaits de l’application : nous avons pris plaisir à la développer, et elle nous a permis de mettre en pratique différentes thématiques comme les tests unitaires et fonctionnels avec Jest et Supertest, les tests de bout en bout (E2E) avec Cypress, ainsi que la création de scripts GitHub Actions.

## De quoi n'êtes vous pas satisfait ? Qu'est-ce qui aurait pu être amélioré ?
Le principal problème que nous avons rencontré concernait la gestion des pull-requests. Lorsque plusieurs pull requests étaient ouvertes simultanément, nous faisions souvent face à des conflits, des commits dupliqués, et parfois le code pouvait se casser après un merge si les conflits n’étaient pas résolus correctement. Par ailleurs, par souci de temps et de simplicité, nous avons utilisé SQLite comme base de données. Cependant, cette solution présente des limites : elle n’est pas protégée par des identifiants, ce qui réduit la sécurité, et elle est moins adaptée pour des projets nécessitant une gestion avancée des accès ou des utilisateurs.

Pistes d'améloration :
- Limiter le nombre de pull requests ouvertes en parallèle
- Veiller à ce que chacun travalle sur des fichiers différents pour éviter les chevauchements (par exemple, lorsqu’une personne travaille sur une fonctionnalité, elle devrait se limiter à certains fichiers spécifiques, tandis qu’une autre s’occupe d’une tâche touchant à d’autres fichiers).
- Porter une plus grande attention lors des rebases et tester davantage notre code pour garantir sa stabilité.
- Utiliser une base de données plus robuste et sécurisée, comme PostgreSQL ou MySQL.

## Quelles difficultés avez-vous surmontées ? Comment auriez-vous pu éviter celà ?
Pierre et Cyril : l’implémentation des tests unitaires et fonctionnels. Nous n’avions pas beaucoup de connaissances sur Jest et Supertest. De plus, nous avons perdu pas mal de temps à comprendre comment créer une base de données dédiée uniquement aux tests (mocks).


# Documentation technique
## Initialisation du projet
Pour installer le projet, vous devez ouvrir un terminal à la racine du projet et tapez la commande : 
```
npm install
```
Vous devez également à la racine du projet un ```.env```. Vous trouverez une copie dans le rendu sur NetYParéo.
Egalement sur NetYParéo. Vous trouverez une copie d'une nouvelle version de la base de données nécessaire au fonctionnement de l'application.

Une fois tous ça fait, vous pouvez démarrer l'application avec la commande :
```
npm start
```

## Technologies utilisées
Sur ce projet nous utilisons les technologies suivantes :
- bycript (5.1.1) : pour le hashage des mots de passe
- cookie-parser (1.4.7) : pour la gestion des cookies
- dotenv (16.4.7) : pour l'utilisation des variables d'enrinements sur le projet
- ejs (3.1.10) : pour le rendu des vues
- express-session (1.17.3) : pour la gestion des sessions
- jsonwebtoken (9.0.2) : pour la gestion des tokens JWT
- sqlite3 (5.1.6) : langage de la base de données
- cypress (13.16.1) : pour les tests e2e
- jest (29.7.0) : pour les tests unitaires et fonctionnelles

## Organisation du code
Votre projet doit avoir l'achitecture suivante :
- config
  - database.js
  - seed-memory-database.js
  - tasks.sqlite
- cypress
  - e2e
    - admin.cy.js
    - login.cy.js
    - register.cy.js
    - task.cy.ts
  - fixtures
    - example.json
  - support
    - commands.js
    - e2e.js
- middlewares
  - admin.js
  - logged.js
  - token.js
- models
  - task.js
  - user.js
- public
  - css
    - styles.css
  - js
    - api.js
    - auth-validation.js
    - todos.js
- routes
  - admin.js
  - auth.js
  - tasks.js
- tests
  - admin.spec.js
  - login.spec.js
  - register.spec.js
  - task.spec.js
- views
  - components
    - footer.ejs
    - header.ejs
  - admin.ejs
  - index.ejs
  - login.ejs
  - register.ejs
- .env
- .gitignore
- app.js
- cypress.config.js
- server.js

Le dossier `config` sert à stocker la base de données mais aussi les fichiers pour se connecter à la base de données et alimenter la base de données pour les tests unitaires et fonctionnelles.

Le dossier `cypress` stock les tests e2e de l'application (dans le dossier `e2e`). Vous pouvez configurer cypress dans le fichier à la racine `cypress.config.js`

Le dossier `middlewares` sert à faire des contrôles lors des appels de certaines routes. On peu vérifier si l'utilisateur est admin, connecter où à un token.

Le dossier `models` sert à stocker les requêtes SQL.

Le dossier `public` stock les fichiers javascripts et css

Le dossier `routes` sert à stocker toutes les routes

Le dossier `tests` sert à stocker tous les tests unitaires et fonctionnels.

Le dossier `views` stock tous les fichiers qui permet de faire la virtualisation

## Fonctionnement de la session
La session sert à prouver l'authentification de l'utilisateur afin qu'il accède à certaines fonctionnalités du site. Ele sert pour charger ces données ou pour vérifier si c'est un admin ou non

## Fonctionnement du token JWT
Le token JWT sert à vérifier que la personne qui fait une action (par exemple ajouter une tâche) est bien la bonne personne

## Fonctionnement des tests unitaires et fonctionnels
Les tests unitaires et fonctionnels sont stockés dans le dossier `tests`. Pour les exécuter, il faut taper la commande :
```
npm run tests
```
Les tests unitaires et fonctionnels s'exécute automatiquement après la création de chaque PR

## Fonctionnnement des tests e2e
Les tests e2e sont gérés par cypress. Pour lancer les tests e2e, vous devez avoir le projet en cours d'exécution. Sur un autre terminal, tapez la commande :
```
npm run cy:open
```
Une interface graphique devrait s'ouvrir. Selectionnez "E2E Testing" puis, sélectionnez votre navigateur. Au démarrage du navigateur, Cypress vous listera tous les fichiers de tests. Tout comme pour les tests unitaires, les tests e2e, s'exécute automatiquement après cette PR créer

## Fonctionnement des tâches
Vous pouvez créer des tâches en étant hors connexion. Les tâches seront stockés dans le cache du navigateur et se syncroniserons à la connexion d'un compte. Les tâches ce chargerons normalement à la connexion d'un compte et vous pouvez vous en ajouter, modifier, supprimer.
