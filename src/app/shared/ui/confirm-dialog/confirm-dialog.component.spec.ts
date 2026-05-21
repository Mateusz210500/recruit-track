import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  it('renders dialog when open and emits on confirm', async () => {
    const fixture = await setup();
    const confirmed: boolean[] = [];

    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('title', 'Delete item');
    fixture.componentRef.setInput('message', 'This cannot be undone.');
    fixture.componentInstance.confirmed.subscribe(() => confirmed.push(true));
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('[role="alertdialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog.textContent).toContain('Delete item');

    const confirmButton = [...fixture.nativeElement.querySelectorAll('button')].find(
      (button: HTMLButtonElement) => button.textContent?.includes('Confirm'),
    ) as HTMLButtonElement;
    confirmButton.click();
    fixture.detectChanges();

    expect(confirmed).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('[role="alertdialog"]')).toBeNull();
  });
});

async function setup() {
  await TestBed.configureTestingModule({
    imports: [ConfirmDialogComponent],
  }).compileComponents();

  return TestBed.createComponent(ConfirmDialogComponent);
}
