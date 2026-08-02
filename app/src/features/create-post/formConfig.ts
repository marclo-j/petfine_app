import { z } from 'zod';
import type { PostType, Sex } from '@/types/domain';

/**
 * Config declarativa del formulario de publicación por tipo.
 * Cada tipo describe sus secciones; el PostFormScreen las renderiza
 * dinámicamente. Un solo componente para los 3 tipos (anti-duplicación).
 */

export interface PostFieldConfig {
  /** Clave del PostDetail al que se mapea el valor. */
  name: string;
  label: string;
  placeholder: string;
  /** Proporción del ancho dentro de su fila (Raza/Edad/Tamaño). */
  flex?: string;
  multiline?: boolean;
}

export type PostFormSection =
  | { kind: 'photos' }
  | { kind: 'sexo' }
  | { kind: 'vacunas' }
  | { kind: 'row'; fields: PostFieldConfig[] };

export const postFormConfig: Record<PostType, PostFormSection[]> = {
  perdido: [
    { kind: 'photos' },
    {
      kind: 'row',
      fields: [
        {
          name: 'descripcion',
          label: 'Descripción de la publicación',
          placeholder: '(de dónde viene, por qué se da en adopción)',
          multiline: true,
        },
      ],
    },
    { kind: 'sexo' },
    {
      kind: 'row',
      fields: [
        { name: 'raza', label: 'Raza/tipo', placeholder: '(¿Qué raza es?)', flex: 'flex-[1.6]' },
        { name: 'edad', label: 'Edad', placeholder: '(1, 2)', flex: 'flex-[0.6]' },
        { name: 'tamano', label: 'Tamaño', placeholder: '(40cm, 55cm)', flex: 'flex-[1.1]' },
      ],
    },
    {
      kind: 'row',
      fields: [
        {
          name: 'color',
          label: 'Color/marcas',
          placeholder: '(especificar bien, ej: marrón con mancha blanca)',
        },
      ],
    },
    {
      kind: 'row',
      fields: [
        { name: 'fecha', label: 'Fecha y hora', placeholder: '(Fecha)', flex: 'flex-1' },
        { name: 'hora', label: '', placeholder: '(Hora)', flex: 'flex-1' },
        { name: 'recompensa', label: '¿Recompensa?', placeholder: '(monto opcional)', flex: 'flex-1' },
      ],
    },
    {
      kind: 'row',
      fields: [
        { name: 'zonaPerdido', label: 'Zona exacta donde se perdió', placeholder: '(barrio, referencia)' },
      ],
    },
    {
      kind: 'row',
      fields: [
        {
          name: 'temperamento',
          label: 'Temperamento',
          placeholder: '(importante: si es dócil o asustadizo)',
        },
      ],
    },
  ],
  encontrado: [
    { kind: 'photos' },
    {
      kind: 'row',
      fields: [
        {
          name: 'descripcion',
          label: 'Descripción de la publicación',
          placeholder: '(describe cómo lo encontraste)',
          multiline: true,
        },
      ],
    },
    { kind: 'sexo' },
    {
      kind: 'row',
      fields: [
        { name: 'raza', label: 'Raza/tipo', placeholder: '(¿Qué raza es?)', flex: 'flex-[1.6]' },
        { name: 'edad', label: 'Edad', placeholder: '(1, 2)', flex: 'flex-[0.6]' },
        { name: 'tamano', label: 'Tamaño', placeholder: '(40cm, 55cm)', flex: 'flex-[1.1]' },
      ],
    },
    {
      kind: 'row',
      fields: [
        {
          name: 'color',
          label: 'Color/marcas',
          placeholder: '(especificar bien, ej: marrón con mancha blanca)',
        },
      ],
    },
    {
      kind: 'row',
      fields: [
        {
          name: 'estadoFisico',
          label: 'Estado físico',
          placeholder: '(heridas, condición general)',
        },
      ],
    },
    {
      kind: 'row',
      fields: [
        { name: 'ubicacionEncontrado', label: 'Ubicación', placeholder: '(Elige una ubicación)' },
      ],
    },
    {
      kind: 'row',
      fields: [
        {
          name: 'temperamento',
          label: 'Temperamento',
          placeholder: '(calmado, asustadizo, juguetón, etc.)',
        },
      ],
    },
  ],
  adopcion: [
    { kind: 'photos' },
    {
      kind: 'row',
      fields: [
        {
          name: 'descripcion',
          label: 'Descripción de la publicación',
          placeholder: '(de dónde viene, por qué se da en adopción)',
          multiline: true,
        },
      ],
    },
    { kind: 'sexo' },
    {
      kind: 'row',
      fields: [
        { name: 'raza', label: 'Raza/tipo', placeholder: '(¿Qué raza es?)', flex: 'flex-[1.6]' },
        { name: 'edad', label: 'Edad', placeholder: '(1, 2)', flex: 'flex-[0.6]' },
        { name: 'tamano', label: 'Tamaño', placeholder: '(40cm, 55cm)', flex: 'flex-[1.1]' },
      ],
    },
    { kind: 'vacunas' },
    {
      kind: 'row',
      fields: [
        {
          name: 'temperamento',
          label: 'Temperamento',
          placeholder: '(calmado, energético, juguetón, etc.)',
        },
      ],
    },
    {
      kind: 'row',
      fields: [
        {
          name: 'requisitos',
          label: 'Requisitos mínimos',
          placeholder: '(espacio, tiempo disponible, experiencia previa)',
          multiline: true,
        },
      ],
    },
    {
      kind: 'row',
      fields: [{ name: 'ubicacion', label: 'Ubicación', placeholder: '(Elige una ubicación)' }],
    },
  ],
};

