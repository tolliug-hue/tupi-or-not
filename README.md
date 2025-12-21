# 📻 TUPI OR NOT - ARCHIVES COMPLÈTES
## L'émission qui mange toutes les musiques

## 📝 Description du Projet

Ce projet est une application web moderne (Single Page Application - SPA) conçue pour unifier les archives de l'émission de radio "Tupi or not". Il centralise les contenus audio et les données de playlist, offrant une expérience utilisateur fluide et riche en fonctionnalités d'exploration.

Le site est construit sur une architecture **Next.js/TypeScript/Tailwind** pour garantir performance et maintenabilité.

## 🔗 Configuration des Données (Back-Office)

Le site utilise un Google Sheet [Tupi archive](https://docs.google.com/spreadsheets/d/1uleTx21WDbeTGSgiybSn3Uu0Zt5yqCyeD8B7KCS-vik/edit?usp=sharing)  comme unique source de données. Toute modification dans ce fichier est répercutée sur le site.

| Onglet | Rôle | Lien CSV Public |
| :--- | :--- | :--- |
| **Emissions** | Métadonnées de l'émission (Numéro, Date, Invité, Plateforme). | [Lien CSV Émissions](https://docs.google.com/spreadsheets/d/e/2PACX-1vSufSOVQkT11EZaJAGQ5RbC7E01QFcUmjPUHI8FSNjbqEg7L5tcuUBZzJRKRi0AXoLD5llJe1PP8_8b/pub?gid=43357015&single=true&output=csv) |
| **Playlists** | Détails des titres (Artiste, Titre, Proposé par, Genre). | [Lien CSV Playlists](https://docs.google.com/spreadsheets/d/e/2PACX-1vSufSOVQkT11EZaJAGQ5RbC7E01QFcUmjPUHI8FSNjbqEg7L5tcuUBZzJRKRi0AXoLD5llJe1PP8_8b/pub?gid=1302606414&single=true&output=csv) |

## 🎧 Expérience de Lecture et d'Exploration

### 1. Lecture Audio (Expérience Unifiée)

*   **Accès :** Un clic sur la vignette de l'émission ouvre une modale de lecture.
*   **Lecteur :** Le site utilise le lecteur natif de **Mixcloud** (pour les anciennes émissions) ou d'**Archive.org** (pour les récentes).
*   **Design :** Le lecteur est présenté de manière uniforme : une image de l'émission au centre, surmontant une barre de contrôle audio compacte.
*   **Lecture :** Le lancement de la lecture est manuel (Click-to-Play) pour garantir la compatibilité avec les navigateurs mobiles et éviter les bugs d'affichage (politiques anti-autoplay).

### 2. Exploration Avancée

*   **Navigation Fluide :** Chargement progressif des émissions (Pagination "Load More") pour une navigation rapide et réactive, même sur mobile
*   **Recherche Instantanée :** Barre de recherche en haut de page pour filtrer en temps réel par **Artiste, Titre, Invité, Date, Numéro d'émission et Genre**.
*   **Explorateur de Tags :** Bloc unique (Accordéon/Toggle) permettant de basculer entre le nuage des **Artistes** et le nuage des **Genres**.
*   **Playlist Détaillée :** Affichage de la playlist complète dans la modale avec des liens d'exploration pour chaque titre :
    *   **Google :** Recherche optimisée pour l'Artiste.
    *   **MusicBrainz :** Recherche structurée pour l'Enregistrement (Titre + Artiste).
    *   **Discogs :** Recherche pour le Marketplace (Marketplace).

### 3. Identité Visuelle

*   **Logo :** Le logo de **Radio Octopus** est intégré au bandeau pour marquer l'identité de l'émission.
*   **Design :** Interface sombre et élégante, entièrement responsive (Mobile-First).

## 🛠️ Guide de Démarrage Local

### Prérequis

*   Node.js (version 18+)
*   npm (inclus avec Node.js)

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/TON_NOM_UTILISATEUR/tupi-or-not-archives.git
cd tupi-or-not-archives

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev

# 4. Le site sera accessible à l'adresse : http://localhost:3000
```
