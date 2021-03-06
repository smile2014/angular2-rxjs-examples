import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-game-client',
  template: `
  <div class="container">
    <app-circle
      *ngFor="let circle of circles"
      [style.left]="circle.x + 'px'"
      [style.top]="circle.y + 'px'">
    </app-circle>
  </div>
  `
})
export class GameClientComponent implements OnInit {
  circles: any[] = [];

  constructor(private af: AngularFire) {}

  ngOnInit() {
    const remote$ = this.af.database.object('animation/');
    remote$
      .subscribe(circle => {
        this.circles = [...this.circles, circle];
      });
  }
}