export const POST_TYPE_LABEL: Record<PostType, string> = {
  perdido: 'Perdí a mi perro',
  encontrado: 'Encontré un perro',
  adopcion: 'Quiero dar en adopción',
};

/** Valores del formulario: planos, independientes del dominio. */
export interface PostFormValues {
  fotos: (string | null)[];
  descripcion: string;
  sexo: Sex | null;
  raza: string;
  edad: string;
  tamano: string;
  color: string;
  fecha: string;
  hora: string;
  recompensa: string;
  zonaPerdido: string;
  estadoFisico: string;
  ubicacionEncontrado: string;
  ubicacion: string;
  vacunas: string;
  requisitos: string;
  temperamento: string;
}

export const defaultPostFormValues: PostFormValues = {
  fotos: [null, null, null],
  descripcion: '',
  sexo: null,
  raza: '',
  edad: '',
  tamano: '',
  color: '',
  fecha: '',
  hora: '',
  recompensa: '',
  zonaPerdido: '',
  estadoFisico: '',
  ubicacionEncontrado: '',
  ubicacion: '',
  vacunas: '',
  requisitos: '',
  temperamento: '',
};

/** Reglas comunes: mínimo 1 foto y descripción obligatoria (texto del Figma). */
export const postFormSchema = z.object({
  fotos: z
    .array(z.string().nullable())
    .refine((f) => f.some(Boolean), { message: 'Agrega al menos 1 foto (máx. 3)' }),
  descripcion: z.string().min(1, { message: 'Escribe una descripción' }),
  sexo: z.enum(['macho', 'hembra']).nullable(),
  raza: z.string(),
  edad: z.string(),
  tamano: z.string(),
  color: z.string(),
  fecha: z.string(),
  hora: z.string(),
  recompensa: z.string(),
  zonaPerdido: z.string(),
  estadoFisico: z.string(),
  ubicacionEncontrado: z.string(),
  ubicacion: z.string(),
  vacunas: z.string(),
  requisitos: z.string(),
  temperamento: z.string(),
});

export type PostFormSchema = typeof postFormSchema;
