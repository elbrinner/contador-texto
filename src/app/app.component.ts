import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class="min-h-screen bg-slate-50">
      <div class="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Contador Texto</p>
          <h1 class="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Analiza texto sin distracciones
          </h1>
          <p class="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            El host raíz entrega el marco visual y delega la interacción principal a la shell enrutable del
            análisis.
          </p>
        </header>

        <router-outlet />
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
