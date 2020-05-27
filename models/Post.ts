import Model from "./Model.ts";

class Post {
  static postModel: Model = new Model("posts");
  constructor(
    public title: string,
    public body: string,
    public author: string,
    public createdAt: number,
  ) {}

  async save() {
    return await Post.postModel.create(this);
  }
}

export default Post;
