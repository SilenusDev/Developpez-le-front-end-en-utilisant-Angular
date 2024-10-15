// src/app/pages/detail/detail.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympics } from 'src/app/core/models/Olympic';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public countryDetails$: Observable<Olympics | null>; 
  public country: string = ''; 
  public totalMedals: number = 0; 
  public totalAthletes: number = 0; 
  public participationCount: number = 0; 
  public lineChartData: any[] = []; // Pour stocker les données du graphique
  public width: number = 700; // Pour stocker la largeur de la fenêtre

  constructor(
    private route: ActivatedRoute, 
    private olympicService: OlympicService 
  ) {
    this.countryDetails$ = new Observable(); 
    this.setWidth(window.innerWidth);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.country = params['country']; 
      this.loadCountryDetails(this.country); 
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const windowWidth = (event.target as Window).innerWidth;
    this.setWidth(windowWidth);
  }

  private setWidth(windowWidth: number): void {
    // Définit la largeur en fonction de la taille de la fenêtre
    if (windowWidth < 576) {
      this.width = 300;
    } else if (windowWidth < 768) {
      this.width = 500;
    } else {
      this.width = 700;
    }
  }

  private loadCountryDetails(country: string): void {
    this.countryDetails$ = this.olympicService.getCountryDetails(country).pipe(
      catchError((error) => {
        console.error('Error loading country details:', error);
        return of(null); // Retourne null en cas d'erreur
      })
    );

    this.countryDetails$.subscribe((details) => {
      if (details) {
        this.calculateStatistics(details);
        this.prepareLineChartData(details);
      }
    });
  }

  private calculateStatistics(details: Olympics): void {
    // Calcule les statistiques nécessaires
    this.totalMedals = details.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
    this.totalAthletes = details.participations.reduce((sum, participation) => sum + participation.athleteCount, 0);
    this.participationCount = details.participations.length;
  }

  private prepareLineChartData(details: Olympics): void {
    // Prépare les données pour le graphique
    this.lineChartData = [
      {
        name: this.country,
        series: details.participations.map(participation => ({
          name: participation.year.toString(),  // L'année en tant que chaîne
          value: participation.medalsCount      // Nombre de médailles
        }))
      }
    ];
  }
}

