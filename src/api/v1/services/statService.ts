import * as repository from "../repositories/firestoreRepository";
import { StatLine } from "../models/statModel";

const COLLECTION = "stats";

export const getStatsByPlayerId = async (playerId: string): Promise<StatLine[]> => {
    const snapshot = await repository.queryDocuments(COLLECTION, "playerId", "==", playerId);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StatLine));
};

export const getStatById = async (id: string): Promise<StatLine | null> => {
    const doc = await repository.getDocumentById(COLLECTION, id);
    if (!doc) return null;
    return { id: doc.id, ...doc.data() } as StatLine;
};

export const createStat = async (playerId: string, statData: Omit<StatLine, "id" | "playerId">): Promise<StatLine> => {
    const data = { ...statData, playerId };
    const id = await repository.createDocument(COLLECTION, data);
    return { id, ...data } as StatLine;
};

export const updateStat = async (id: string, statData: Partial<Omit<StatLine, "id" | "playerId">>): Promise<StatLine | null> => {
    const existing = await getStatById(id);
    if (!existing) return null;
    
    await repository.updateDocument(COLLECTION, id, statData);
    return getStatById(id);
};

export const deleteStat = async (id: string): Promise<boolean> => {
    const existing = await getStatById(id);
    if (!existing) return false;
    await repository.deleteDocument(COLLECTION, id);
    return true;
};