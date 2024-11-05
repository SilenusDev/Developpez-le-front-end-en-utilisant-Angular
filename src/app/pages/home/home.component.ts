import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { Olympics } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // Observable qui contient la liste des événements olympiques
  public olympics$: Observable<Olympics[] | null>;
  // Données pour le graphique en secteurs
  public chartData: { name: string; value: number }[] = [];
  // Nombre total de JO et de pays
  public numberOfJOs: number = 0;
  public numberOfCountries: number = 0;
  // Largeur du graphique
  public width: number = 700;
  
  // Options pour le graphique en secteurs
  view: [number, number] = [700, 400]; // Dimensions du graphique
  gradient: boolean = true; // Indique si un dégradé est utilisé
  showLegend: boolean = true; // Indique si la légende est affichée
  showLabels: boolean = true; // Indique si les étiquettes sont affichées
  isDoughnut: boolean = false; // Indique si le graphique est un graphique en anneau

  private destroy$ = new Subject<void>(); // Subject pour gérer la destruction des abonnements

  constructor(private olympicService: OlympicService, private router: Router) {
    // Récupère les données olympiques et gère les erreurs potentielles
    this.olympics$ = this.olympicService.getOlympics().pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des données olympiques:', error);
        return of(null); // Retourne null en cas d'erreur
      }),
      takeUntil(this.destroy$) // S'assure que l'abonnement est annulé lorsque `destroy$` émet
    );
    // Définit la largeur du graphique en fonction de la largeur de la fenêtre
    this.setWidth(window.innerWidth);
  }

  ngOnInit(): void {
    // Charge les données olympiques lors de l'initialisation du composant
    this.loadOlympicData();
  }

  ngOnDestroy(): void {
    // Émet une valeur pour terminer tous les abonnements
    this.destroy$.next();
    // Complète le Subject pour libérer la mémoire
    this.destroy$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // Écoute les événements de redimensionnement de la fenêtre et ajuste la largeur
    const windowWidth = (event.target as Window).innerWidth;
    this.setWidth(windowWidth);
  }

  private setWidth(windowWidth: number): void {
    // Ajuste la largeur du graphique en fonction de la largeur de la fenêtre
    if (windowWidth < 576) {
      this.width = 300; // Petit écran
    } else if (windowWidth < 768) {
      this.width = 500; // Écran moyen
    } else {
      this.width = 700; // Écran large
    }
  }

  private loadOlympicData(): void {
    // Charge les données olympiques initiales depuis le service
    this.olympicService.loadInitialData().pipe(
      catchError((error) => {
        console.error('Erreur lors du chargement des données olympiques:', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      }),
      takeUntil(this.destroy$) // Assure également la désinscription
    ).subscribe((data: Olympics[]) => {
      if (data && data.length > 0) {
        // Transforme les données pour les graphiques et calcule les statistiques
        this.transformData(data);
        this.numberOfJOs = this.calculateTotalJOs(data);
        this.numberOfCountries = data.length; // Compte le nombre de pays
      }
    });
  }

  private transformData(olympics: Olympics[]): void {
    // Transforme les données olympiques en format compatible avec le graphique
    this.chartData = olympics.map((olympic) => {
      const totalMedals = this.calculateTotalMedals(olympic.participations); // Calcule le nombre total de médailles
      return {
        name: olympic.country, // Nom du pays
        value: totalMedals, // Nombre total de médailles
      };
    });
  }

  private calculateTotalMedals(participations: any[]): number {
    // Calcule le nombre total de médailles pour une liste de participations
    return participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
  }

  private calculateTotalJOs(olympics: Olympics[]): number {
    // Calcule le nombre total de participations aux JO
    return olympics.reduce((count, olympic) => count + olympic.participations.length, 0);
  }

  public onSelect(data: { name: string }): void {
    // Gère le clic sur un élément du graphique et navigue vers la page de détails
    console.log('Item clicked', data);
    this.router.navigate(['/detail', data.name]); // Navigation vers le composant de détail avec le nom du pays
  }
}

