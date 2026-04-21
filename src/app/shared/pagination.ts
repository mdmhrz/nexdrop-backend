export interface IPaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface IPaginatedResult<T> {
    data: T[];
    meta: IPaginationMeta;
}

export const calculatePaginationMeta = (
    page: number,
    limit: number,
    total: number
): IPaginationMeta => {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages
    };
};

export const getPaginationParams = (page?: string | string[], limit?: string | string[]) => {
    const pageNum = page ? parseInt(Array.isArray(page) ? page[0] : page, 10) : 1;
    const limitNum = limit ? parseInt(Array.isArray(limit) ? limit[0] : limit, 10) : 10;

    return {
        page: isNaN(pageNum) || pageNum < 1 ? 1 : pageNum,
        limit: isNaN(limitNum) || limitNum < 1 ? 10 : limitNum
    };
};

export const paginationHelper = (query: any) => {
    const { page, limit } = getPaginationParams(query.page, query.limit);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
