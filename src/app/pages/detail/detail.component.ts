import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympics } from 'src/app/core/models/Olympic';
import { Observable, Subject, catchError, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  // Observable contenant les détails d'un pays (ici un objet Olympics ou null en cas d'erreur)
  public countryDetails$: Observable<Olympics | null>; 
  
  // Nom du pays récupéré depuis les paramètres de la route
  public country: string = ''; 
  
  // Nombre total de médailles remportées par le pays
  public totalMedals: number = 0; 
  
  // Nombre total d'athlètes ayant participé pour le pays
  public totalAthletes: number = 0; 
  
  // Nombre total de participations du pays aux Jeux Olympiques
  public participationCount: number = 0; 
  
  // Données pour le graphique en ligne représentant les médailles par année
  public lineChartData: any[] = []; 
  
  // Largeur du graphique, ajustée en fonction de la taille de la fenêtre
  public width: number = 700; 

  // Subject utilisé pour contrôler la désinscription des abonnements lors de la destruction du composant
  private destroy$ = new Subject<void>(); 

  constructor(
    private route: ActivatedRoute, // Service permettant d'accéder aux paramètres de la route
    private olympicService: OlympicService // Service personnalisé pour récupérer les données des pays
  ) {
    this.countryDetails$ = new Observable(); // Initialise l'Observable à un état par défaut
    this.setWidth(window.innerWidth); // Définit la largeur initiale du graphique en fonction de la taille de la fenêtre
  }

  // Méthode appelée à l'initialisation du composant
  ngOnInit(): void {
    // Abonnement aux paramètres de la route pour récupérer le nom du pays
    this.route.params.pipe(
      takeUntil(this.destroy$) // Arrête l'abonnement lors de la destruction du composant
    ).subscribe(params => {
      // Récupère le paramètre 'country' de la route et charge les détails du pays
      this.country = params['country']; 
      this.loadCountryDetails(this.country); 
    });
  }

  // Méthode appelée lors de la destruction du composant pour éviter les fuites de mémoire
  ngOnDestroy(): void {
    this.destroy$.next(); // Emet un signal pour arrêter tous les abonnements
    this.destroy$.complete(); // Termine le Subject
  }

  // Détecte les changements de taille de la fenêtre et ajuste la largeur du graphique en conséquence
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const windowWidth = (event.target as Window).innerWidth; // Récupère la largeur de la fenêtre
    this.setWidth(windowWidth); // Ajuste la largeur du graphique en fonction de la fenêtre
  }

  // Ajuste la largeur du graphique en fonction de la largeur de la fenêtre
  private setWidth(windowWidth: number): void {
    // Définit des largeurs différentes pour le graphique en fonction de seuils spécifiques
    if (windowWidth < 576) {
      this.width = 300; // Petit écran
    } else if (windowWidth < 768) {
      this.width = 500; // Écran moyen
    } else {
      this.width = 700; // Grand écran
    }
  }

  // Charge les détails du pays sélectionné en fonction de son nom
  private loadCountryDetails(country: string): void {
    // Utilise le service pour récupérer les détails d'un pays, en gérant les erreurs
    this.countryDetails$ = this.olympicService.getCountryDetails(country).pipe(
      catchError((error) => {
        console.error('Erreur lors du chargement des détails du pays:', error); // Affiche l'erreur en console
        return of(null); // Retourne null en cas d'erreur pour éviter un blocage de l'application
      })
    );

    // S'abonne aux données récupérées et déclenche le calcul des statistiques si les données sont disponibles
    this.countryDetails$.pipe(
      takeUntil(this.destroy$) // Arrête l'abonnement lors de la destruction du composant
    ).subscribe((details) => {
      if (details) {
        this.calculateStatistics(details); // Calcule les statistiques du pays
        this.prepareLineChartData(details); // Prépare les données pour le graphique
      }
    });
  }

  // Calcule le nombre total de médailles, d'athlètes et de participations
  private calculateStatistics(details: Olympics): void {
    // Calcule le total des médailles en additionnant les médailles de chaque participation
    this.totalMedals = details.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
    
    // Calcule le total des athlètes en additionnant les athlètes de chaque participation
    this.totalAthletes = details.participations.reduce((sum, participation) => sum + participation.athleteCount, 0);
    
    // Compte le nombre de participations en calculant la longueur du tableau des participations
    this.participationCount = details.participations.length;
  }

  // Prépare les données pour un graphique en ligne, avec les années et le nombre de médailles
  private prepareLineChartData(details: Olympics): void {
    // Crée un tableau de données pour le graphique où chaque point représente le nombre de médailles pour une année
    this.lineChartData = [
      {
        name: this.country, // Nom du pays
        series: details.participations.map(participation => ({
          name: participation.year.toString(), // Année de participation en tant que chaîne
          value: participation.medalsCount      // Nombre de médailles remportées cette année-là
        }))
      }
    ];
  }
}

