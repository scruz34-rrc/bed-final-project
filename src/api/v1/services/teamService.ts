import * as repository from "../repositories/firestoreRepository";
import { Team } from "../models/teamModel";

const COLLECTION = "teams";

export const getAllTeams = async (): Promise<Team[]> => {
    const snapshot = await repository.getDocuments(COLLECTION);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
};

export const getTeamById = async (id: string): Promise<Team | null> => {
    const doc = await repository.getDocumentById(COLLECTION, id);
    if (!doc) return null;
    return { id: doc.id, ...doc.data() } as Team;
};

export const createTeam = async (teamData: Omit<Team, "id">): Promise<Team> => {
    const id = await repository.createDocument(COLLECTION, teamData);
    return { id, ...teamData } as Team;
};

export const updateTeam = async (id: string, teamData: Partial<Omit<Team, "id">>): Promise<Team | null> => {
    const existing = await getTeamById(id);
    if (!existing) return null;
    
    await repository.updateDocument(COLLECTION, id, teamData);
    return getTeamById(id);
};

export const deleteTeam = async (id: string): Promise<boolean> => {
    const existing = await getTeamById(id);
    if (!existing) return false;
    await repository.deleteDocument(COLLECTION, id);
    return true;
};