export type ApiValidationError = {
  field: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  validationErrors?: ApiValidationError[];

  constructor(message: string, status: number, validationErrors?: ApiValidationError[]) {
    super(message);
    this.status = status;
    this.validationErrors = validationErrors;
    this.name = 'ApiError';
  }
}

export async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorData;

    if (contentType?.includes('application/json')) {
      errorData = await response.json();
    }

    // Si es un error 400 con detalles de validación
    if (response.status === 400 && errorData?.message) {
      // Intentar extraer errores de validación si vienen en un formato estructurado
      const validationErrors = errorData.errors || [];
      throw new ApiError(
        errorData.message || 'Validation error',
        response.status,
        validationErrors
      );
    }

    // Para otros errores
    throw new ApiError(
      errorData?.message || `Request failed with status ${response.status}`,
      response.status
    );
  }

  return response.json();
}
