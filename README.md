# Prototipo de asistente virtual de atención al cliente

**Evidencia:** AA1-EV02. Informe sobre inteligencia artificial aplicada en la productividad.
**Programa:** Implementación de herramientas de inteligencia artificial en la optimización de la productividad.
**Caso de aplicación:** Binah Sys (https://binahsys.com), empresa de desarrollo de software a medida.

---

## 1. Introducción

La inteligencia artificial (IA) es el conjunto de técnicas que permiten a un sistema informático realizar tareas que normalmente requieren inteligencia humana: comprender lenguaje, aprender de datos, razonar y generar respuestas. Sus bases se remontan a la propuesta de Alan Turing (1950) y a la conferencia de Dartmouth (1956), donde se acuñó el término. Desde entonces ha pasado por sistemas expertos basados en reglas, aprendizaje automático y, en la última década, redes neuronales profundas y modelos de lenguaje de gran tamaño (LLM), que hoy se usan en entornos productivos.

Este documento describe un prototipo funcional que aplica un LLM a un proceso real: la **atención de consultas de clientes**. El objetivo es reducir el trabajo manual de responder preguntas repetitivas, mantener disponibilidad permanente y escalar a una persona solo los casos que el asistente no puede resolver.

## 2. Desarrollo

### 2.1 Principios de funcionamiento

Un LLM es un modelo entrenado con grandes volúmenes de texto que predice la siguiente palabra a partir del contexto recibido. En este prototipo:

1. El usuario escribe una consulta.
2. La aplicación toma la base de conocimiento de la empresa (`public/contexto.md`) y la envía al modelo junto con la conversación, como instrucciones de sistema.
3. El modelo interpreta la pregunta y redacta una respuesta basada **únicamente** en ese contexto.
4. Si la información no está en el contexto, el modelo lo indica y recomienda contactar a una persona.

Esta técnica, conocida como generación aumentada por recuperación en su forma más simple, evita que el modelo invente datos y permite actualizar el conocimiento del asistente editando un archivo de texto, sin reentrenar nada. Es un ejemplo de cómo la IA procesa e interpreta datos de la organización para usarlos de forma eficiente.

### 2.2 Aplicaciones de la IA en distintos entornos

| Entorno | Ejemplo |
| :-- | :-- |
| Personal | Asistentes de voz, traducción, resumen de textos. |
| Social | Accesibilidad (subtitulado automático), educación personalizada. |
| Productivo | Atención al cliente, conciliación de pagos, clasificación de documentos, análisis de datos. |

### 2.3 Proceso seleccionado para automatizar

**Proceso:** atención de consultas frecuentes sobre servicios, precios, tiempos y contacto.

**Justificación:**
- Las preguntas se repiten con alta frecuencia (qué servicios ofrecen, cuánto cuesta una web, cómo contactar).
- Las respuestas están documentadas y son estables.
- Responder manualmente consume tiempo del equipo y genera demoras fuera del horario laboral.

**Flujo de trabajo:**

```
Cliente escribe consulta
        │
        ▼
Se carga el contexto (contexto.md)
        │
        ▼
El modelo genera la respuesta
        │
        ├── Consulta cubierta  ──► Se registra como "resuelta"
        │
        └── Consulta no cubierta ─► Se registra como "escalada"
                                    y puede enviarse por correo al equipo
```

### 2.4 Herramienta seleccionada

| Criterio | Decisión |
| :-- | :-- |
| Tipo de herramienta | Modelo de lenguaje accedido por API compatible con el formato de chat de OpenAI. |
| Proveedor usado en el prototipo | Groq (capa gratuita), modelo `openai/gpt-oss-120b`. |
| Razón | Costo cero para la prueba, baja latencia, buen manejo del español y formato estándar que permite cambiar de proveedor modificando solo tres variables (`API_KEY`, `BASE_URL`, `MODEL`). |
| Programación requerida | Mínima: el comportamiento del asistente se define en lenguaje natural y en un archivo de contexto. |

### 2.5 Arquitectura

```
src/
  config/        # env.ts: lectura centralizada y validada de variables de entorno
  components/    # Header, ChatWindow, MessageBubble, InputBar, MetricsPanel
  hooks/         # useChat, useMetrics
  services/      # aiService, contextLoader, emailService
  types/         # tipos TypeScript
public/
  contexto.md    # base de conocimiento del negocio
```

Tecnologías: React 19, TypeScript, Vite, Framer Motion.

### 2.6 Funcionalidades

- Chat con respuestas generadas a partir del contexto de la empresa.
- Panel de métricas: consultas totales, resueltas, escaladas, tiempo promedio de respuesta y tasa de resolución.
- Envío de la consulta por correo mediante EmailJS o, si no está configurado, `mailto:`.
- Modo demostración con respuestas simuladas cuando no hay API key.

## 3. Instalación y ejecución

Requisitos: Node.js 20 o superior y [pnpm](https://pnpm.io).

```bash
# 1. Instalar dependencias
pnpm install

# 2. Crear el archivo de configuración
cp .env.example .env

# 3. Editar .env con los valores del proveedor (sin comillas en la key)
#    API_KEY=<tu key>
#    BASE_URL=https://api.groq.com/openai/v1
#    MODEL=openai/gpt-oss-120b
#    APP_NAME=Asistente de Atención al Cliente
#    COMPANY_NAME=Binah SYS

# 4. Ejecutar en desarrollo
pnpm dev
```

Abrir http://localhost:5173. Después de modificar `.env` hay que reiniciar `pnpm dev`.

Otros comandos:

```bash
pnpm build     # compila TypeScript y genera dist/
pnpm preview   # sirve la versión compilada
pnpm lint      # análisis estático con oxlint
```

Para enviar correos reales se configuran `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID` y `EMAILJS_PUBLIC_KEY`. Sin ellas se abre el cliente de correo del usuario.

Para adaptar el asistente a otra empresa basta con reemplazar el contenido de `public/contexto.md`.

## 4. Evaluación de resultados

El panel de métricas registra cada consulta en el navegador (`localStorage`) y calcula:

| Indicador | Qué mide | Mejora esperada frente al proceso manual |
| :-- | :-- | :-- |
| Tiempo promedio de respuesta | Segundos entre la consulta y la respuesta | De horas (espera de una persona) a segundos |
| Tasa de resolución | Consultas resueltas / consultas totales | Reduce la carga del equipo en preguntas repetitivas |
| Consultas escaladas | Casos que requieren a una persona | Permiten enfocar el tiempo humano en lo complejo |
| Disponibilidad | Horario de atención | De horario laboral a 24/7 |

Resultados de la prueba realizada (completar con las capturas del panel):

| Consultas totales | Resueltas | Escaladas | Tiempo promedio | Tasa de resolución |
| :-- | :-- | :-- | :-- | :-- |
|  |  |  |  |  |

## 5. Ética, transparencia y responsabilidad

- **Transparencia:** el pie de página identifica la aplicación como un prototipo de atención con IA y el contexto utilizado.
- **Control de alucinaciones:** el modelo solo responde con el contexto entregado; ante falta de información lo declara y deriva a una persona. No se inventan precios ni plazos.
- **Supervisión humana:** las consultas que el asistente no puede resolver se marcan como escaladas y el usuario puede enviarlas por correo para que un integrante del equipo responda.
- **Privacidad:** no se almacenan datos personales en servidores propios; el historial queda en el navegador del usuario. El formulario de contacto del sitio de la empresa solicita consentimiento conforme a la LPDP.
- **Seguridad de credenciales:** la API key se lee desde `.env`, que está excluido del repositorio. En este prototipo la clave se incorpora al código del cliente, lo cual es aceptable solo en pruebas locales; en producción debe moverse a un backend que actúe como intermediario.
- **Limitaciones:** el asistente depende de la calidad y vigencia de `contexto.md` y puede cometer errores de interpretación. Su uso es de apoyo, no de reemplazo del equipo.

## 6. Conclusiones

- La IA generativa permite automatizar la atención de consultas frecuentes con poca programación, porque el conocimiento del negocio se entrega como texto y no como código.
- Limitar al modelo al contexto proporcionado reduce errores y hace que sus respuestas sean verificables.
- El diseño con variables de entorno hace el prototipo independiente del proveedor: se puede cambiar de modelo sin modificar la lógica.
- Medir consultas, resolución y tiempos permite evaluar el beneficio real y decidir si ampliar la automatización.
- Para un uso en producción se requiere un backend que proteja la clave, un proceso de actualización del contexto y revisión periódica de las respuestas.

## 7. Evidencia

- Capturas del chat respondiendo consultas del contexto.
- Capturas del panel de métricas.
- Correo recibido con una consulta escalada (o captura del cliente de correo abierto).
