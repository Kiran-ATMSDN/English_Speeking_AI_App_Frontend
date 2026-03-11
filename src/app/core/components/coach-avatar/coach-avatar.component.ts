import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type CoachMood = 'cheerful' | 'speaking' | 'listening' | 'thinking';

export interface CoachAction {
  id: string;
  label: string;
}

@Component({
  selector: 'app-coach-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="coach" [attr.data-mood]="mood">
      <button class="stage" type="button" (click)="avatarTap.emit()" [attr.aria-label]="avatarLabel">
        <div class="ambient"></div>
        <div class="portrait-shell">
          <div class="portrait-glow"></div>
          <div class="portrait-frame">
            <img class="portrait" [src]="photoUrl" [alt]="title + ' portrait'" />
            <div class="mouth-overlay" [attr.data-speaking]="isSpeaking">
              <span class="mouth mouth--one"></span>
              <span class="mouth mouth--two"></span>
              <span class="mouth mouth--three"></span>
            </div>
          </div>
        </div>
        <div class="badge">AI Coach</div>
        <div class="voice-panel" [attr.data-speaking]="isSpeaking"><span></span><span></span><span></span></div>
      </button>
      <div class="copy">
        <p>{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
        <strong>{{ subtitle }}</strong>
        <small>{{ tip }}</small>
      </div>
      <div class="actions" *ngIf="actions.length">
        <button type="button" *ngFor="let action of actions" (click)="actionTap.emit(action.id)">{{ action.label }}</button>
      </div>
    </aside>
  `,
  styles: [`
    :host{display:block;width:min(100%,360px)}
    .coach{--bg:linear-gradient(160deg,#f9feff,#e6f5f1);overflow:hidden;border-radius:30px;padding:18px;background:var(--bg);border:1px solid rgba(83,132,139,.14);box-shadow:0 26px 48px rgba(23,55,60,.12)}
    .coach[data-mood='speaking']{--bg:linear-gradient(160deg,#eef8ff,#e2fff0)}.coach[data-mood='listening']{--bg:linear-gradient(160deg,#fff8ef,#edf6ff)}.coach[data-mood='thinking']{--bg:linear-gradient(160deg,#f2f5ff,#e7efff)}
    .stage{position:relative;display:grid;place-items:center;min-height:270px;margin:0 0 14px;padding:0;width:100%;border:0;background:transparent;cursor:pointer}.stage:focus-visible{outline:2px solid #3388ff;outline-offset:4px}
    .ambient,.badge,.voice-panel,.portrait-glow,.mouth-overlay{position:absolute}.ambient{width:220px;height:220px;top:12px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.88) 0%,rgba(215,239,255,.34) 55%,rgba(255,255,255,0) 76%)}
    .portrait-shell{position:relative;display:grid;place-items:center;width:100%}.portrait-glow{top:18px;width:210px;height:210px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.76) 0%,rgba(255,255,255,.16) 58%,rgba(255,255,255,0) 74%);animation:halo 3.8s ease-in-out infinite}.portrait-frame{position:relative;width:206px;height:206px;border-radius:50%;padding:8px;background:linear-gradient(145deg,rgba(255,255,255,.95),rgba(213,233,238,.86));box-shadow:0 18px 36px rgba(37,72,79,.18)}
    .portrait{width:100%;height:100%;object-fit:cover;border-radius:50%;transform:scale(1.02);animation:idle 5.2s ease-in-out infinite}.coach[data-mood='speaking'] .portrait{animation:talking 2s ease-in-out infinite}
    .mouth-overlay{left:50%;bottom:50px;transform:translateX(-50%);width:54px;height:22px;display:grid;place-items:center;pointer-events:none}.mouth{position:absolute;opacity:0;border-radius:999px;background:rgba(110,48,43,.72);box-shadow:0 0 0 2px rgba(255,214,198,.28)}.mouth--one{width:18px;height:6px}.mouth--two{width:24px;height:10px}.mouth--three{width:16px;height:14px;border-radius:50%}
    .mouth-overlay[data-speaking='true'] .mouth--one{animation:mouthOne .9s infinite}.mouth-overlay[data-speaking='true'] .mouth--two{animation:mouthTwo .9s infinite}.mouth-overlay[data-speaking='true'] .mouth--three{animation:mouthThree .9s infinite}.mouth-overlay[data-speaking='false'] .mouth--one{opacity:.75}
    .badge{left:10px;top:10px;padding:6px 10px;border-radius:999px;background:rgba(23,47,43,.84);color:#f7fff8;font:700 11px/1 sans-serif;text-transform:uppercase}
    .voice-panel{right:18px;bottom:30px;display:flex;align-items:end;gap:5px;padding:10px 11px;border-radius:18px;background:rgba(255,255,255,.74);box-shadow:0 12px 22px rgba(34,75,79,.12)}.voice-panel span{width:5px;height:10px;border-radius:999px;background:linear-gradient(180deg,#5d89ff,#2cb6a8)}.voice-panel[data-speaking='true'] span{animation:bars 1s ease-in-out infinite}.voice-panel[data-speaking='true'] span:nth-child(2){height:28px;animation-delay:-.2s}.voice-panel[data-speaking='true'] span:nth-child(3){height:18px;animation-delay:-.4s}.voice-panel[data-speaking='false'] span:nth-child(1){height:14px}.voice-panel[data-speaking='false'] span:nth-child(2){height:22px}.voice-panel[data-speaking='false'] span:nth-child(3){height:12px}
    .copy{display:grid;gap:8px;color:#16312f}.copy p,.copy h2,.copy strong,.copy small{margin:0}.copy p{font-size:11px;text-transform:uppercase;color:#7f6554;font-weight:700}.copy h2{font-size:31px}.copy strong{font-weight:600}.copy small{padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.64);color:#2f5956;line-height:1.4}
    .actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.actions button{border:0;border-radius:999px;padding:10px 14px;background:rgba(19,50,55,.08);color:#153330;font-weight:700;cursor:pointer}
    @keyframes idle{50%{transform:scale(1.045) translateY(-2px)}}@keyframes talking{50%{transform:scale(1.07)}}@keyframes halo{50%{transform:scale(1.03);opacity:.82}}@keyframes bars{0%,100%{transform:scaleY(.55)}50%{transform:scaleY(1)}}@keyframes mouthOne{0%,32%,100%{opacity:.9}33%,100%{opacity:0}}@keyframes mouthTwo{0%,32%{opacity:0}33%,65%{opacity:.9}66%,100%{opacity:0}}@keyframes mouthThree{0%,65%{opacity:0}66%,100%{opacity:.95}}
  `],
})
export class CoachAvatarComponent {
  @Input() title = 'Coach Mira';
  @Input() subtitle = 'Your practice partner for clearer, more confident English.';
  @Input() tip = 'Let us make each lesson feel like a real guided session.';
  @Input() eyebrow = 'Virtual Coach';
  @Input() mood: CoachMood = 'cheerful';
  @Input() avatarLabel = 'Tap coach avatar to hear guidance';
  @Input() actions: CoachAction[] = [];
  @Input() photoUrl = 'https://i.pravatar.cc/512?img=47';
  @Output() avatarTap = new EventEmitter<void>();
  @Output() actionTap = new EventEmitter<string>();

  get isSpeaking(): boolean {
    return this.mood === 'speaking';
  }
}
