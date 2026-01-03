# 📻 TUPI OR NOT - ARCHIVES COMPLÈTES
## L'émission qui mange toutes les musiques

🌐 **Site Officiel :** [tupiornot.fr](https://tupiornot.fr)

## 📝 Description du Projet

Ce projet est une **Progressive Web App (PWA)** moderne conçue pour unifier les archives de l'émission de radio "Tupi or not". Il centralise les contenus audio et les données de playlist, offrant une expérience utilisateur fluide, installable sur mobile, et riche en fonctionnalités d'exploration.

Le site est construit sur une architecture **Next.js/TypeScript/Tailwind** pour garantir performance et maintenabilité.

## 🔗 Configuration des Données (Back-Office)

Le site utilise un Google Sheet [Tupi archive](https://docs.google.com/spreadsheets/d/1uleTx21WDbeTGSgiybSn3Uu0Zt5yqCyeD8B7KCS-vik/edit?usp=sharing) comme unique source de données. Toute modification dans ce fichier est répercutée sur le site.

| Onglet | Rôle | Lien CSV Public |
| :--- | :--- | :--- |
| **Emissions** | Métadonnées de l'émission (Numéro, Date, Invité, Plateforme, Thème). | [Lien CSV Émissions](https://docs.google.com/spreadsheets/d/e/2PACX-1vSufSOVQkT11EZaJAGQ5RbC7E01QFcUmjPUHI8FSNjbqEg7L5tcuUBZzJRKRi0AXoLD5llJe1PP8_8b/pub?gid=43357015&single=true&output=csv) |
| **Playlists** | Détails des titres (Artiste, Titre, Proposé par, Genre). | [Lien CSV Playlists](https://docs.google.com/spreadsheets/d/e/2PACX-1vSufSOVQkT11EZaJAGQ5RbC7E01QFcUmjPUHI8FSNjbqEg7L5tcuUBZzJRKRi0AXoLD5llJe1PP8_8b/pub?gid=1302606414&single=true&output=csv) |

## 🎧 Expérience de Lecture et d'Exploration

### 1. Interface Mobile-First & PWA
*   **Navigation Adaptative :** Menu "Off-Canvas" (Tiroir) sur mobile pour une navigation épurée, et Header complet sur Desktop.
*   **Grille Dense :** Affichage en 2 colonnes sur mobile pour maximiser la visibilité des pochettes sans défilement excessif.
*   **PWA Installable :** Le site peut être installé comme une application native sur Android et iOS (Icônes adaptatives, Manifest, Mode Standalone).

### 2. Lecture Audio (Expérience Unifiée)
*   **Accès :** Un clic sur la vignette de l'émission ouvre une modale de lecture optimisée ("Architecture Sandwich" avec header/footer fixes).
*   **Lecteur :** Le site utilise le lecteur natif de **Mixcloud** (pour les anciennes émissions) ou d'**Archive.org** (pour les récentes).
*   **Design :** Le lecteur est présenté de manière uniforme : une image de l'émission au centre, surmontant une barre de contrôle audio compacte.
*   **Lecture :** Le lancement de la lecture est manuel (Click-to-Play) pour garantir la compatibilité avec les navigateurs mobiles et éviter les bugs d'affichage (politiques anti-autoplay).

### 3. Exploration Avancée
*   **Navigation Fluide :** Chargement progressif des émissions (Pagination "Load More") pour une navigation rapide et réactive, même sur mobile.
*   **Images Haute Définition :** Récupération optimisée des pochettes HD (via convention de nommage stricte pour Archive.org) garantissant une qualité visuelle maximale.
*   **Recherche Instantanée :** Barre de recherche en haut de page pour filtrer en temps réel par **Artiste, Titre, Invité, Thème, Date, Numéro d'émission et Genre**.
*   **Explorateur de Tags :** Bloc unique (Accordéon/Toggle) permettant de basculer entre le nuage des **Artistes** et le nuage des **Genres**.
*   **Playlist Détaillée :** Affichage de la playlist complète dans la modale avec des liens d'exploration pour chaque titre :
    *   **Google :** Recherche optimisée pour l'Artiste.
    *   **MusicBrainz :** Recherche structurée pour l'Enregistrement (Titre + Artiste).
    *   **Discogs :** Recherche pour le Marketplace (Marketplace).

### 4. Identité Visuelle
*   **Logo :** Le logo de **Radio Octopus** est intégré au bandeau pour marquer l'identité de l'émission.
*   **Design :** Interface sombre et élégante, entièrement responsive (Mobile-First).

## 🛠️ Guide de Démarrage Local

### Prérequis

*   Node.js (version 18+)
*   npm (inclus avec Node.js)

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/tolliug-hue/tupi-or-not.git
cd tupi-or-not-archives

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev

# 4. Le site sera accessible à l'adresse : http://localhost:3000