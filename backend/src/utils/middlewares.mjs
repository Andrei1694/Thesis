export const generateProjection = (req, res, next) => {
    const { mask } = req.query;
    const projection = { '_id': 0 };

    if (mask) {
        const fieldsToInclude = mask.split('|');
        fieldsToInclude.forEach((field) => {
            projection[field] = 1;
        });
    }

    req.projection = projection;
    next();
}

export const generatePagination = (req, res, next) => {
    const { page, limit } = req.query;
    const defaultPage = 1;
    const defaultLimit = 20; // You can change the default limit as needed


    const parsedPage = parseInt(page, 10) || defaultPage;
    const parsedLimit = parseInt(limit, 10) || defaultLimit;

    req.pagination = {
        page: parsedPage,
        limit: parsedLimit,
    };

    next();
};

export function errorHandler(err, req, res, next) {
    console.log("Middleware Error Hadnling");
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    console.log(errMsg)
    return res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
}