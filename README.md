# 📻 TUPI OR NOT - ARCHIVES COMPLÈTES
## L'émission qui mange toutes les musiques

🌐 **Site Officiel :** [tupiornot.fr](https://tupiornot.fr)

## 📝 Description du Projet

Ce projet est une **Progressive Web App (PWA)** moderne conçue pour unifier les archives de l'émission de radio "Tupi or not". Il centralise les contenus audio et les données de playlist, offrant une expérience utilisateur fluide, installable sur mobile, et riche en fonctionnalités d'exploration.

Le site est construit sur une architecture **Next.js/TypeScript/Tailwind** pour garantir performance et maintenabilité.

Le code source est sous licence MIT.

Le projet intègre une solution d'analyse d'audience (Vercel Analytics) respectueuse de la vie privée (sans cookies).

## 🔗 Configuration des Données (Back-Office)

Le site utilise un Google Sheet [Tupi archive](https://docs.google.com/spreadsheets/d/1uleTx21WDbeTGSgiybSn3Uu0Zt5yqCyeD8B7KCS-vik/edit?usp=sharing) comme unique source de données. Toute modification dans ce fichier est répercutée sur le site.

| Onglet | Rôle | Lien CSV Public |
| :--- | :--- | :--- |
| **Emissions** | Métadonnées de l'émission (Numéro, Date, Invité, Lien, Plateforme, Thème, Mixcloud Legacy). | [Lien CSV Émissions](https://docs.google.com/spreadsheets/d/e/2PACX-1vSufSOVQkT11EZaJAGQ5RbC7E01QFcUmjPUHI8FSNjbqEg7L5tcuUBZzJRKRi0AXoLD5llJe1PP8_8b/pub?gid=43357015&single=true&output=csv) |
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
*   **Statistiques d'Écoute :** Affichage du nombre de lectures cumulées (Archive.org + Mixcloud pour les émissions historiques) sur chaque vignette, permettant d'identifier les contenus populaires.
*   **Playlist Détaillée :** Affichage de la playlist complète dans la modale avec des liens d'exploration pour chaque titre :
    *   **Google :** Recherche optimisée pour l'Artiste.
    *   **MusicBrainz :** Recherche structurée pour l'Enregistrement (Titre + Artiste).
    *   **Discogs :** Recherche pour le Marketplace (Marketplace).
*   **Partage & Deep Linking :** Chaque émission possède une URL unique (`?id=XX`) et des métadonnées dynamiques (Open Graph). Cela permet de partager une émission spécifique sur les réseaux sociaux (WhatsApp, Facebook...) avec un aperçu visuel de la pochette et une ouverture automatique de la modale de lecture.    
    

### 4. Identité Visuelle
*   **Logo :** Le logo de **Radio Octopus** est intégré au bandeau pour marquer l'identité de l'émission.
*   **Design :** Interface sombre et élégante, entièrement responsive (Mobile-First).

## 📻 Widget & Intégration (Radio Octopus)

Le site propose une API de widgets ("Embed") permettant d'afficher le lecteur Tupi or Not sur des sites tiers via une `iframe`.
Ces pages sont optimisées pour l'intégration (pas de header, fond transparent, pas d'indexation Google).

### Endpoints Disponibles

| URL | Description | Usage |
| :--- | :--- | :--- |
| `/embed/latest` | Affiche automatiquement la **dernière émission** publiée. | Page d'accueil Radio Octopus. |
| `/embed/[id]` | Affiche une émission spécifique (ex: `/embed/72`). | Articles de blog, archives spécifiques. |

### Code d'intégration (HTML)

Pour intégrer la dernière émission sur un site tiers :

```html
<iframe 
  src="https://tupiornot.fr/embed/latest" 
  width="100%" 
  height="450" 
  frameborder="0" 
  allow="autoplay; encrypted-media"
  style="border-radius: 8px; overflow: hidden;"
></iframe>
```

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
```
### Commandes de Maintenance

*   **Vérifier les types (TypeScript) :** `npm run typecheck`
*   **Vérifier la qualité du code (Lint) :** `npm run lint`
*   **Simuler la mise en production (Build) :** `npm run build` (Inclut automatiquement la vérification Lint)