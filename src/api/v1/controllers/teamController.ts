import { Request, Response, NextFunction } from "express";
import * as teamService from "../services/teamService";
import { successResponse, errorResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const getAllTeams = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const teams = await teamService.getAllTeams();
        res.status(HTTP_STATUS.OK).json(successResponse(teams, "Teams retrieved successfully"));
    }
    
    catch (error) {
        next(error);
    }
};

export const getTeamById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const team = await teamService.getTeamById(req.params.id);
        if (!team) {
            res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("Team not found", "TEAM_NOT_FOUND"));
            return;
        }
        res.status(HTTP_STATUS.OK).json(successResponse(team, "Team retrieved successfully"));
    }
    
    catch (error) {
        next(error);
    }
};

export const createTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const team = await teamService.createTeam(req.body);
        res.status(HTTP_STATUS.CREATED).json(successResponse(team, "Team created successfully"));
    }
    
    catch (error) {
        next(error);
    }
};

export const updateTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const team = await teamService.updateTeam(req.params.id, req.body);
        if (!team) {
            res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("Team not found", "TEAM_NOT_FOUND"));
            return;
        }
        res.status(HTTP_STATUS.OK).json(successResponse(team, "Team updated successfully"));
    }
    
    catch (error) {
        next(error);
    }
};

export const deleteTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const deleted = await teamService.deleteTeam(req.params.id);
        if (!deleted) {
            res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("Team not found", "TEAM_NOT_FOUND"));
            return;
        }
        res.status(HTTP_STATUS.OK).json(successResponse(null, "Team deleted successfully"));
    }
    
    catch (error) {
        next(error);
    }
};