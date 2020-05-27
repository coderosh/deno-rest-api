import { RouterContext } from "../dependencies.ts";
import Post from "../models/Post.ts";
import User from "../models/User.ts";

export const getAllPosts = async (ctx: RouterContext) => {
  try {
    const posts = await Post.postModel.findAll();
    ctx.response.body = { success: true, data: posts };
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = { success: false };
  }
};

export const getSinglePost = async (ctx: RouterContext) => {
  try {
    const post = await Post.postModel.findById(ctx.params.id!);
    if (!post) {
      ctx.response.status = 404;
      ctx.response.body = { success: false, error: "Post not found" };
      return;
    }

    ctx.response.body = { success: true, data: post };
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = { success: false };
  }
};

export const createPost = async (ctx: RouterContext) => {
  try {
    const reqBody = await ctx.request.body();

    const { title, body } = reqBody.value;
    const createdAt = new Date().getTime();

    const author = ctx.request.headers.get('id')!

    const user = await User.userModel.findById(author);
    if (!user) {
      ctx.response.status = 400;
      ctx.response.body = { success: false, error: "Author not found" };
      return;
    }

    const post = new Post(title, body, author, createdAt);

    const createdPost = await post.save();
    ctx.response.body = { success: true, data: createdPost };
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = { success: false };
  }
};

export const updatePost = async (ctx: RouterContext) => {
  try {
    const post = await Post.postModel.findById(ctx.params.id!);
    if (!post) {
      ctx.response.status = 404;
      ctx.response.body = { success: false, error: "Post not found" };
      return;
    }

    const loggedInUserId = ctx.request.headers.get("id");

    if (loggedInUserId !== post.author) {
      ctx.response.status = 403;
      ctx.response.body = {
        success: false,
        error: "You are not authorized to access this post",
      };
      return;
    }

    const body = await ctx.request.body();

    const updatedPost = await Post.postModel.update(ctx.params.id!, body.value);

    ctx.response.body = { success: true, data: updatedPost };
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = { success: false };
  }
};

export const deletePost = async (ctx: RouterContext) => {
  try {
    const post = await Post.postModel.findById(ctx.params.id!);
    if (!post) {
      ctx.response.status = 404;
      ctx.response.body = { success: false, error: "Post not found" };
      return;
    }

    const loggedInUserId = ctx.request.headers.get("id");

    if (loggedInUserId !== post.author) {
      ctx.response.status = 403;
      ctx.response.body = {
        success: false,
        error: "You are not authorized to access this post",
      };
      return;
    }

    await Post.postModel.delete(ctx.params.id!);

    ctx.response.body = { success: true, data: post };
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = { success: false };
  }
};
