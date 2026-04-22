# Quickstart: Arquitectura Inicial de la Aplicacion

## Objective

Validar que la implementacion futura respete la arquitectura inicial definida
para Contador Texto antes de ampliar funcionalidades.

## Preconditions

1. Usar una version de Node compatible con Angular 21.
2. Instalar dependencias del workspace.
3. Tener disponible el navegador integrado de VS Code para validacion visual.

## Implementation Validation Flow

1. Crear la estructura Angular inicial respetando `src/app/components/`,
   `src/app/services/`, `src/app/utils/` y `src/app/models/`.
2. Implementar una sola ruta `/` que renderice un `analysis-shell`.
3. Conectar la entrada de texto a un store con Signals.
4. Delegar normalizacion y calculo de metricas a utilidades puras y a un
   servicio orquestador.
5. Mostrar resultados en un panel de metricas desacoplado del panel de entrada.

## Required Validation Commands

```bash
ng test
ng lint
ng build
```

## Visual Review Checklist

1. Abrir la aplicacion en Simple Browser.
2. Confirmar que la shell principal contiene un panel de entrada y un panel de
   metricas claramente separados.
3. Confirmar que el layout se adapta a movil y escritorio sin crear pantallas
   paralelas no previstas.
4. Confirmar que la actualizacion visual de metricas responde al flujo unico de
   entrada definido por la arquitectura.

## Documentation Follow-through

1. Actualizar README con la estructura base del proyecto.
2. Registrar la decision arquitectonica inicial en un ADR.
3. Reflejar cambios estructurales relevantes en documentacion tecnica y release
   notes.