import request from "supertest";
import app from "../../src/app";

describe("Rate Limiter Middleware", () => {
    describe("GET /api/v1/teams (standard limiter)", () => {
        it("should include rate limit headers in response", async () => {
            const response = await request(app).get("/api/v1/teams");

            // Should succeed (may return 200 or empty array)
            expect(response.status).not.toBe(429);
            
            // Verify rate limit headers are present
            expect(response.headers["ratelimit-limit"]).toBeDefined();
            expect(response.headers["ratelimit-remaining"]).toBeDefined();
            expect(response.headers["ratelimit-reset"]).toBeDefined();
        });
    });
});