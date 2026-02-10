import path from 'path';
import SwaggerParser from '@apidevtools/swagger-parser';

export async function loadSwagger() {
  const api = await SwaggerParser.bundle(
    path.resolve(__dirname, 'openapi.yaml')
  );

  return api;
}
