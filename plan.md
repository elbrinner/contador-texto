# PASO 1 — Preparar el entorno del proyecto

Este proyecto demostrará buenas prácticas modernas con:
- Angular 21
- TailwindCSS
- GitFlow
- Spec‑Kit
- GitHub Squad (Ralph + Scribe)
- Hooks de GitHub Copilot
- Simple Browser para validación visual
- AGENTS.md para agentes de IA

---

## 1. Crear carpeta del proyecto

```bash
mkdir contador-texto && cd contador-texto
git init


npm install -g @bradygaster/squad-cli
squad init

gh auth login

specify init --here 

copilot --agent squad --yolo


Paso 2 — Configurar 




Esto generará un archivo en el repositorio con los principios rectores del proyecto.

---

## 2. Contenido recomendado para nuestra Constitución

### 🧱 Principios técnicos obligatorios

- El proyecto usa **Angular 21** con **componentes standalone**.
- La reactividad se implementa con **Signals**.
- El sistema de estilos es **TailwindCSS**.
- La arquitectura sigue un modelo claro:
  - `components/`
  - `services/`
  - `utils/`
  - `models/`
- Todo el código debe estar tipado estrictamente con TypeScript.
- Los agentes deben generar código limpio, legible y modular.

---

### 🧪 Principios de calidad

- Todos los PRs deben pasar:
  - `ng test`
  - `ng lint`
  - `ng build`
- El código debe seguir las reglas de Prettier y ESLint.
- Los agentes deben escribir tests unitarios para cada servicio.
- Los PRs deben ser pequeños y fáciles de revisar.

---

### 🌿 GitFlow como estrategia de ramas

- `main` → producción  
- `develop` → integración  
- `feature/*` → nuevas funcionalidades  
- `release/*` → preparación de versiones  
- `hotfix/*` → correcciones urgentes  

Los agentes **no pueden** hacer push directo a `main`.

---

### 🤖 Principios para agentes (Copilot, Squad, Ralph, Scribe)

- Deben respetar GitFlow.
- Deben respectar los principios de SOLID
- Deben ejecutar tests antes de finalizar una tarea.
- Deben documentar cambios en PRs.
- Deben abrir Issues si detectan errores o mejoras.
- Deben usar **Simple Browser** para validar visualmente la aplicación.
- Deben evitar mezclar credenciales (EMU/personal) si usan GitHub CLI.

---

### 🧭 Principios de documentación

- Scribe debe mantener actualizado:
  - README
  - ADRs
  - Documentación técnica
  - Notas de release
- Toda decisión técnica debe quedar registrada.

---

## 3. Crear la especificación inicial


Esto abrirá un diálogo donde Copilot te pedirá detalles sobre la funcionalidad.

---

## 2. Responder a Spec‑Kit con esta descripción funcional

Copia y pega esta respuesta cuando Copilot te pregunte:

> **Descripción funcional del proyecto:**
>
> El usuario verá una aplicación web simple con un diseño profesional.  
> En la parte izquierda habrá un textarea grande donde podrá escribir o pegar texto.  
> En la parte derecha habrá un panel lateral que mostrará en tiempo real:
> - número total de palabras  
> - número total de caracteres  
> - número estimado de tokens  
> - densidad de palabras  
> - longitud media de palabras  
>
> El panel lateral debe actualizarse automáticamente mientras el usuario escribe.  
> No hay backend: todo ocurre en el navegador.  
>
> La interfaz debe ser clara, minimalista y construida con TailwindCSS.  
> La aplicación debe ser accesible y funcionar en móvil y escritorio.  
>
> El objetivo es que el usuario pueda analizar texto de forma rápida, visual y sin distracciones.


##PASO 4