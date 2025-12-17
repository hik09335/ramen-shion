const enum Environment {
    Development = 'development',
    Production = 'production',
}

export const isDevelopment = process.env.NODE_ENV === Environment.Development;

export const isProduction = process.env.NODE_ENV === Environment.Production;