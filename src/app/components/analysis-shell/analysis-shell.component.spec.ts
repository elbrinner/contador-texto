import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TextAnalysisMetrics } from '../../models/text-analysis-metrics.model';
import { TextAnalysisStoreService } from '../../services/text-analysis-store.service';
import { MetricsPanelComponent } from '../metrics-panel/metrics-panel.component';
import { TextInputPanelComponent } from '../text-input-panel/text-input-panel.component';
import { AnalysisShellComponent } from './analysis-shell.component';

describe('AnalysisShellComponent', () => {
  let fixture: ComponentFixture<AnalysisShellComponent>;
  let store: {
    sourceText: ReturnType<typeof signal<string>>;
    metrics: ReturnType<typeof signal<TextAnalysisMetrics>>;
    isPending: ReturnType<typeof signal<boolean>>;
    updateText: ReturnType<typeof vi.fn>;
  };

  const metricsSnapshot: TextAnalysisMetrics = Object.freeze({
    characters: 27,
    charactersExcludingWhitespace: 23,
    words: 4,
    lines: 2,
    paragraphs: 1,
    estimatedTokens: Object.freeze({
      tokens: 7,
      method: 'gpt35-heuristic',
      confidence: 0.75,
    }),
    extensions: [],
  });

  beforeEach(async () => {
    store = {
      sourceText: signal('Texto inicial'),
      metrics: signal(metricsSnapshot),
      isPending: signal(false),
      updateText: vi.fn((nextText: string) => store.sourceText.set(nextText)),
    };

    await TestBed.configureTestingModule({
      imports: [AnalysisShellComponent],
      providers: [
        {
          provide: TextAnalysisStoreService,
          useValue: store,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisShellComponent);
    fixture.detectChanges();
  });

  it('renders as the `/` composition root that hosts the text-input-panel and metrics-panel surfaces for the primary analysis flow', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('app-text-input-panel')).not.toBeNull();
    expect(host.querySelector('app-metrics-panel')).not.toBeNull();
    expect(host.textContent).toContain('Flujo principal');
  });

  it('connects both panels through the shared text analysis store instead of allowing direct panel-to-panel imports or data exchange', () => {
    const textInput = fixture.debugElement.query(By.directive(TextInputPanelComponent)).componentInstance as TextInputPanelComponent;
    const metricsPanel = fixture.debugElement.query(By.directive(MetricsPanelComponent)).componentInstance as MetricsPanelComponent;

    expect(textInput.value()).toBe('Texto inicial');
    expect(metricsPanel.metrics()).toBe(metricsSnapshot);
    expect(metricsPanel.isPending()).toBe(false);

    textInput.valueChange.emit('Nuevo texto');
    fixture.detectChanges();

    expect(store.updateText).toHaveBeenCalledWith('Nuevo texto');
  });

  it('treats the shell as composition only, leaving normalization, token estimation, and metrics calculation outside the component and its template', () => {
    store.isPending.set(true);
    fixture.detectChanges();

    const metricsPanel = fixture.debugElement.query(By.directive(MetricsPanelComponent)).componentInstance as MetricsPanelComponent;

    expect(metricsPanel.metrics()).toBe(metricsSnapshot);
    expect(metricsPanel.isPending()).toBe(true);
    expect(fixture.componentInstance.metrics()).toBe(metricsSnapshot);
  });

  it('supports the planned responsive handoff between a two-panel desktop layout and a stacked mobile layout without creating separate state owners', () => {
    const shell = fixture.nativeElement.querySelector('section') as HTMLElement;

    expect(shell.className).toContain('lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,1fr)]');
    expect(shell.className).toContain('grid');
  });

  it('keeps the child-panel contract narrow so later interaction tests can focus on text updates in US2 without reworking shell composition', () => {
    const textInput = fixture.debugElement.query(By.directive(TextInputPanelComponent)).componentInstance as TextInputPanelComponent;
    const metricsPanel = fixture.debugElement.query(By.directive(MetricsPanelComponent)).componentInstance as MetricsPanelComponent;

    expect(textInput.value()).toBe(store.sourceText());
    expect(metricsPanel.metrics()).toBe(store.metrics());
    expect(metricsPanel.isPending()).toBe(store.isPending());
  });
});
