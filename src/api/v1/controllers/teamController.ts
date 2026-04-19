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
        
        const orderedTeams = teams.map(team => ({
            id: team.id,
            name: team.name,
            city: team.city,
            league: team.league,
            foundedYear: team.foundedYear,
            isActive: team.isActive
        }));
        
        res.status(HTTP_STATUS.OK).json(successResponse(orderedTeams, "Teams retrieved successfully"));
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
        
        const orderedTeam = {
            id: team.id,
            name: team.name,
            city: team.city,
            league: team.league,
            foundedYear: team.foundedYear,
            isActive: team.isActive
        };
        
        res.status(HTTP_STATUS.OK).json(successResponse(orderedTeam, "Team retrieved successfully"));
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
        
        const orderedTeam = {
            id: team.id,
            name: team.name,
            city: team.city,
            league: team.league,
            foundedYear: team.foundedYear,
            isActive: team.isActive
        };
        
        res.status(HTTP_STATUS.CREATED).json(successResponse(orderedTeam, "Team created successfully"));
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
        
        const orderedTeam = {
            id: team.id,
            name: team.name,
            city: team.city,
            league: team.league,
            foundedYear: team.foundedYear,
            isActive: team.isActive
        };
        
        res.status(HTTP_STATUS.OK).json(successResponse(orderedTeam, "Team updated successfully"));
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