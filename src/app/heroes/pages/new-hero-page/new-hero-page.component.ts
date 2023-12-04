import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { HeroesService } from '../../services/heroes.service';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Component({
  selector: 'app-new-hero-page',
  templateUrl: './new-hero-page.component.html',
  styles: ``,
})
export class NewHeroPageComponent implements OnInit {
  public publishers = [
    {
      id: 'DC Comics',
      desc: 'DC-Comics',
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel-Comics',
    },
  ];

  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.MarvelComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;

    return hero;
  }

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(switchMap((params) => this.heroesService.getHero(params['id'])))
      .subscribe((hero) => {
        if (!hero) return this.router.navigateByUrl('/');

        this.heroForm.reset(hero);
        return;
      });
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe((hero) => {
        this.showSnackbar(`${hero.superhero} se actualizo correctamente`);
      });
      return;
    }

    this.heroesService.addHero(this.currentHero).subscribe((hero) => {
      this.router.navigateByUrl(`/heroes/edit/${hero.id}`);
      this.showSnackbar(`${hero.superhero} se creó correctamente`);
    });
  }

  onConfirm(): void {
    if (!this.currentHero.id) throw Error('Se requiere un id');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHero(this.currentHero.id)),
        filter((wasDeeleted: boolean) => wasDeeleted)
      )
      .subscribe(() => this.router.navigateByUrl('/heroes/list'));

    /*
      No Omptimizado
          dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.heroesService.deleteHero(this.currentHero.id).subscribe((ans) => {
        if (ans) this.router.navigateByUrl('/heroes/list');
      });
    });


    */
  }

  showSnackbar(message: string): void {
    this.snackbar.open(message, 'Cerrar', {
      duration: 2500,
    });
  }
}
