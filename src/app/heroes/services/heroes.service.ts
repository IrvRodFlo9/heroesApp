import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { enviroment } from '../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private baseURL: string = enviroment.baseURL;

  constructor(private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseURL}/heroes`);
  }

  getHero(id: string): Observable<Hero | undefined> {
    return this.http
      .get<Hero>(`${this.baseURL}/heroes/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseURL}/heroes?q=${query}&_limit=6`);
  }
}