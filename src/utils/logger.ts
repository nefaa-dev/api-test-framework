export const logger = {
    info: (message: string): void => console.log(`[INFO]  ${message}`),
    error: (message: string): void => console.error(`[ERROR]  ${message}`),
    debug: (message: string): void => {
        if(process.env.DEBUG === 'true') console.log(`[DEBUG]  ${message}`);
    },
}