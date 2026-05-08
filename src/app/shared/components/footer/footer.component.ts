import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <footer class="egyptian-footer">
      <div class="footer-pattern"></div>

      <div class="container">
        <div class="footer-top row">
          <div class="col-lg-4 col-md-12">
            <div class="footer-brand">
              <div class="brand-head">
                <span class="logo-wrap">
                  <img src="assets/logo-symbol.png" class="footer-logo" alt="Egyptian Spirit" />
                </span>

                <h4>Egyptian <span>Spirit</span></h4>
              </div>

              <p>
                {{ 'FOOTER.DESCRIPTION' | translate }}
              </p>
            </div>
          </div>

          <div class="col-lg-2 col-md-4 col-sm-6">
            <h5>{{ 'FOOTER.EXPLORE' | translate }}</h5>
            <ul>
              <li>
                <a routerLink="/">{{ 'NAV.HOME' | translate }}</a>
              </li>
              <li>
                <a routerLink="/trips">{{ 'NAV.TRIPS' | translate }}</a>
              </li>
              <li>
                <a routerLink="/gallery">{{ 'NAV.GALLERY' | translate }}</a>
              </li>
              <li>
                <a routerLink="/about">{{ 'NAV.ABOUT' | translate }}</a>
              </li>
            </ul>
          </div>

          <div class="col-lg-2 col-md-4 col-sm-6">
            <h5>{{ 'FOOTER.SUPPORT' | translate }}</h5>
            <ul>
              <li>
                <a routerLink="/contact">{{ 'NAV.CONTACT' | translate }}</a>
              </li>
              <li>
                <a routerLink="/custom-trip">{{ 'FOOTER.CUSTOM_TRIP' | translate }}</a>
              </li>
              <li>
                <a href="#">{{ 'FOOTER.FAQ' | translate }}</a>
              </li>
            </ul>
          </div>

          <div class="col-lg-4 col-md-4">
            <h5>{{ 'FOOTER.CONTACT' | translate }}</h5>

            <div class="contact-box">
              <p><i class="fa-solid fa-envelope"></i> <span>info&#64;egyptianspirit.com</span></p>
              <p><i class="fa-solid fa-phone"></i> <span>+20 1106131756</span></p>
              <p>
                <i class="fa-solid fa-location-dot"></i>
                <span>{{ 'FOOTER.LOCATION' | translate }}</span>
              </p>
            </div>

            <div class="socials">
              <i class="fa-brands fa-facebook-f"></i>
              <i class="fa-brands fa-instagram"></i>
              <i class="fa-brands fa-x-twitter"></i>
              <i class="fa-brands fa-youtube"></i>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>{{ 'FOOTER.RIGHTS' | translate }}</p>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .egyptian-footer {
        position: relative;
        overflow: hidden;
        background:
          radial-gradient(circle at 15% 15%, rgba(198, 168, 92, 0.16), transparent 30%),
          linear-gradient(135deg, #0d1b2a 0%, #081421 100%);
        color: #f8f6f1;
        padding: 72px 0 22px;
        margin-top: 0;
        border-top: 1px solid rgba(198, 168, 92, 0.3);
      }

      .footer-pattern {
        position: absolute;
        inset: 0;
        opacity: 0.08;
        background-image:
          linear-gradient(45deg, rgba(198, 168, 92, 0.8) 1px, transparent 1px),
          linear-gradient(-45deg, rgba(198, 168, 92, 0.8) 1px, transparent 1px);
        background-size: 34px 34px;
        pointer-events: none;
      }

      .container {
        position: relative;
        z-index: 1;
      }

      .footer-top {
        margin-bottom: 42px;
        row-gap: 34px;
      }

      .footer-brand {
        max-width: 350px;
      }

      .brand-head {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 14px;
      }

      .logo-wrap {
        width: 58px;
        height: 58px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: rgba(198, 168, 92, 0.12);
        border: 1px solid rgba(198, 168, 92, 0.35);
        flex-shrink: 0;
      }

      .footer-logo {
        width: 45px;
        height: 45px;
        object-fit: contain;
      }

      .footer-brand h4 {
        font-family: 'Cinzel', serif;
        font-size: 22px;
        letter-spacing: 1.5px;
        margin: 0;
        color: #f8f6f1;
      }

      .footer-brand span,
      h5 {
        color: #c6a85c;
      }

      .footer-brand p {
        font-size: 13px;
        color: #ead7b5;
        margin: 0;
        line-height: 1.8;
      }

      h5 {
        font-family: 'Cinzel', serif;
        margin-bottom: 18px;
        font-size: 16px;
        letter-spacing: 1px;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      ul li {
        margin-bottom: 10px;
      }

      ul a {
        position: relative;
        color: rgba(248, 246, 241, 0.86);
        text-decoration: none;
        font-size: 13px;
        transition: 0.25s ease;
      }

      ul a:hover {
        color: #c6a85c;
        padding-inline-start: 6px;
      }

      .contact-box {
        display: grid;
        gap: 10px;
      }

      .contact-box p {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 13px;
        margin: 0;
        color: #ead7b5;
        line-height: 1.6;
      }

      .contact-box i {
        color: #c6a85c;
        margin-top: 4px;
        min-width: 16px;
      }

      .socials {
        margin-top: 18px;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .socials i {
        background: rgba(198, 168, 92, 0.1);
        border: 1px solid rgba(198, 168, 92, 0.4);
        color: #c6a85c;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: 0.25s ease;
      }

      .socials i:hover {
        background: #c6a85c;
        color: #0d1b2a;
        transform: translateY(-3px);
      }

      .footer-bottom {
        border-top: 1px solid rgba(198, 168, 92, 0.22);
        padding-top: 18px;
        text-align: center;
        font-size: 12px;
        color: #ead7b5;
      }

      .footer-bottom p {
        margin: 0;
      }

      :host-context(body.light-mode) .egyptian-footer {
        background:
          radial-gradient(circle at 15% 15%, rgba(198, 168, 92, 0.16), transparent 30%),
          linear-gradient(135deg, #f8f6f1 0%, #efe2c3 100%);
        color: #0d1b2a;
        border-top-color: rgba(139, 111, 47, 0.28);
      }

      :host-context(body.light-mode) .footer-pattern {
        opacity: 0.12;
      }

      :host-context(body.light-mode) .footer-brand h4,
      :host-context(body.light-mode) h5 {
        color: #0d1b2a;
      }

      :host-context(body.light-mode) .footer-brand h4 span,
      :host-context(body.light-mode) .footer-brand span {
        color: #8b6f2f;
      }

      :host-context(body.light-mode) .footer-brand p,
      :host-context(body.light-mode) .contact-box p,
      :host-context(body.light-mode) .footer-bottom,
      :host-context(body.light-mode) ul a {
        color: rgba(13, 27, 42, 0.82);
      }

      :host-context(body.light-mode) .contact-box i,
      :host-context(body.light-mode) .socials i {
        color: #8b6f2f;
      }

      :host-context(body.light-mode) ul a:hover {
        color: #8b6f2f;
      }

      :host-context(body.light-mode) .logo-wrap,
      :host-context(body.light-mode) .socials i {
        background: rgba(139, 111, 47, 0.08);
        border-color: rgba(139, 111, 47, 0.35);
      }

      :host-context(body.light-mode) .socials i:hover {
        background: #8b6f2f;
        color: #f8f6f1;
      }

      :host-context(body.light-mode) .footer-bottom {
        border-top-color: rgba(139, 111, 47, 0.22);
      }

      @media (max-width: 991px) {
        .egyptian-footer {
          padding: 58px 0 22px;
        }

        .footer-brand {
          max-width: 100%;
        }
      }

      @media (max-width: 768px) {
        .footer-top {
          row-gap: 32px;
        }
      }

      @media (max-width: 575px) {
        .egyptian-footer {
          padding: 48px 0 20px;
          text-align: center;
        }

        .brand-head {
          justify-content: center;
          flex-direction: column;
          gap: 10px;
        }

        .footer-brand {
          margin: 0 auto;
        }

        .contact-box p {
          justify-content: center;
          text-align: center;
        }

        .socials {
          justify-content: center;
        }

        ul a:hover {
          padding-inline-start: 0;
        }
      }
    `,
  ],
})
export class FooterComponent {}
