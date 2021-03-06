import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-game-master',
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
export class GameMasterComponent implements OnInit {
  circles: any[] = [];

  constructor(private af: AngularFire) {}

  ngOnInit() {
    const OFFSET = 25;
    const remote$ = this.af.database.object('animation/');

    Observable.fromEvent(document, 'mousemove')
      .map(event => {
        return {x: event.clientX - OFFSET, y: event.clientY - OFFSET}
      })
      .do(event => remote$.update(event))
      .subscribe(circle => {
        this.circles = [...this.circles, circle];
      });
  }
}