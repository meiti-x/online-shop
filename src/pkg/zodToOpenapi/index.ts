/* eslint-disable */
import { ZodBoolean, ZodNumber, ZodObject, ZodRawShape, ZodString, ZodTypeAny } from 'zod';

export function zodTypeToOpenApi(zodType: ZodTypeAny): any {
  const def = zodType._def;

  if (zodType instanceof ZodString) {
    const schema: any = { type: 'string' };
    if (def.checks) {
      for (const check of def.checks) {
        if (check.kind === 'email') schema.format = 'email';
        if (check.kind === 'min') schema.minLength = check.value;
        if (check.kind === 'max') schema.maxLength = check.value;
      }
    }
    return schema;
  }

  if (zodType instanceof ZodNumber) {
    const schema: any = { type: 'number' };
    if (def.checks) {
      for (const check of def.checks) {
        if (check.kind === 'int') schema.format = 'int32';
        if (check.kind === 'min') schema.minimum = check.value;
        if (check.kind === 'max') schema.maximum = check.value;
      }
    }
    return schema;
  }

  if (zodType instanceof ZodBoolean) {
    return { type: 'boolean' };
  }

  if (zodType instanceof ZodObject) {
    return zodObjectToOpenApi(zodType);
  }

  return { type: 'string' }; // Fallback
}

function zodObjectToOpenApi(schema: ZodObject<ZodRawShape>) {
  const { shape } = schema;
  const properties: Record<string, any> = {};
  const required: string[] = [];

  for (const key in shape) {
    const fieldSchema = shape[key];
    const def = fieldSchema._def;

    properties[key] = zodTypeToOpenApi(fieldSchema);

    if (!def.optional) {
      required.push(key);
    }
  }

  return {
    type: 'object',
    properties,
    required,
  };
}
