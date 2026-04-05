import { createTeamSchema, updateTeamSchema, teamIdParamSchema } from "../../src/api/v1/validations/teamValidation";

describe("Team Validation Schemas", () => {
    describe("createTeamSchema", () => {
        it("should validate valid team data", () => {
            const validData = {
                name: "Yankees",
                city: "New York",
                league: "AL",
                foundedYear: 1901,
                isActive: true,
            };
            const { error } = createTeamSchema.validate(validData);
            expect(error).toBeUndefined();
        });

        it("should fail when required fields are missing", () => {
            const invalidData = { name: "Yankees" };
            const { error } = createTeamSchema.validate(invalidData);
            expect(error).toBeDefined();
        });
    });

    describe("teamIdParamSchema", () => {
        it("should validate valid team ID", () => {
            const validData = { id: "team123" };
            const { error } = teamIdParamSchema.validate(validData);
            expect(error).toBeUndefined();
        });

        it("should fail when id is missing", () => {
            const { error } = teamIdParamSchema.validate({});
            expect(error).toBeDefined();
        });
    });
});