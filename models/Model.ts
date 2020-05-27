import { Collection, ObjectId } from "../dependencies.ts";
import db from "../config/db.ts";

class Model {
  public collection: Collection;

  constructor(colName: string) {
    this.collection = db.collection(colName);
  }

  async findAll() {
    return await this.collection.find();
  }

  async findById(id: string) {
    return await this.collection.findOne({ _id: ObjectId(id) });
  }

  async create(doc: any) {
    const id = await this.collection.insertOne(doc);
    return await this.collection.findOne({ _id: id });
  }

  async update(id: string, doc: any) {
    const { matchedCount } = await this.collection.updateOne(
      { _id: ObjectId(id) },
      { $set: doc },
    );

    if (matchedCount) {
      return this.findById(id);
    }

    return false;
  }
}

export default Model;
