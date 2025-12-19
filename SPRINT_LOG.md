# 📅 Journal de Bord du Projet (Trace Agile)

Ce document retrace les étapes de développement, les livrables et les défis techniques résolus au cours du processus Agile.

| Sprint | Objectif Principal | Livrables Clés | Défis Techniques Résolus |
| :--- | :--- | :--- | :--- |
| **0** | **Conception & Maquette** | Validation de la structure de la page (Header, Grille, Modale). Choix de la stack (Next.js/TS/Tailwind). | Configuration initiale de l'environnement de développement (Node/npm/VS Code). |
| **1** | **Data & Squelette** | Connexion aux deux sources de données (Mixcloud/Archive.org). Affichage de la liste brute des émissions. | **Bug Fix :** Problème de lecture des colonnes CSV (accents/majuscules). |
| **2** | **Design & Lecteur** | Grille 5 colonnes, images carrées (`aspect-square`). Lecteur unifié (Modale) avec gestion des iFrames. | **Bug Fix :** Problème d'affichage des images (Hotlinking/Cache) résolu par `referrerPolicy` et `player-widget.mixcloud.com`. |
| **3** | **UX & Recherche** | Implémentation de la recherche instantanée (`SearchContext`). Ajout du bouton "X" pour réinitialiser la recherche. Finalisation du design du Header (Logo, Slogan). | **UX Amélioration :** Passage du bouton "Écouter" au lien "Détails" pour clarifier l'UX. |
| **4** | **Visualisation & Data Refactoring** | Séparation des données en deux onglets (Emissions/Playlists). **Automatisation :** Implémentation du script Google Apps Script pour l'auto-remplissage des genres. | **Data Refactoring :** Ligation des données Playlists/Emissions. Création du `searchableText` pour la recherche multi-critères. |
| **5** | **Exploration & UX Mobile** | Création du composant `TagExplorer` (Accordéon/Bascule Artiste/Genre). Amélioration de la modale (hauteur dynamique, fond transparent). Ajout des liens MusicBrainz/Discogs. | **UX Mobile :** Implémentation de l'Accordéon pour optimiser l'espace vertical sur mobile. **Bug Fix :** Problème de typage `globalGenres` résolu. |
| **6** | **Finalisation & Documentation** | Révision complète du code. Production des documents `README.md`, `ARCHITECTURE.md`, et `SPRINT_LOG.md`. | Nettoyage final du code de débogage (`console.log`). |