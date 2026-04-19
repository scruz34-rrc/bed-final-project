import * as repository from "../repositories/firestoreRepository";
import { Player } from "../models/playerModel";

const COLLECTION = "players";

export const getAllPlayers = async (teamId?: string): Promise<Player[]> => {
    let snapshot;
    if (teamId) {
        snapshot = await repository.queryDocuments(COLLECTION, "teamId", "==", teamId);
    }
    
    else {
        snapshot = await repository.getDocuments(COLLECTION);
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
};

export const getPlayerById = async (id: string): Promise<Player | null> => {
    const doc = await repository.getDocumentById(COLLECTION, id);
    if (!doc) return null;
    return { id: doc.id, ...doc.data() } as Player;
};

export const createPlayer = async (playerData: Partial<Player> & { 
    firstName: string; 
    lastName: string; 
    position: string; 
    teamId: string; 
    debutYear: number; 
}): Promise<Player> => {
    const { id: customId, ...dataWithoutId } = playerData;
    const id = await repository.createDocument(COLLECTION, dataWithoutId, customId);
    return { id, ...dataWithoutId } as Player;
};

export const updatePlayer = async (id: string, playerData: Partial<Omit<Player, "id">>): Promise<Player | null> => {
    const existing = await getPlayerById(id);
    if (!existing) return null;
    
    await repository.updateDocument(COLLECTION, id, playerData);
    return getPlayerById(id);
};

export const deletePlayer = async (id: string): Promise<boolean> => {
    const existing = await getPlayerById(id);
    if (!existing) return false;
    await repository.deleteDocument(COLLECTION, id);
    return true;
};