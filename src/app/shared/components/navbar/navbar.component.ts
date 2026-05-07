import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, TranslateModule],
  template: `
    <nav class="navbar navbar-expand-lg egyptian-navbar fixed-top">
      <div class="container nav-container">
        <a class="navbar-brand d-flex align-items-center" routerLink="/" (click)="closeMenus()">
          <span class="brand-icon">
            <img src="assets/logo-symbol.png" alt="Egyptian Spirit" class="logo-symbol" />
          </span>

          <span class="brand-text">
            <span>Egyptian <strong>Spirit</strong></span>
            <small>Journeys Through Time</small>
          </span>
        </a>

        <button
          class="navbar-toggler"
          type="button"
          (click)="isMenuOpen = !isMenuOpen"
          aria-label="Toggle navigation"
          [attr.aria-expanded]="isMenuOpen"
        >
          <i class="fa-solid" [ngClass]="isMenuOpen ? 'fa-xmark' : 'fa-bars'"></i>
        </button>

        <div class="collapse navbar-collapse" [ngClass]="{ show: isMenuOpen }">
          <ul class="navbar-nav ms-auto align-items-lg-center nav-main">
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="closeMenus()"
              >
                {{ 'NAV.HOME' | translate }}
              </a>
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/trips"
                routerLinkActive="active"
                (click)="closeMenus()"
              >
                {{ 'NAV.TRIPS' | translate }}
              </a>
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/gallery"
                routerLinkActive="active"
                (click)="closeMenus()"
              >
                {{ 'NAV.GALLERY' | translate }}
              </a>
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/about"
                routerLinkActive="active"
                (click)="closeMenus()"
              >
                {{ 'NAV.ABOUT' | translate }}
              </a>
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/contact"
                routerLinkActive="active"
                (click)="closeMenus()"
              >
                {{ 'NAV.CONTACT' | translate }}
              </a>
            </li>

            <li class="nav-item nav-control-item">
              <div class="language-wrap">
                <select
                  class="language-select"
                  [value]="selectedLang"
                  (change)="changeLanguage($event)"
                  aria-label="Select language"
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="de">German</option>
                  <option value="fr">French</option>
                  <option value="it">Italian</option>
                  <option value="es">Spanish</option>
                </select>
                <i class="fa-solid fa-chevron-down lang-arrow"></i>
              </div>
            </li>

            <li class="nav-item nav-control-item">
              <button
                class="icon-btn"
                type="button"
                (click)="toggleMode()"
                aria-label="Toggle theme"
              >
                <i class="fa-solid" [ngClass]="isLight ? 'fa-moon' : 'fa-sun'"></i>
              </button>
            </li>

            @if (!isLoggedIn) {
              <li class="nav-item">
                <a class="nav-link auth-link" routerLink="/login" (click)="closeMenus()">
                  {{ 'NAV.LOGIN' | translate }}
                </a>
              </li>

              <li class="nav-item">
                <a class="btn register-btn" routerLink="/register" (click)="closeMenus()">
                  {{ 'NAV.REGISTER' | translate }}
                </a>
              </li>
            }

            @if (isLoggedIn) {
              <li class="nav-item user-dropdown-wrap">
                <button class="user-dropdown-btn" type="button" (click)="toggleUserMenu()">
                  <span class="user-avatar">
                    <i class="fa-solid fa-user"></i>
                  </span>

                  <span class="user-name">
                    {{ userName }}
                    <small>
                      {{ isAdminUser ? ('ADMIN' | translate) : ('LOGGED_IN' | translate) }}
                    </small>
                  </span>

                  <i
                    class="fa-solid fa-chevron-down chevron"
                    [ngClass]="{ rotate: isUserMenuOpen }"
                  ></i>
                </button>

                @if (isUserMenuOpen) {
                  <div class="user-dropdown">
                    @if (isAdminUser) {
                      <a routerLink="/admin" (click)="closeMenus()">
                        <i class="fa-solid fa-gauge"></i>
                        {{ 'DASHBOARD' | translate }}
                      </a>
                    }

                    <button type="button" (click)="logout()">
                      <i class="fa-solid fa-right-from-bracket"></i>
                      {{ 'LOGOUT' | translate }}
                    </button>
                  </div>
                }
              </li>
            }

            <li class="nav-item">
              <a class="btn nav-cta" routerLink="/custom-trip" (click)="closeMenus()">
                {{ 'NAV.PLAN' | translate }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .egyptian-navbar {
        background: rgba(13, 27, 42, 0.92);
        border-bottom: 1px solid rgba(198, 168, 92, 0.28);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        padding: 13px 0;
        z-index: 999;
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.18);
        transition:
          background 0.3s ease,
          padding 0.3s ease,
          border-color 0.3s ease;
      }

      .nav-container {
        gap: 18px;
      }

      .navbar-brand {
        text-decoration: none;
        gap: 13px;
        flex-shrink: 0;
        min-width: 0;
        align-items: center !important;
      }

      .brand-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(198, 168, 92, 0.18), rgba(13, 27, 42, 0.15));
        border: 1px solid rgba(198, 168, 92, 0.38);
        box-shadow: 0 8px 20px rgba(198, 168, 92, 0.12);
        flex-shrink: 0;
        overflow: hidden;
        transform: translateY(-3px);
      }

      .logo-symbol {
        width: 36px;
        height: 36px;
        object-fit: contain;
        display: block;
        transform: translateY(-1px);
      }

      .brand-text {
        display: grid;
        gap: 5px;
      }

      .brand-text span {
        display: block;
        font-family: 'Cinzel', serif;
        color: #f8f6f1;
        font-size: 18px;
        letter-spacing: 1.7px;
        line-height: 1;
        white-space: nowrap;
      }

      .brand-text strong {
        color: #c6a85c;
        font-weight: 800;
      }

      .brand-text small {
        display: block;
        font-family: 'Montserrat', sans-serif;
        color: #ead7b5;
        font-size: 7px;
        letter-spacing: 3.4px;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .nav-main {
        gap: 14px;
      }

      .nav-link {
        position: relative;
        font-family: 'Montserrat', sans-serif;
        color: rgba(248, 246, 241, 0.88);
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.5px;
        padding: 10px 0 !important;
        transition: color 0.25s ease;
        white-space: nowrap;
      }

      .nav-link::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 4px;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #c6a85c, #ead7b5);
        transition: width 0.25s ease;
      }

      :host-context([dir='rtl']) .nav-link::after {
        left: auto;
        right: 0;
      }

      .nav-link:hover,
      .nav-link.active {
        color: #c6a85c;
      }

      .nav-link:hover::after,
      .nav-link.active::after {
        width: 100%;
      }

      .auth-link {
        color: #ead7b5;
      }

      .language-wrap {
        position: relative;
        width: 96px;
        height: 40px;
      }

      .language-select {
        width: 100%;
        height: 40px;
        appearance: none;
        -webkit-appearance: none;
        border-radius: 999px;
        background: #162636;
        color: #f8f6f1;
        border: 1px solid rgba(198, 168, 92, 0.65);
        font-size: 11px;
        font-weight: 900;
        outline: none;
        cursor: pointer;
        padding: 0 30px 0 14px;
        text-transform: uppercase;
        letter-spacing: 0.2px;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
      }

      .language-select:hover,
      .language-select:focus {
        background: #1b2d3f;
        border-color: #c6a85c;
        color: #ead7b5;
      }

      .language-select option {
        background: #162636;
        color: #f8f6f1;
        font-size: 13px;
        font-weight: 700;
      }

      .lang-arrow {
        position: absolute;
        right: 13px;
        top: 50%;
        transform: translateY(-50%);
        color: #c6a85c;
        font-size: 9px;
        pointer-events: none;
      }

      .icon-btn {
        width: 42px;
        height: 42px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.045);
        color: #c6a85c;
        border: 1px solid rgba(198, 168, 92, 0.45);
        font-size: 13px;
        font-weight: 800;
        outline: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: 0.25s ease;
      }

      .icon-btn:hover {
        background: rgba(198, 168, 92, 0.12);
        border-color: #c6a85c;
      }

      .register-btn,
      .nav-cta {
        border-radius: 999px;
        padding: 10px 18px;
        font-family: 'Montserrat', sans-serif;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.75px;
        text-transform: uppercase;
        white-space: nowrap;
        transition: 0.25s ease;
      }

      .register-btn {
        background: transparent;
        color: #c6a85c;
        border: 1px solid rgba(198, 168, 92, 0.75);
      }

      .nav-cta {
        background: linear-gradient(135deg, #c6a85c, #ead7b5);
        color: #0d1b2a;
        border: 1px solid #c6a85c;
        box-shadow: 0 10px 24px rgba(198, 168, 92, 0.25);
      }

      .register-btn:hover,
      .nav-cta:hover {
        transform: translateY(-2px);
        background: #ead7b5;
        border-color: #ead7b5;
        color: #0d1b2a;
      }

      .user-dropdown-wrap {
        position: relative;
      }

      .user-dropdown-btn {
        height: 42px;
        display: flex;
        align-items: center;
        gap: 9px;
        background: rgba(255, 255, 255, 0.045);
        border: 1px solid rgba(198, 168, 92, 0.34);
        color: #f8f6f1;
        padding: 6px 10px;
        min-width: 145px;
        max-width: 165px;
        border-radius: 999px;
        transition: 0.25s ease;
      }

      .user-dropdown-btn:hover {
        background: rgba(198, 168, 92, 0.12);
        border-color: #c6a85c;
      }

      .user-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: linear-gradient(135deg, #c6a85c, #ead7b5);
        color: #0d1b2a;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        flex-shrink: 0;
      }

      .user-name {
        display: grid;
        text-align: left;
        font-size: 11px;
        font-weight: 800;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }

      :host-context([dir='rtl']) .user-name {
        text-align: right;
      }

      .user-name small {
        color: #c6a85c;
        font-size: 9px;
        margin-top: 3px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .chevron {
        color: #c6a85c;
        font-size: 10px;
        transition: transform 0.25s ease;
      }

      .chevron.rotate {
        transform: rotate(180deg);
      }

      .user-dropdown {
        position: absolute;
        top: 50px;
        right: 0;
        width: 190px;
        background: rgba(13, 27, 42, 0.98);
        border: 1px solid rgba(198, 168, 92, 0.35);
        border-radius: 16px;
        padding: 8px;
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        overflow: hidden;
      }

      :host-context([dir='rtl']) .user-dropdown {
        right: auto;
        left: 0;
      }

      .user-dropdown a,
      .user-dropdown button {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 9px;
        background: transparent;
        border: 0;
        color: #f8f6f1;
        text-decoration: none;
        padding: 11px 12px;
        font-size: 13px;
        text-align: left;
        border-radius: 12px;
        transition: 0.25s ease;
      }

      :host-context([dir='rtl']) .user-dropdown a,
      :host-context([dir='rtl']) .user-dropdown button {
        text-align: right;
      }

      .user-dropdown a:hover,
      .user-dropdown button:hover {
        background: rgba(198, 168, 92, 0.14);
        color: #c6a85c;
      }

      .navbar-toggler {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1px solid rgba(198, 168, 92, 0.58);
        color: #c6a85c;
        box-shadow: none;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 0;
        background: rgba(255, 255, 255, 0.045);
        transition: 0.25s ease;
      }

      .navbar-toggler:hover {
        background: rgba(198, 168, 92, 0.12);
      }

      .navbar-toggler:focus {
        box-shadow: 0 0 0 3px rgba(198, 168, 92, 0.18);
      }

      :host-context(body.light-mode) .egyptian-navbar {
        background: rgba(248, 246, 241, 0.92);
        border-bottom: 1px solid rgba(198, 168, 92, 0.35);
        box-shadow: 0 12px 30px rgba(13, 27, 42, 0.08);
      }

      :host-context(body.light-mode) .brand-text span,
      :host-context(body.light-mode) .nav-link,
      :host-context(body.light-mode) .user-dropdown-btn {
        color: #0d1b2a;
      }

      :host-context(body.light-mode) .brand-text small {
        color: #53606c;
      }

      :host-context(body.light-mode) .language-select,
      :host-context(body.light-mode) .icon-btn,
      :host-context(body.light-mode) .user-dropdown-btn,
      :host-context(body.light-mode) .navbar-toggler {
        background: rgba(13, 27, 42, 0.035);
      }

      :host-context(body.light-mode) .language-select {
        color: #0d1b2a;
      }

      :host-context(body.light-mode) .user-dropdown {
        background: rgba(248, 246, 241, 0.98);
        box-shadow: 0 18px 40px rgba(13, 27, 42, 0.14);
      }

      :host-context(body.light-mode) .user-dropdown a,
      :host-context(body.light-mode) .user-dropdown button {
        color: #0d1b2a;
      }

      :host-context(body.light-mode) .language-select option {
        background: #f8f6f1;
        color: #0d1b2a;
      }

      @media (max-width: 1199px) {
        .brand-icon {
          width: 50px;
          height: 50px;
        }

        .logo-symbol {
          width: 40px;
          height: 40px;
        }

        .brand-text span {
          font-size: 16px;
          letter-spacing: 1.35px;
        }

        .brand-text small {
          letter-spacing: 2.4px;
        }

        .nav-main {
          gap: 9px;
        }

        .nav-link {
          font-size: 12px;
        }

        .nav-cta,
        .register-btn {
          padding: 9px 12px;
          font-size: 11px;
        }

        .language-wrap {
          width: 86px;
        }
      }

      @media (max-width: 991px) {
        .egyptian-navbar {
          padding: 10px 0;
        }

        .navbar-toggler {
          display: inline-flex;
          margin-left: auto;
        }

        :host-context([dir='rtl']) .navbar-toggler {
          margin-left: 0;
          margin-right: auto;
        }

        .navbar-collapse {
          background: rgba(13, 27, 42, 0.98);
          margin-top: 14px;
          padding: 16px;
          border: 1px solid rgba(198, 168, 92, 0.25);
          border-radius: 22px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.24);
          max-height: calc(100vh - 92px);
          overflow-y: auto;
        }

        :host-context(body.light-mode) .navbar-collapse {
          background: rgba(248, 246, 241, 0.98);
          box-shadow: 0 18px 40px rgba(13, 27, 42, 0.12);
        }

        .nav-main {
          gap: 7px;
          align-items: stretch !important;
        }

        .nav-link {
          padding: 12px 14px !important;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.035);
        }

        .nav-link::after {
          display: none;
        }

        .nav-link:hover,
        .nav-link.active {
          background: rgba(198, 168, 92, 0.12);
        }

        .nav-control-item {
          width: 100%;
        }

        .language-wrap,
        .register-btn,
        .nav-cta,
        .user-dropdown-btn {
          width: 100%;
          max-width: 100%;
          margin-top: 6px;
          justify-content: center;
        }

        .icon-btn {
          width: 100%;
          height: 40px;
          margin-top: 6px;
          border-radius: 14px;
          display: flex;
          justify-content: center;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(198, 168, 92, 0.35);
        }

        .language-select {
          text-align: center;
          padding-left: 30px;
        }

        .user-dropdown-btn {
          border-radius: 16px;
        }

        .user-dropdown {
          position: static;
          width: 100%;
          margin-top: 8px;
          border-radius: 16px;
        }

        .register-btn,
        .nav-cta {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      @media (max-width: 575px) {
        .nav-container {
          gap: 10px;
        }

        .brand-icon {
          width: 42px;
          height: 42px;
          transform: translateY(-2px);
        }

        .logo-symbol {
          width: 31px;
          height: 31px;
        }

        .brand-text span {
          font-size: 14px;
          letter-spacing: 0.9px;
        }

        .brand-text small {
          font-size: 5.8px;
          letter-spacing: 1.65px;
        }

        .navbar-toggler {
          width: 40px;
          height: 40px;
        }
      }

      @media (max-width: 380px) {
        .brand-text small {
          display: none;
        }

        .brand-text span {
          font-size: 13px;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
        }

        .logo-symbol {
          width: 32px;
          height: 32px;
        }
      }
    `,
  ],
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isUserMenuOpen = false;

  isLoggedIn = false;
  isAdminUser = false;
  userName = '';

  isLight = false;
  selectedLang = 'en';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    this.loadTheme();
    this.initLanguage();

    setTimeout(async () => {
      await this.loadUser();
    });

    this.supabaseService.onAuthStateChange(async () => {
      setTimeout(async () => {
        await this.loadUser();
      });
    });
  }

  async loadUser() {
    const profile = await this.supabaseService.getProfile();

    if (!profile) {
      this.isLoggedIn = false;
      this.isAdminUser = false;
      this.userName = '';
      this.cdr.detectChanges();
      return;
    }

    this.isLoggedIn = true;
    this.userName = profile.full_name || profile.email || 'User';
    this.isAdminUser = profile.role === 'admin' || profile.role === 'super_admin';

    this.cdr.detectChanges();
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.cdr.detectChanges();
  }

  async logout() {
    await this.supabaseService.signOut();

    this.isLoggedIn = false;
    this.isAdminUser = false;
    this.userName = '';
    this.closeMenus();

    this.router.navigate(['/']);
    this.cdr.detectChanges();
  }

  closeMenus() {
    this.isUserMenuOpen = false;
    this.isMenuOpen = false;
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
      this.isLight = true;
      document.body.classList.add('light-mode');
    } else {
      this.isLight = false;
      document.body.classList.remove('light-mode');
    }
  }

  toggleMode() {
    this.isLight = !this.isLight;

    if (this.isLight) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }

    this.cdr.detectChanges();
  }

  initLanguage() {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.selectedLang = savedLang;

    this.translate.setDefaultLang('en');
    this.translate.use(savedLang);

    document.documentElement.lang = savedLang;
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
  }

  changeLanguage(event: Event) {
    const lang = (event.target as HTMLSelectElement).value;

    this.selectedLang = lang;
    localStorage.setItem('lang', lang);

    this.translate.use(lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    this.closeMenus();
    this.cdr.detectChanges();
  }
}
