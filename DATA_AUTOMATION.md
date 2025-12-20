# 🤖 Automatisation des Données : Google Apps Script (GAS)

Ce document détaille la logique et la procédure d'utilisation du script Google Apps Script (GAS) mis en place pour automatiser le remplissage de la colonne `Genre` dans l'onglet `Playlists`.

## 1. Objectif du Script

Le script a pour objectif de maximiser le remplissage de la colonne `Genre` en interrogeant la base de données musicale **MusicBrainz** pour chaque titre de la playlist.

*   **Source de l'information :** MusicBrainz API (recherche d'enregistrement).
*   **Cible :** Colonne `Genre` de l'onglet `Playlists`.
*   **Stratégie :** Double passe pour maximiser le taux de réussite.

## 2. Stratégie de Double Passe

Le script est conçu pour contourner les limites de temps d'exécution de Google Apps Script (6 minutes) et les imprécisions de la recherche API.

| Passe | Objectif de la Recherche | Condition de Traitement | Marqueur d'Échec |
| :--- | :--- | :--- | :--- |
| **Passe 1** | **Précision :** Recherche `Titre AND artist:Artiste`. | Ligne où `Genre` est **vide** (`""`). | `[ÉCHEC]` ou `[ERREUR API]` |
| **Passe 2** | **Tolérance :** Recherche `Artiste` seul. | Ligne où `Genre` est marqué `[ÉCHEC]` ou `[ERREUR API]`. | `[ÉCHEC ARTISTE]` |

## 3. Procédure d'Utilisation (Maintenance)

Pour lancer la mise à jour des genres, suivez ces étapes dans votre Google Sheet :

1.  **Ouvrir le Menu :** Dans le Google Sheet, cliquez sur le menu **"Tupi Or Not - Outils"**.
2.  **Réinitialiser (si nécessaire) :** Si vous voulez recommencer le processus depuis le début, cliquez sur **"Réinitialiser la Reprise"**.
3.  **Lancer la Passe 1 (Titre + Artiste) :**
    *   Cliquez sur **"1. Lancer la Mise à jour (Passe 1 - Titre+Artiste)"**.
    *   Le script va s'exécuter pendant environ 6 minutes et s'arrêter.
    *   **Répétez cette étape** jusqu'à ce que le script vous indique qu'il reprend à la dernière ligne.
4.  **Lancer la Passe 2 (Artiste Seul) :**
    *   Une fois la Passe 1 terminée, cliquez sur **"2. Lancer la Mise à jour (Passe 2 - Artiste Seul)"**.
    *   Le script va cibler uniquement les lignes marquées `[ÉCHEC]` et tenter de les remplir avec le genre de l'artiste.

## 4. Points de Vigilance et Code Source

### A. Robustesse du Code

*   **Nettoyage :** Le script nettoie les noms d'Artiste et de Titre (retrait des `feat.`, `ft.`, `(...)`) avant d'interroger l'API pour maximiser le taux de réussite.
*   **Sécurité :** Une pause de 1 seconde (`Utilities.sleep(1000)`) est insérée entre chaque requête pour respecter la limite de l'API MusicBrainz (1 requête/seconde).

### B. Code Source (Google Apps Script)

Le code complet est stocké dans votre projet Apps Script (Extensions > Apps Script).

```javascript
// Code.gs (Google Apps Script) - Logique de la double passe

var PROPERTIES = PropertiesService.getScriptProperties();
var LAST_ROW_KEY = 'lastProcessedRow';
var SHEET_NAME = 'Playlists';

// ... (Fonctions getGenresFromRecording, getGenresFromArtist, fetchAndProcess) ...

function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Tupi Or Not - Outils')
      .addItem('1. Lancer la Mise à jour (Passe 1 - Titre+Artiste)', 'updateGenresColumnPass1')
      .addItem('2. Lancer la Mise à jour (Passe 2 - Artiste Seul)', 'updateGenresColumnPass2')
      .addItem('Réinitialiser la Reprise', 'resetProcessing')
      .addToUi();
}

function processGenres(isPass2) {
  // ... (Initialisation des variables) ...
  
  // Déterminer la ligne de départ
  var startRow = parseInt(PROPERTIES.getProperty(LAST_ROW_KEY) || '1');
  
  // ... (Affichage de l'alerte de reprise) ...
  
  for (var i = startRow; i < totalRows; i++) {
    // ... (Lecture des valeurs) ...
    
    var shouldProcess = false;
    
    if (!isPass2) {
      // PASSE 1 : Traiter les lignes vides ou les échecs précédents
      shouldProcess = artistName && trackTitle && (currentGenre === '' || currentGenre === '[ÉCHEC]' || currentGenre === '[ERREUR API]');
    } else {
      // PASSE 2 : Traiter les lignes marquées ÉCHEC ou ERREUR API
      shouldProcess = currentGenre === '[ÉCHEC]' || currentGenre === '[ERREUR API]';
    }
    
    if (shouldProcess) {
      var genres = isPass2 
        ? getGenresFromArtist(artistName) 
        : getGenresFromRecording(artistName, trackTitle);
      
      sheet.getRange(i + 1, genreColIndex + 1).setValue(genres);
      Utilities.sleep(1000); 
    }
    
    PROPERTIES.setProperty(LAST_ROW_KEY, i + 1);
  }
  
  // ... (Finalisation) ...
}
```