/**
 * Tokens de diseño extraídos del archivo Figma de PetFine.
 * Son la fuente única de la paleta; los componentes usan las clases
 * de tailwind.config.js mapeadas a estos valores.
 */
export const colors = {
  primary: '#F99139',
  ink: '#000000',
  muted: '#828282',
  line: '#E0E0E0',
  lineLight: '#E6E6E6',
  surface: '#FFFFFF',
  surfaceSubtle: '#F7F7F7',
  surfacePress: '#EEEEEE',
  surfacePlaceholder: '#E9E9EB',
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayStrong: 'rgba(0, 0, 0, 0.5)',
} as const;

export const radii = {
  sm: 4,
  md: 5,
  lg: 8,
  full: 1000,
} as const;

export const spacing = {
  pageX: 16,
  section: 16,
  field: 16,
} as const;
