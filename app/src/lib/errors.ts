/** Errores tipados de la capa API. */

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Guard para distinguir ApiError de errores de red desconocidos. */
export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

/** Convierte una respuesta HTTP en datos o en ApiError. */
export async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Error ${res.status}`;
    let code: string | undefined;
    try {
      const body = (await res.json()) as { message?: string; code?: string };
      message = body.message ?? message;
      code = body.code;
    } catch {
      // cuerpo no JSON: se conserva el mensaje por defecto
    }
    throw new ApiError(message, res.status, code);
  }
  return (await res.json()) as T;
}
