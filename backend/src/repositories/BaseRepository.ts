import { db } from '../config/firebase';
import { CollectionReference, DocumentData, Query } from 'firebase-admin/firestore';

export abstract class BaseRepository<T extends DocumentData> {
  protected collection: CollectionReference<T>;

  constructor(collectionName: string) {
    this.collection = db.collection(collectionName) as CollectionReference<T>;
  }

  async create(id: string, data: T): Promise<void> {
    await this.collection.doc(id).set(data);
  }

  async getById(id: string): Promise<T | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? (doc.data() as T) : null;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    await this.collection.doc(id).update(data);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  async list(queryFn?: (ref: CollectionReference<T>) => Query<T>): Promise<T[]> {
    const query = queryFn ? queryFn(this.collection) : this.collection;
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }
}
