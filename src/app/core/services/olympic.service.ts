// olympic.service.ts
import { HttpClient } from '@angular/common/http'; // Importation du service HttpClient pour effectuer des requêtes HTTP
import { Injectable } from '@angular/core'; // Importation du décorateur Injectable pour permettre l'injection de dépendances
import { BehaviorSubject, Observable, of } from 'rxjs'; // Importation de BehaviorSubject et Observable de RxJS pour la gestion des flux de données
import { catchError, map, tap } from 'rxjs/operators'; // Importation des opérateurs RxJS pour le traitement des observables
import { Olympics } from '../models/Olympic'; // Importation du modèle de données Olympics

@Injectable({
  providedIn: 'root', // Indique que le service est injectable dans toute l'application
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json'; // Chemin vers le fichier JSON contenant les données olympiques
  private olympics$ = new BehaviorSubject<Olympics[] | null>(null); // BehaviorSubject pour émettre les données, initialisé à null

  constructor(private http: HttpClient) {} // Injection du service HttpClient dans le constructeur

  loadInitialData(): Observable<Olympics[]> {
    // Méthode pour charger les données depuis le fichier JSON
    return this.http.get<Olympics[]>(this.olympicUrl).pipe( // Effectue une requête GET pour récupérer les données olympiques
      tap((data) => this.olympics$.next(data)), // Émet les données chargées dans le BehaviorSubject
      catchError((error) => { // Gestion des erreurs lors de la requête
        console.error('Erreur lors du chargement des données olympiques:', error); // Affiche l'erreur dans la console
        this.olympics$.next(null); // Émet null en cas d'erreur pour indiquer que les données ne sont pas disponibles
        throw error; // Relance l'erreur pour une gestion ultérieure
      })
    );
  }

  getOlympics(): Observable<Olympics[] | null> {
    // Méthode pour obtenir un observable des données olympiques
    return this.olympics$.asObservable(); // Retourne l'instance BehaviorSubject sous forme d'Observable
  }

  getCountryDetails(country: string): Observable<Olympics | null> {
    // Méthode pour obtenir les détails d'un pays spécifique
    return this.olympics$.pipe(
      map((olympics) => olympics?.find((o) => o.country === country) || null), // Cherche le pays dans la liste et retourne null s'il n'est pas trouvé
      catchError((error) => {
        console.error('Erreur lors de la récupération des détails du pays:', error); // Affiche l'erreur dans la console
        return of(null); // Retourne un Observable de null en cas d'erreur
      })
    );
  }
}

