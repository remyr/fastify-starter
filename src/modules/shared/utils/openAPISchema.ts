import { generateSchema } from '@anatine/zod-openapi';
import { SchemaObject } from 'openapi3-ts';
import { z, ZodType } from 'zod';

export type Models<Key extends string = string> = {
  readonly [K in Key]: ZodType<unknown>;
};

export type SchemaKey<M extends Models> = M extends Models<infer Key> ? Key & string : never;
export type SchemaKeyOrDescription<M extends Models> =
  | SchemaKey<M>
  | {
      readonly description: string;
      readonly key: SchemaKey<M>;
    };

type $Ref<M extends Models> = (key: SchemaKeyOrDescription<M>) => {
  readonly $ref: string;
  readonly description?: string;
};

export type BuildJsonSchemasResult<M extends Models> = {
  readonly schemas: SchemaObject[];
  readonly $ref: $Ref<M>;
};

export const buildOpenapiSchema = <M extends Models>(
  models: M,
  opts: { $id?: string } = {},
): BuildJsonSchemasResult<M> => {
  const zodSchema = z.object(models);

  const $id = opts.$id ?? `Schema`;

  const zodJsonSchema = generateSchema(zodSchema);

  const jsonSchema = {
    $id,
    ...zodJsonSchema,
  };

  const $ref: $Ref<M> = (key: string | { key: string; description?: string }) => {
    const $ref = `${$id}#/properties/${typeof key === `string` ? key : key.key}`;
    return typeof key === `string`
      ? {
          $ref,
        }
      : {
          $ref,
          description: key.description,
        };
    // const $ref = `${$id}#/properties/${key}`;
    // return {
    //   $ref,
    // };
  };

  return {
    schemas: [jsonSchema],
    $ref,
  };
};
