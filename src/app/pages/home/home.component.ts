// src/app/pages/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Olympics } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympics[] | null>;
  public chartData: { name: string; value: number }[] = [];

  // Pie chart options
  view: [number, number] = [700, 400];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  

  constructor(private olympicService: OlympicService, private router: Router) {
    this.olympics$ = this.olympicService.getOlympics();
  }

  public numberOfJOs: number = 0; // Propriété pour le nombre de JOs
  public numberOfCountries: number = 0; // Propriété pour le nombre de pays

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe(
      (data) => {
        if (data) {
          this.transformData(data);
          this.numberOfJOs = data.reduce((count, olympic) => count + olympic.participations.length, 0); // Calculer le nombre de JOs
          this.numberOfCountries = data.length; // Le nombre de pays est simplement la longueur du tableau
        }
      },
      (error) => {
        console.error('Error loading Olympic data:', error);
      }
    );
  }

  private transformData(olympics: Olympics[]): void {
    this.chartData = olympics.map((olympic) => {
      const totalMedals = olympic.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
      return {
        name: olympic.country,
        value: totalMedals,
      };
    });
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    const country = data.name; // Récupérer le nom du pays
    this.router.navigate(['/detail', country]); // Naviguer vers le détail du pays
  }
}




// import { Component, OnInit } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Olympics } from 'src/app/core/models/Olympic';
// import { OlympicService } from 'src/app/core/services/olympic.service';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
// })
// export class HomeComponent implements OnInit {
//   public olympics$: Observable<Olympics[] | null>;
//   public chartData: any[] = []; // Données pour le graphique

//   // Configuration du graphique
//   view: [number, number] = [700, 400]; // Taille du graphique
//   showXAxis = true;
//   showYAxis = true;
//   gradient = false;
//   showLegend = true;
//   showXAxisLabel = true;
//   xAxisLabel = 'Countries';
//   showYAxisLabel = true;
//   yAxisLabel = 'Medals Count';

//   constructor(private olympicService: OlympicService) {
//     this.olympics$ = this.olympicService.getOlympics();
//   }

//   ngOnInit(): void {
//     this.olympicService.loadInitialData().subscribe(
//       (data) => {
//         if (data) {
//           this.transformData(data); // Transformez les données pour le graphique
//         }
//       },
//       (error) => {
//         console.error('Erreur lors du chargement des données olympiques:', error);
//       }
//     );
//   }

//   // Transformation des données pour ngx-charts
//   private transformData(olympics: Olympics[]): void {
//     this.chartData = olympics.map((olympic) => {
//       const totalMedals = olympic.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
//       return {
//         name: olympic.country,
//         value: totalMedals,
//       };
//     });
//   }
// }

// // src/app/pages/home/home.component.ts
// import { Component, OnInit } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Olympics } from 'src/app/core/models/Olympic';
// import { OlympicService } from 'src/app/core/services/olympic.service';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
// })
// export class HomeComponent implements OnInit {
//   public olympics$: Observable<Olympics[] | null>; // Déclarez l'Observable pour les données

//   constructor(private olympicService: OlympicService) {
//     this.olympics$ = this.olympicService.getOlympics(); // Initialisez l'Observable
//   }

//   ngOnInit(): void {
//     this.olympicService.loadInitialData().subscribe(
//       () => {
//         // Les données sont déjà émises par le BehaviorSubject
//       },
//       (error) => {
//         console.error('Erreur lors du chargement des données olympiques:', error);
//       }
//     );
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { Observable, of } from 'rxjs';
// import { OlympicService } from 'src/app/core/services/olympic.service';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
// })
// export class HomeComponent implements OnInit {
//   public olympics$: Observable<any> = of(null);

//   constructor(private olympicService: OlympicService) {}

//   ngOnInit(): void {
//     this.olympics$ = this.olympicService.getOlympics();
//   }
// }
