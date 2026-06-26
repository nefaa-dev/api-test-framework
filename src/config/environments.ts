export type EnvironmentName = 'remote' | 'local';

export interface EnvironmentConfig {
    baseURL: string;
    apiTimeout: number;
}


export const environments: Record<EnvironmentName, EnvironmentConfig> = {
    remote: {
        baseURL: 'https://restful-booker.herokuapp.com',
        apiTimeout: 30_000,
    },
    local: {
        baseURL: 'http://localhost:3001',
        apiTimeout: 10_000,
    },
};