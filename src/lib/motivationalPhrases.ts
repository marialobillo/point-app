// src/lib/motivationalPhrases.ts
export const PHRASES: string[] = [
  'Una tarea menos, un poquito más de ti hoy.',
  'Eso cuenta. Todo cuenta.',
  'Lo hiciste. Así, sin más.',
  'Vas construyendo el día, tarea a tarea.',
  'Pequeño paso, impulso real.',
  'Te lo has ganado.',
  'Esto también es cuidarte.',
  'Un movimiento más hacia adelante.',
  'Bien hecho, en serio.',
  'Sigue así, a tu ritmo.',
  'Eso ya no pesa.',
  'Una menos en la lista, una más en ti.',
  'Lo difícil también se hace, y lo hiciste.',
  'Hoy ya has avanzado algo.',
  'No hace falta más que esto: lo hiciste.',
  'Ese impulso es tuyo.',
  'Vas sumando, aunque no lo sientas.',
  'Un tache, un respiro.',
  'Te mueves, y eso ya es mucho.',
  'Nada mal para hoy.',
  'Esto se queda hecho.',
  'Un paso pequeño también es un paso.',
  'Lo tenías pendiente, ya no.',
  'Aquí sigues, avanzando.',
  'Eso también suma puntos de verdad.',
  'Bien por ti.',
  'Una cosa menos en la cabeza.',
  'Se nota el esfuerzo, aunque parezca poco.',
  'Vas bien.',
  'Otra tarea, otro logro pequeño.',
  'Esto ya está. Sigamos.',
  'Le has dado para adelante.',
  'Ese es el camino: una cosa cada vez.',
  'Hoy también cuenta.',
]

export function pickRandomPhrase(): string {
  const index = Math.floor(Math.random() * PHRASES.length)
  return PHRASES[index]
}
