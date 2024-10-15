import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympics } from 'src/app/core/models/Olympic'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  onResize(event: Event) {
    const windowWidth = (event.target as Window).innerWidth;
    this.setWidth(windowWidth);
  }

  setWidth(windowWidth: number) {

    if (windowWidth < 576) {
      this.width = 300;
    } else if (windowWidth < 768) {
      this.width = 500;
    } else {
      this.width = 700;
    }
  }


  private loadCountryDetails(country: string): void {
    this.countryDetails$ = this.olympicService.getCountryDetails(country);
    this.countryDetails$.subscribe((details) => {
      if (details) {
        this.totalMedals = details.participations.reduce((sum: number, participation: { medalsCount: number }) => sum + participation.medalsCount, 0);
        this.totalAthletes = details.participations.reduce((sum: number, participation: { athleteCount: number }) => sum + participation.athleteCount, 0);
        this.participationCount = details.participations.length;

        // Préparer les données pour le graphique
        // Format des données pour ngx-charts-line-chart
        this.lineChartData = [
          {
            name: country,
            series: details.participations.map(participation => ({
              name: participation.year.toString(),  // L'année en tant que chaîne
              value: participation.medalsCount      // Nombre de médailles
            }))
          }
        ];
      }
    });
  }
}


// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { OlympicService } from 'src/app/core/services/olympic.service';
// import { Olympics } from 'src/app/core/models/Olympic'; 
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators'; // Importez map pour transformer l'Observable

// @Component({
//   selector: 'app-detail',
//   templateUrl: './detail.component.html',
//   styleUrls: ['./detail.component.scss'],
// })
// export class DetailComponent implements OnInit {
//   public countryDetails$: Observable<Olympics | null>; 
//   public country: string = ''; 
//   public totalMedals: number = 0; // Propriété pour le total des médailles
//   public totalAthletes: number = 0; // Propriété pour le total des athlètes
//   public participationCount: number = 0; // Propriété pour le nombre total de participations

//   constructor(
//     private route: ActivatedRoute, 
//     private olympicService: OlympicService 
//   ) {
//     this.countryDetails$ = new Observable(); 
//   }

//   ngOnInit(): void {
//     this.route.params.subscribe(params => {
//       this.country = params['country']; 
//       this.loadCountryDetails(this.country); 
//     });
//   }

//   private loadCountryDetails(country: string): void {
//     this.countryDetails$ = this.olympicService.getCountryDetails(country);
//     this.countryDetails$.subscribe((details) => {
//       if (details) {
//         // Calcul des totaux à partir des participations
//         this.totalMedals = details.participations.reduce((sum: number, participation: { medalsCount: number }) => sum + participation.medalsCount, 0); // Total des médailles
//         this.totalAthletes = details.participations.reduce((sum: number, participation: { athleteCount: number }) => sum + participation.athleteCount, 0); // Total des athlètes
//         this.participationCount = details.participations.length; // Nombre total de participations
//       }
//     });
//   }
// }


