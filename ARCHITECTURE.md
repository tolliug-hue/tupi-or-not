# 🏗️ Architecture Technique du Projet

## 1. Schéma d'Architecture et Flux de Données

Le projet suit une architecture **JAMstack** (JavaScript, APIs, Markup) optimisée par Next.js. Le flux de données est conçu pour maximiser la performance en chargeant les données une seule fois côté serveur.

```mermaid
graph TD
subgraph Server Side (Next.js)
A[Google Sheets: Emissions/Playlists] -->|CSV Fetch| B(src/lib/data.ts: getEmissions)
B --> C{Data Processing: Ligation, Tag/Genre Counting, searchableText Generation}
C --> D[src/app/page.tsx: Server Component]
end

subgraph Client Side (Browser)
D --> E[src/context/SearchContext.tsx]
E --> F[src/components/TagExplorer.tsx]
E --> G[src/components/EmissionList.tsx]
F -->|setSearchTerm| E
G -->|useSearch| E
G --> H[iFrames: Mixcloud/Archive.org]
end

style A fill:#f9f,stroke:#333,stroke-width:2px
style D fill:#ccf,stroke:#333,stroke-width:2px
style E fill:#ffc,stroke:#333,stroke-width:2px
```

## 2. Détail du Data Layer (`src/lib/data.ts`)

Ce fichier est le cœur de l'application. Il effectue les opérations suivantes :

*   **Fetch & Parsing :** Utilise `PapaParse` pour lire les deux liens CSV publics.
*   **Ligation :** Lie les lignes de l'onglet `Playlists` aux émissions correspondantes via la colonne `Numéro`.
*   **Agrégation :**
    *   **`globalTags` :** Compte la fréquence de chaque Artiste (y compris les artistes multiples séparés par des virgules) pour le nuage de tags.
    *   **`globalGenres` :** Compte la fréquence de chaque Genre (issu de la colonne `Genre` de la playlist) pour le nuage de genres.
*   **Recherche :** Génère une chaîne de caractères unique (`searchableText`) pour chaque émission, incluant le Titre, la Date, l'Invité, les Artistes et les Genres. Cette chaîne est utilisée pour la recherche instantanée.

## 3. Stratégie de Performance et UX

*   **Rendu Côté Serveur (SSR/SSG) :** La fonction `getEmissions` est `async` et est appelée dans le Server Component `page.tsx`. Cela signifie que la page HTML est générée avec toutes les données déjà incluses, garantissant un **Time To First Byte (TTFB)** très rapide.
*   **Lazy Loading (Lecteur) :** Les iFrames des lecteurs audio ne sont chargés que lorsque l'utilisateur clique sur la vignette (ouverture de la modale). Cela évite de charger 72 lecteurs au démarrage.
*   **Filtrage Efficace :** Le filtrage dans `EmissionList.tsx` utilise le hook `useMemo` pour ne recalculer la liste filtrée que lorsque le `searchTerm` change. Cela garantit une recherche instantanée sans ralentissement.
*   **UX Mobile (Accordéon) :** Le composant `TagExplorer` utilise un accordéon pour masquer les 300+ tags sur les petits écrans, libérant ainsi l'espace vertical.

## 4. Bonnes Pratiques et Points de Vigilance

*   **Typage (TypeScript) :** L'utilisation d'interfaces (`Emission`, `PlaylistItem`, `GlobalTags`) garantit la cohérence des données du début à la fin de l'application.
*   **Gestion d'État :** L'utilisation de `SearchContext` pour l'état global de la recherche est la méthode standard pour découpler les composants (la barre de recherche ne connaît pas la grille, et vice-versa).
*   **Point de Vigilance (Cache) :** L'ajout de `&t=${Date.now()}` dans les requêtes CSV est une solution de contournement pour le cache agressif de Google. En production, il faut s'assurer que Vercel ne met pas en cache la page trop longtemps.