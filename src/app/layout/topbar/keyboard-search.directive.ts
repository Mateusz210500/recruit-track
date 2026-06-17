import { Directive, ElementRef, inject } from '@angular/core';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  startWith,
  tap,
} from 'rxjs';

@Directive({
  selector: '[appKeyboardSearch]',
  standalone: true,
})
export class KeyboardSearchDirective {
  private elementRef = inject(ElementRef);
  constructor() {
    combineLatest([this.isKeyDown$('/'), this.isKeyDown$('F1')])
      .pipe(
        filter(([slash, bracket]) => slash && bracket),
        distinctUntilChanged(),
        tap(() => this.elementRef.nativeElement.focus()),
      )
      .subscribe();
  }

  private isKeyDown$(key: string) {
    const down$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      filter((e) => e.key === key),
      map(() => true),
    );
    const up$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(
      filter((e) => e.key === key),
      map(() => false),
    );
    return merge(down$, up$).pipe(startWith(false));
  }
}
