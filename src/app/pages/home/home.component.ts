// src/app/pages/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Olympics } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympics[] | null>; // Déclarez l'Observable pour les données

  constructor(private olympicService: OlympicService) {
    this.olympics$ = this.olympicService.getOlympics(); // Initialisez l'Observable
  }

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe(
      () => {
        // Les données sont déjà émises par le BehaviorSubject
      },
      (error) => {
        console.error('Erreur lors du chargement des données olympiques:', error);
      }
    );
  }
}

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
