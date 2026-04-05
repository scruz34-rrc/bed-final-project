import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../../src/api/v1/middleware/validate";
import Joi from "joi";

describe("validateRequest Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockReq = { body: {}, params: {}, query: {} };
        mockRes = { status: statusMock };
        mockNext = jest.fn();
    });

    describe("body validation", () => {
        it("should call next() when body is valid", () => {
            const schema = {
                body: Joi.object({
                    name: Joi.string().required(),
                }),
            };
            mockReq.body = { name: "Test" };
            const middleware = validateRequest(schema);

            middleware(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(statusMock).not.toHaveBeenCalled();
        });

        it("should return 400 when body is invalid", () => {
            const schema = {
                body: Joi.object({
                    name: Joi.string().required(),
                }),
            };
            mockReq.body = {};
            const middleware = validateRequest(schema);

            middleware(mockReq as Request, mockRes as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe("params validation", () => {
        it("should call next() when params are valid", () => {
            const schema = {
                params: Joi.object({
                    id: Joi.string().required(),
                }),
            };
            mockReq.params = { id: "123" };
            const middleware = validateRequest(schema);

            middleware(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it("should return 400 when params are invalid", () => {
            const schema = {
                params: Joi.object({
                    id: Joi.string().required(),
                }),
            };
            mockReq.params = {};
            const middleware = validateRequest(schema);

            middleware(mockReq as Request, mockRes as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(400);
        });
    });
});