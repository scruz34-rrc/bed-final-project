import { createPlayerSchema, updatePlayerSchema, playerIdParamSchema } from "../../src/api/v1/validations/playerValidation";

describe("Player Validation Schemas", () => {
    describe("createPlayerSchema", () => {
        it("should validate valid player data", () => {
            const validData = {
                firstName: "Aaron",
                lastName: "Judge",
                position: "RF",
                teamId: "team123",
                debutYear: 2016,
                isActive: true,
            };
            const { error } = createPlayerSchema.validate(validData);
            expect(error).toBeUndefined();
        });

        it("should fail when required fields are missing", () => {
            const invalidData = { firstName: "Aaron" };
            const { error } = createPlayerSchema.validate(invalidData);
            expect(error).toBeDefined();
        });
    });

    describe("playerIdParamSchema", () => {
        it("should validate valid player ID", () => {
            const validData = { id: "player123" };
            const { error } = playerIdParamSchema.validate(validData);
            expect(error).toBeUndefined();
        });
    });
});