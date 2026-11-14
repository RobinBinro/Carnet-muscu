# Carnet de muscu

Application web de suivi des séances de musculation : modèles de séance par jour, saisie des séries
(poids, répétitions), historique, courbes de progression, export CSV.

- **Hébergement** : GitHub Pages (fichiers statiques, aucun serveur à gérer).
- **Données** : Firebase (Firestore), avec une copie sur le téléphone pour fonctionner hors ligne.
- **Connexion** : e-mail et mot de passe (Firebase Authentication).

Les libellés des consoles Firebase et GitHub peuvent varier légèrement par rapport à cette notice.

## 1. Créer le projet Firebase (une seule fois)

1. Va sur https://console.firebase.google.com et crée un projet (Google Analytics n'est pas nécessaire).
2. **Authentication** : ouvre la rubrique, puis dans les méthodes de connexion active **E-mail/Mot de passe**.
3. **Firestore Database** : crée la base en mode production et choisis un emplacement en Europe
   (par exemple `europe-west9`, Paris). L'emplacement ne peut plus être changé ensuite.
4. Dans Firestore, onglet **Règles** : remplace le contenu par celui du fichier `firestore.rules`
   de ce dépôt, puis publie. Sans ces règles, l'appli affichera un message d'accès refusé.
5. **Paramètres du projet** > **Vos applications** : ajoute une application **Web**, puis copie
   l'objet `firebaseConfig` affiché.

## 2. Relier l'appli au projet

Ouvre `firebase-config.js` et remplace `null` par l'objet copié :

```js
window.FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Ces valeurs ne sont pas des secrets : elles identifient le projet. Ce sont les règles Firestore
et ta connexion qui protègent tes données.

## 3. Mettre en ligne sur GitHub Pages

1. Crée un dépôt **public** (GitHub Pages est gratuit sur les dépôts publics) et dépose-y tous les
   fichiers de ce dossier, à la racine.
2. Dans le dépôt : **Settings** > **Pages** > source **Deploy from a branch**, branche `main`,
   dossier `/ (root)`, puis enregistre.
3. Après une à deux minutes, l'appli est en ligne à l'adresse
   `https://TON-COMPTE.github.io/NOM-DU-DEPOT/`.

Si la connexion est refusée pour une raison de domaine, ajoute `TON-COMPTE.github.io` dans
Authentication > Paramètres > Domaines autorisés.

## 4. Installer sur l'iPhone

1. Ouvre l'adresse de l'appli dans **Safari**.
2. Partager > **Sur l'écran d'accueil** > active **Ouvrir comme app web** > Ajouter.
3. Lance l'appli depuis son icône, puis touche **Créer mon compte** (e-mail + mot de passe).
   La première connexion nécessite internet ; ensuite l'appli fonctionne aussi hors ligne.

Une fois ton compte créé, tu peux empêcher toute autre inscription : console Firebase >
Authentication > Paramètres > actions des utilisateurs > décoche la création de compte.

## 5. Récupérer l'historique de l'ancienne version

Dans l'ancienne appli (sur Claude), onglet Progression > **Télécharger une sauvegarde**.
Dans celle-ci, onglet Séances > **Restaurer une sauvegarde**, puis choisis ce fichier.

## Sécurité des données

- Chaque série saisie est enregistrée sur le téléphone, puis envoyée sur Firestore dès qu'il y a
  du réseau. L'indicateur en haut à droite affiche « Synchronisé » ou « En attente de réseau ».
- Nouveau téléphone : installe l'appli, connecte-toi, l'historique revient.
- En complément, télécharge une sauvegarde de temps en temps (onglet Séances > Compte et
  sauvegarde) et garde le fichier ailleurs que sur le téléphone.
- Ne te déconnecte pas tant que l'indicateur affiche « En attente de réseau ».

## Mettre l'appli à jour

Remplace les fichiers dans le dépôt. L'appli est servie depuis le cache du téléphone pour démarrer
instantanément ; une nouvelle version apparaît donc au **deuxième** lancement après la mise en ligne.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | L'application (interface et logique) |
| `firebase-config.js` | Configuration de ton projet Firebase, à renseigner |
| `firestore.rules` | Règles de sécurité à coller dans la console Firestore |
| `vendor/firebase.js` | Bibliothèque Firebase 13.3.0 (licence Apache 2.0), incluse pour le hors-ligne |
| `sw.js` | Mise en cache pour le fonctionnement hors ligne |
| `manifest.webmanifest`, `icons/` | Nom, icône et affichage plein écran |
| `fonts/` | Polices Barlow et Barlow Condensed (licence SIL Open Font) |
