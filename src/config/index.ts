import dotenv from 'dotenv';
import { environments, EnvironmentConfig, EnvironmentName } from './environments';

dotenv.config();

interface Credentials {
  username: string;
  password: string;
}

export interface AppConfig {
  env: EnvironmentName;
  baseURL: string;
  apiTimeout: number;
  credentials: Credentials;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function resolveEnvironment(): EnvironmentName {
  const env = (process.env.TEST_ENV ?? 'remote') as EnvironmentName;
  if (!(env in environments)) {
    throw new Error(
      `Unknown TEST_ENV "${env}". Valid options: ${Object.keys(environments).join(', ')}`,
    );
  }
  return env;
}

function buildConfig(): AppConfig {
  const env = resolveEnvironment();
  const envConfig: EnvironmentConfig = environments[env];

  return {
    env,
    baseURL: envConfig.baseURL,
    apiTimeout: envConfig.apiTimeout,
    credentials: {
      username: required('ADMIN_USERNAME'),
      password: required('ADMIN_PASSWORD'),
    },
  };
}

export const config: AppConfig = buildConfig();
