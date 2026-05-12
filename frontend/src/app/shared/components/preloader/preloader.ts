import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="preloader-overlay" [class.fade-out]="fadingOut" *ngIf="visible">
      <div class="preloader-content">
        <div class="elegant-logo">
          <i class="fas fa-paw"></i>
        </div>
        <div class="elegant-text">
          <h2>Helpyourpet</h2>
        </div>
        <div class="elegant-progress">
          <div class="progress-fill"></div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './preloader.scss'
})
export class PreloaderComponent implements OnInit {
  visible = true;
  fadingOut = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Esperar 900ms mínimo, luego iniciar fade-out de 500ms
    setTimeout(() => {
      this.fadingOut = true;
      this.cdr.markForCheck();

      // Después del fade-out, remover del DOM
      setTimeout(() => {
        this.visible = false;
        this.cdr.markForCheck();
      }, 500);
    }, 900);
  }
}
