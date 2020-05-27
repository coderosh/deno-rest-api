import db from "../config/db.ts";
import Model from "./Model.ts";

class User {
  static userModel: Model = new Model("users");
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public posts: string[],
  ) {}

  async save() {
    return await User.userModel.create(this);
  }
}

export default User;
