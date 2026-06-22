import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnnouncementsService, Announcement } from '../../../core/services/announcements.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-announcement-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" class="announcement-toast" [class.toast-enter]="animating" [class.toast-leave]="!animating && visible">
      <div class="toast-icon"><i class="fas fa-bullhorn"></i></div>
      <div class="toast-content">
        <h4>{{ currentAnnouncement?.titulo }}</h4>
        <p>{{ currentAnnouncement?.mensaje }}</p>
      </div>
      <button class="toast-close" (click)="dismiss()"><i class="fas fa-times"></i></button>
      <div class="toast-progress"><div class="toast-progress-bar"></div></div>
    </div>
  `,
  styles: [`
    .announcement-toast {
      position: fixed; top: 120px; left: 20px; z-index: 99999;
      background: linear-gradient(135deg, #1d3976, #2a4fa0); color: #fff;
      border-radius: 10px; padding: 0.65rem 0.9rem; max-width: 320px;
      box-shadow: 0 6px 24px rgba(29,57,118,0.3);
      display: flex; align-items: flex-start; gap: 0.6rem;
      overflow: hidden;
    }
    .toast-enter { animation: slideIn 0.4s ease forwards; }
    .toast-leave { animation: slideOut 0.3s ease forwards; }
    @keyframes slideIn { from { transform: translateX(-120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-120%); opacity: 0; } }
    .toast-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; opacity: 0.85; }
    .toast-content { flex: 1; min-width: 0; }
    .toast-content h4 { margin: 0 0 0.15rem; font-size: 0.8rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .toast-content p { margin: 0; font-size: 0.72rem; line-height: 1.3; opacity: 0.85; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word; }
    .toast-close { background: rgba(255,255,255,0.12); border: none; color: #fff; width: 22px; height: 22px; border-radius: 50%; cursor: pointer; font-size: 0.65rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .toast-close:hover { background: rgba(255,255,255,0.25); }
    .toast-progress { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: rgba(255,255,255,0.15); }
    .toast-progress-bar { height: 100%; background: rgba(255,255,255,0.7); animation: shrink 30s linear forwards; }
    @keyframes shrink { from { width: 100%; } to { width: 0%; } }
  `]
})
export class AnnouncementToastComponent implements OnInit, OnDestroy {
  visible = false;
  animating = false;
  currentAnnouncement: Announcement | null = null;
  private sub!: Subscription;
  private routerSub!: Subscription;
  private pollTimer: any;
  private dismissed = false;
  private currentAnnouncementId: number | null = null;
  private shownInSession: Set<number> = new Set();
  private dismissedIds: Set<number> = new Set();
  private isInitialized = false;
  private readonly STORAGE_KEY = 'dismissed_announcements';

  private allowedRoutes = ['/inicio', '/perfil-usuario', '/veterinario'];

  constructor(
    private announcementsService: AnnouncementsService, 
    private authService: AuthService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDismissedFromStorage();
    
    this.sub = this.announcementsService.newAnnouncement$.subscribe(a => {
      this.ngZone.run(() => this.show(a));
    });

    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => this.checkAnnouncements(), 500);
    });

    setTimeout(() => {
      this.isInitialized = true;
      this.checkAnnouncements();
      this.tryPoll();
    }, 1000);
  }

  ngOnDestroy(): void { 
    this.sub?.unsubscribe(); 
    this.routerSub?.unsubscribe();
    clearInterval(this.pollTimer);
    clearTimeout(this.dismissTimer);
  }

  private checkAnnouncements(): void {
    if (!this.isInitialized) {
      return;
    }

    const currentRoute = this.router.url.split('?')[0];
    if (!this.allowedRoutes.includes(currentRoute)) {
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user || user.role?.name === 'superadmin') {
      return;
    }
    this.announcementsService.getActive().subscribe({
      next: (list) => {
        this.ngZone.run(() => {
          if (list.length === 0) {
            return;
          }
          const latestAnnouncement = list[0];
          
          if (this.dismissedIds.has(latestAnnouncement.id)) {
            return;
          }
          
          if (!this.visible && !this.shownInSession.has(latestAnnouncement.id)) {
            this.show(latestAnnouncement);
          } else if (this.currentAnnouncementId !== latestAnnouncement.id && !this.shownInSession.has(latestAnnouncement.id)) {
            this.dismiss();
            setTimeout(() => this.show(latestAnnouncement), 500);
          }
        });
      },
      error: (err) => {
      }
    });
  }

  private tryPoll(): void {
    clearInterval(this.pollTimer);
    this.pollTimer = setInterval(() => this.checkAnnouncements(), 10000);
  }

  private dismissTimer: any;

  show(a: Announcement): void {
    if (!a) {
      return;
    }

    const currentRoute = this.router.url.split('?')[0];
    if (!this.allowedRoutes.includes(currentRoute)) {
      return;
    }

    this.ngZone.run(() => {
      this.dismissed = false;
      this.currentAnnouncement = a;
      this.currentAnnouncementId = a.id;
      this.visible = true;
      this.animating = true;
      this.cdr.detectChanges();
      
      clearTimeout(this.dismissTimer);
      this.dismissTimer = setTimeout(() => {
        this.ngZone.run(() => {
          this.shownInSession.add(a.id);
          this.dismiss();
        });
      }, 30000);
    });
  }

  dismiss(): void {
    clearTimeout(this.dismissTimer);
    this.animating = false;
    this.dismissed = true;

    if (this.currentAnnouncementId) {
      this.dismissedIds.add(this.currentAnnouncementId);
      this.saveDismissedToStorage();
    }

    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.ngZone.run(() => {
        this.visible = false; 
        this.currentAnnouncement = null;
        this.currentAnnouncementId = null;
        this.cdr.detectChanges();
      });
    }, 300);
  }

  private loadDismissedFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const ids: number[] = JSON.parse(stored);
        this.dismissedIds = new Set(ids);
      }
    } catch (e) {
      this.dismissedIds = new Set();
    }
  }

  private saveDismissedToStorage(): void {
    try {
      const ids = Array.from(this.dismissedIds);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
    }
  }
}
