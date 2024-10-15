import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NgxChartsModule } from '@swimlane/ngx-charts'; // Importez le module NgxCharts
import { DetailComponent } from './pages/detail/detail.component';
import { HeaderComponent } from './partials/header/header.component';

@NgModule({
  declarations: [AppComponent, DetailComponent, HomeComponent, NotFoundComponent],
  imports: [BrowserModule, AppRoutingModule, NgxChartsModule, HeaderComponent, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
