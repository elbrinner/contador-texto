import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-text-input-panel',
  templateUrl: './text-input-panel.component.html',
  styleUrl: './text-input-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputPanelComponent {
  readonly textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textareaElement');
  readonly textareaId = input('analysis-text');
  readonly label = input('Texto a analizar');
  readonly description = input(
    'Escribe o pega texto. La actualización del store se conectará cuando llegue la siguiente tarea.',
  );
  readonly placeholder = input('Pega o escribe tu texto aquí.');
  readonly value = input('');
  readonly disabled = input(false);
  readonly autofocus = input(false);
  readonly minRows = input(14);
  readonly valueChange = output<string>();

  readonly descriptionId = computed(() => `${this.textareaId()}-description`);
  readonly footerId = computed(() => `${this.textareaId()}-footer`);
  readonly currentLength = computed(() => this.value().length);

  constructor() {
    afterNextRender(() => {
      if (this.autofocus()) {
        this.textareaRef()?.nativeElement.focus();
      }
    });
  }

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;

    this.valueChange.emit(target.value);
  }
}
