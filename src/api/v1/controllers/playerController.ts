import { Request, Response, NextFunction } from "express";
import * as playerService from "../services/playerService";
import { successResponse, errorResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const getAllPlayers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const teamId = req.query.teamId as string | undefined;
        const players = await playerService.getAllPlayers(teamId);
        res.status(HTTP_STATUS.OK).json(successResponse(players, "Players retrieved successfully"));
    }
    
    catch (error) {
        next(error);
    }
};

export const getPlayerById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const player = await playerService.getPlayerById(req.params.id);
        if (!player) {
            res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("Player not found", "PLAYER_NOT_FOUND"));
            return;
        }
        res.status(HTTP_STATUS.OK).json(successResponse(player, "Player retrieved successfully"));
    }
    
    catch (error) {
        next(error);
    }
};

export const createPlayer = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const player = await playerService.createPlayer(req.body);
        res.status(HTTP_STATUS.CREATED).json(successResponse(player, "Player created successfully"));
    }
    
    catch (error) {
        next(error);
    }
};

export const updatePlayer = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const player = await playerService.updatePlayer(req.params.id, req.body);
        if (!player) {
            res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("Player not found", "PLAYER_NOT_FOUND"));
            return;
        }
        res.status(HTTP_STATUS.OK).json(successResponse(player, "Player updated successfully"));
    }
    
    catch (error) {
        next(error);
    }
};

export const deletePlayer = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const deleted = await playerService.deletePlayer(req.params.id);
        if (!deleted) {
            res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("Player not found", "PLAYER_NOT_FOUND"));
            return;
        }
        res.status(HTTP_STATUS.OK).json(successResponse(null, "Player deleted successfully"));
    }
    
    catch (error) {
        next(error);
    }
};