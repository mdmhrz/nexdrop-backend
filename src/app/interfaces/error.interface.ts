export type TErrorSources = {
    path: string | number;
    message: string;
}

export type TErrorResponse = {
    statusCode?: number;
    success: boolean;
    message: string;
    errorSources: TErrorSources[];
    stack?: string;
    error?: string;
}
