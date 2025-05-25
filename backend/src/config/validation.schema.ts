import * as Joi from 'joi';

const validationSchema = Joi.object({
  // Environment config
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .insensitive() // allow case-insensitive values
    .default('development')
    .description('Application environment'),

  // Server settings
  SERVER_HOST: Joi.alternatives()
    .try(
      Joi.string().hostname(),
      Joi.string().ip({ version: ['ipv4', 'ipv6'] }),
    )
    .default('localhost')
    .description('Hostname or IP address to bind the server'),

  SERVER_PORT: Joi.number()
    .port()
    .default(3000)
    .description('Port number to listen on'),

  // Database connection details
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required()
    .description('PostgreSQL connection string URL'),

  // Encryption config
  ENCRYPTION_ALGORITHM: Joi.string().default('aes-256-cbc'),
  ENCRYPTION_IV_LENGTH: Joi.number().default(16),
  SECRET_KEY: Joi.string().min(32).required(),
});

export default validationSchema;
