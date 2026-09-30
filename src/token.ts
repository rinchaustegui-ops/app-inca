/**
 * JWT ESTÁTICO DE EJEMPLO — solo para desarrollo local. Nunca usar en producción.
 *
 * Firmado HS256 con el `JWT_SECRET` de desarrollo de itcm-dp-sdr-do/back-end
 * (`change-me-in-env`), así el backend lo acepta tal cual. El backend resuelve
 * al usuario por el claim `email` contra la tabla `usuarios`, así que ese
 * correo tiene que existir en la DB local.
 *
 * Payload:
 *   { sub: "demo-user-001", email: "admin@empresa.com", name: "Usuario Demo",
 *     iat: 1790726400, exp: 2105827200 }   // vence en 2036
 *
 * Para regenerarlo con otro correo/secreto: `npm run gen-token -- otro@correo.com [secreto]`.
 */
export const STATIC_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXItMDAxIiwiZW1haWwiOiJyaW5jaGF1c3RlZ3VpQGluc2lkZS5jb20ucGUiLCJuYW1lIjoiVXN1YXJpbyBEZW1vIiwiaWF0IjoxNzkwODAyMTk0LCJleHAiOjIxMDYxNjIxOTR9.iI9xMbECDwRBJZ2z8lz2NdzT6Lo4lvUpNLXvvrfthf4';

export function decodePayload(jwt: string): Record<string, unknown> {
  const part = jwt.split('.')[1] ?? '';
  const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(json) as Record<string, unknown>;
}
