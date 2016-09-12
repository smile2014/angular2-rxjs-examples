import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';

@Component({
  selector: 'app-slideshow-master',
  template: `
  <button #left md-raised-button color="accent">Move Left</button>
  <button #right md-raised-button color="accent">Move Right</button>
  <div>
    <div #ball class="ball"
      [style.left]="position.x + 'px'"
      [style.top]="position.y + 'px'">
    </div>
  </div>
  `
})
export class SlideshowMasterComponent implements OnInit {
  @ViewChild('left') left;
  @ViewChild('right') right;
  position: any;

  constructor(private af: AngularFire) {}

  ngOnInit() {
    const remote$ = this.af.database.object('slideshow/');

    const left$ = Observable.fromEvent(this.getNativeElement(this.left), 'click')
      .map(event => -10);

    const right$ = Observable.fromEvent(this.getNativeElement(this.right), 'click')
      .map(event => 10);

    Observable.merge(left$, right$)
      .startWith({x: 100, y: 100})
      .scan((acc, curr) => Object.assign({}, acc, {x: acc.x + curr}))
      .do(event => remote$.update(event))
      .subscribe(result => {
        this.position = result;
      });
  }

  getNativeElement(element) {
    return element._elementRef.nativeElement;
  }
}