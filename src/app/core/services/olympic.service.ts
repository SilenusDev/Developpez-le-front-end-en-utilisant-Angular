import { HttpClient } from '@angular/common/http'; // Importation du service HttpClient pour les requêtes HTTP
import { Injectable } from '@angular/core'; // Importation du décorateur Injectable pour créer des services
import { BehaviorSubject, Observable } from 'rxjs'; // Importation de BehaviorSubject et Observable de RxJS pour la gestion des flux de données
import { catchError, tap } from 'rxjs/operators'; // Importation des opérateurs RxJS pour le traitement des observables
import { Olympics } from '../models/Olympic'; // Importation du modèle de données Olympics

@Injectable({
  providedIn: 'root', // Indique que le service est disponible dans toute l'application
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json'; // Chemin vers le fichier JSON contenant les données olympiques
  private olympics$ = new BehaviorSubject<Olympics[] | null>(null); // BehaviorSubject pour émettre les données, initialisé à null

  constructor(private http: HttpClient) {} // Injection du service HttpClient dans le constructeur

  loadInitialData(): Observable<Olympics[]> {
    // Méthode pour charger les données depuis le fichier JSON
    return this.http.get<Olympics[]>(this.olympicUrl).pipe( // Effectue une requête GET pour récupérer les données
      tap((data) => this.olympics$.next(data)), // Émet les données chargées dans le BehaviorSubject
      catchError((error) => { // Gestion des erreurs lors de la requête
        console.error('Erreur lors du chargement des données olympiques:', error); // Affiche l'erreur dans la console
        this.olympics$.next(null); // Émet null en cas d'erreur
        throw error; // Relance l'erreur pour une gestion ultérieure
      })
    );
  }

  getOlympics(): Observable<Olympics[] | null> {
    // Méthode pour obtenir un observable des données olympiques
    return this.olympics$.asObservable(); // Retourne l'instance BehaviorSubject sous forme d'Observable
  }
}




// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class OlympicService {
//   private olympicUrl = './assets/mock/olympic.json';
//   private olympics$ = new BehaviorSubject<any>(undefined);

//   constructor(private http: HttpClient) {}

//   loadInitialData() {
//     return this.http.get<any>(this.olympicUrl).pipe(
//       tap((value) => this.olympics$.next(value)),
//       catchError((error, caught) => {
//         // TODO: improve error handling
//         console.error(error);
//         // can be useful to end loading state and let the user know something went wrong
//         this.olympics$.next(null);
//         return caught;
//       })
//     );
//   }

//   getOlympics() {
//     return this.olympics$.asObservable();
//   }
// }
