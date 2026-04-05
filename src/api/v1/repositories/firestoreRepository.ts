import { db } from "../../../../config/firebaseConfig";

export const createDocument = async <T extends FirebaseFirestore.DocumentData>(
    collectionName: string,
    data: T,
    id?: string
): Promise<string> => {
    try {
        let docRef: FirebaseFirestore.DocumentReference;

        if (id) {
            docRef = db.collection(collectionName).doc(id);
            await docRef.set(data);
        } else {
            docRef = await db.collection(collectionName).add(data);
        }

        return docRef.id;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to create document in ${collectionName}: ${errorMessage}`);
    }
};

export const getDocuments = async (
    collectionName: string
): Promise<FirebaseFirestore.QuerySnapshot> => {
    try {
        return await db.collection(collectionName).get();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to fetch documents from ${collectionName}: ${errorMessage}`);
    }
};

export const getDocumentById = async (
    collectionName: string,
    id: string
): Promise<FirebaseFirestore.DocumentSnapshot | null> => {
    try {
        const doc = await db.collection(collectionName).doc(id).get();
        return doc.exists ? doc : null;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to fetch document ${id} from ${collectionName}: ${errorMessage}`);
    }
};

export const updateDocument = async <T extends FirebaseFirestore.DocumentData>(
    collectionName: string,
    id: string,
    data: Partial<T>
): Promise<void> => {
    try {
        await db.collection(collectionName).doc(id).update(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to update document ${id} in ${collectionName}: ${errorMessage}`);
    }
};

export const deleteDocument = async (
    collectionName: string,
    id: string
): Promise<void> => {
    try {
        await db.collection(collectionName).doc(id).delete();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to delete document ${id} from ${collectionName}: ${errorMessage}`);
    }
};

export const queryDocuments = async (
    collectionName: string,
    field: string,
    operator: FirebaseFirestore.WhereFilterOp,
    value: any
): Promise<FirebaseFirestore.QuerySnapshot> => {
    try {
        return await db.collection(collectionName).where(field, operator, value).get();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to query documents from ${collectionName}: ${errorMessage}`);
    }
};