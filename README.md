# OlympicGamesStarter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

Don't forget to install your node_modules before starting (`npm install`).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Where to start

As you can see, an architecture has already been defined for the project. It is just a suggestion, you can choose to use your own. The predefined architecture includes (in addition to the default angular architecture) the following:

- `components` folder: contains every reusable components
- `pages` folder: contains components used for routing
- `core` folder: contains the business logic (`services` and `models` folders)

I suggest you to start by understanding this starter code. Pay an extra attention to the `app-routing.module.ts` and the `olympic.service.ts`.

Once mastered, you should continue by creating the typescript interfaces inside the `models` folder. As you can see I already created two files corresponding to the data included inside the `olympic.json`. With your interfaces, improve the code by replacing every `any` by the corresponding interface.

You're now ready to implement the requested features.

Good luck!

## version
Angular 8.2.7
npm 10.8.2
node 20.17.0

## branches :
- main : basic installation
- chart : pages dashboard and charts
- clean : clean code and documentation

## libraries and tools
CDN bootstrap 5.3.2
ngx-charts used for charts generation

## developpement

### Utilisation des Services pour Réaliser les Appels HTTP

- Création du Service : Un service OlympicService a été créé pour centraliser la logique des appels HTTP.

- Injection de HttpClient : Le service utilise HttpClient pour effectuer des requêtes HTTP, facilitant l'accès aux données à partir de fichiers JSON ou d'API externes.

- Méthode loadInitialData : Cette méthode est responsable de charger les données initiales à partir d'un fichier JSON en effectuant une requête GET.

- Utilisation de BehaviorSubject : Un BehaviorSubject est utilisé pour émettre les données chargées, permettant aux composants d'écouter les mises à jour des données.

### Utilisation de RxJS et des Observables
- Gestion des Flux de Données : Les données sont gérées à l'aide d'observables, permettant une programmation réactive et la gestion des mises à jour de données en temps réel.

- Méthodes getOlympics et getCountryDetails : Ces méthodes retournent des observables qui émettent des données concernant les JO et les détails d'un pays, respectivement.

- Utilisation des Opérateurs RxJS : Des opérateurs comme map, tap, et catchError sont utilisés pour manipuler et gérer les flux de données, tout en gérant les erreurs de manière appropriée.

### Unsubscribe des Observables
- Désinscription des Observables : La méthode ngOnDestroy est utilisée pour se désinscrire des abonnements afin d'éviter les fuites de mémoire.

- Gestion des Abonnements : Un Subscription est créé pour regrouper les abonnements, permettant de les annuler en une seule opération lors de la destruction du composant.

### Typage du Code pour Éviter les "any"
- Modèles Typés : Les données sont typées à l'aide de modèles définis (par exemple, Olympics) pour garantir une structure de données cohérente.

- Utilisation de Types : Les méthodes retournent des observables avec des types spécifiques (par exemple, Observable<Olympics[]>), éliminant ainsi l'utilisation de types any et renforçant la sécurité du type dans le code.

- Évitement de Types Dynamiques : Les méthodes et les propriétés utilisent des types explicites, ce qui facilite la lecture du code et aide à prévenir les erreurs potentielles lors du développement.

