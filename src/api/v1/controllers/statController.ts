import { Request, Response, NextFunction } from "express";
import * as statService from "../services/statService";
import { successResponse, errorResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const getStatsByPlayer = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const stats = await statService.getStatsByPlayerId(req.params.playerId);
        
        const orderedStats = stats.map(stat => ({
            id: stat.id,
            playerId: stat.playerId,
            season: stat.season,
            teamId: stat.teamId,
            gamesPlayed: stat.gamesPlayed,
            atBats: stat.atBats,
            hits: stat.hits,
            walks: stat.walks,
            homeRuns: stat.homeRuns,
            runsBattedIn: stat.runsBattedIn,
            battingAverage: stat.battingAverage
        }));
        
        res.status(HTTP_STATUS.OK).json(successResponse(orderedStats, "Stats retrieved successfully"));
    }
    
    catch (error) {
        next(error);
    }
};

export const getStatById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const stat = await statService.getStatById(req.params.id);
        if (!stat) {
            res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("Stat line not found", "STAT_NOT_FOUND"));
            return;
        }
        
        const orderedStat = {
            id: stat.id,
            playerId: stat.playerId,
            season: stat.season,
            teamId: stat.teamId,
            gamesPlayed: stat.gamesPlayed,
            atBats: stat.atBats,
            hits: stat.hits,
            walks: stat.walks,
            homeRuns: stat.homeRuns,
            runsBattedIn: stat.runsBattedIn,
            battingAverage: stat.battingAverage
        };
        
        res.status(HTTP_STATUS.OK).json(successResponse(orderedStat, "Stat line retrieved successfully"));
    }
    
    catch (error) {
        next(error);
    }
};

export const createStat = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const stat = await statService.createStat(req.params.playerId, req.body);
        
        const orderedStat = {
            id: stat.id,
            playerId: stat.playerId,
            season: stat.season,
            teamId: stat.teamId,
            gamesPlayed: stat.gamesPlayed,
            atBats: stat.atBats,
            hits: stat.hits,
            walks: stat.walks,
            homeRuns: stat.homeRuns,
            runsBattedIn: stat.runsBattedIn,
            battingAverage: stat.battingAverage
        };
        
        res.status(HTTP_STATUS.CREATED).json(successResponse(orderedStat, "Stat line created successfully"));
    }
    
    catch (error) {
        next(error);
    }
};

export const updateStat = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const stat = await statService.updateStat(req.params.id, req.body);
        if (!stat) {
            res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("Stat line not found", "STAT_NOT_FOUND"));
            return;
        }
        
        const orderedStat = {
            id: stat.id,
            playerId: stat.playerId,
            season: stat.season,
            teamId: stat.teamId,
            gamesPlayed: stat.gamesPlayed,
            atBats: stat.atBats,
            hits: stat.hits,
            walks: stat.walks,
            homeRuns: stat.homeRuns,
            runsBattedIn: stat.runsBattedIn,
            battingAverage: stat.battingAverage
        };
        
        res.status(HTTP_STATUS.OK).json(successResponse(orderedStat, "Stat line updated successfully"));
    }
    
    catch (error) {
        next(error);
    }
};

export const deleteStat = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const deleted = await statService.deleteStat(req.params.id);
        if (!deleted) {
            res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("Stat line not found", "STAT_NOT_FOUND"));
            return;
        }
        res.status(HTTP_STATUS.OK).json(successResponse(null, "Stat line deleted successfully"));
    }
    
    catch (error) {
        next(error);
    }
};