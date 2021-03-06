import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-triggers',
  templateUrl: './triggers.component.html',
  styleUrls: ['./triggers.component.css']
})
export class TriggersComponent implements OnInit {
  @ViewChild('ball') ball;
  position: any;

  ngOnInit() {
    const OFFSET = 50;
    const move$ = Observable.fromEvent(document, 'mousemove')
      .map(event => {
        const path = event.path
          .find(path => path.className === 'md-sidenav-content'),
          offsetLeft = path ? path.offsetLeft : -10000;

        return {x: event.clientX - offsetLeft - OFFSET, y: event.pageY - OFFSET};
      });

    const down$ = Observable.fromEvent(this.ball.nativeElement, 'mousedown');
    const up$ = Observable.fromEvent(document, 'mouseup');

    // This implementation uses the async pipe
    // this.position = down$
    //   .switchMap(event => move$.takeUntil(up$))
    //   .startWith({ x: 100, y: 100});

    down$
      .switchMap(event => move$.takeUntil(up$))
      .startWith({ x: 100, y: 100})
      .subscribe(result => {
        this.position = result;
      });
  }
}
