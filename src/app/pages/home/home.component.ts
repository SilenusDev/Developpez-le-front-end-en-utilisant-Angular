// src/app/pages/home/home.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
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
  public numberOfJOs: number = 0; // Propriété pour le nombre de JOs
  public numberOfCountries: number = 0; // Propriété pour le nombre de pays
  public width: number = 700; // Pour stocker la largeur de la fenêtre

  // Pie chart options
  view: [number, number] = [700, 400];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  constructor(private olympicService: OlympicService, private router: Router) {
    // Initialisation des données olympiques
    this.olympics$ = this.olympicService.getOlympics().pipe(
      catchError((error) => {
        console.error('Error fetching Olympics:', error);
        return of(null); // Retourne null en cas d'erreur
      })
    );
    this.setWidth(window.innerWidth);
  }

  ngOnInit(): void {
    this.loadOlympicData();
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

  private loadOlympicData(): void {
    this.olympicService.loadInitialData().pipe(
      catchError((error) => {
        console.error('Error loading Olympic data:', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    ).subscribe((data: Olympics[]) => {
      if (data && data.length > 0) {
        this.transformData(data);
        this.numberOfJOs = this.calculateTotalJOs(data);
        this.numberOfCountries = data.length; // Le nombre de pays est simplement la longueur du tableau
      }
    });
  }

  private transformData(olympics: Olympics[]): void {
    // Transforme les données olympiques en format pour le graphique
    this.chartData = olympics.map((olympic) => {
      const totalMedals = this.calculateTotalMedals(olympic.participations);
      return {
        name: olympic.country,
        value: totalMedals,
      };
    });
  }

  private calculateTotalMedals(participations: any[]): number {
    // Calcule le nombre total de médailles
    return participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
  }

  private calculateTotalJOs(olympics: Olympics[]): number {
    // Calcule le nombre total de JO
    return olympics.reduce((count, olympic) => count + olympic.participations.length, 0);
  }

  public onSelect(data: { name: string }): void {
    // Gère la sélection d'un pays
    console.log('Item clicked', data);
    this.router.navigate(['/detail', data.name]); // Naviguer vers le détail du pays
  }
}

