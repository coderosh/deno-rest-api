import User from "../models/User.ts";
import { RouterContext, hash, compare } from "../dependencies.ts";
import { createToken } from "../utils/djwt.ts";
import { auth } from "../utils/auth.ts";

export const findAll = async (ctx: RouterContext) => {
  try {
    let users = await User.userModel.findAll();
    users.map((user: any) => {
      delete user.password;
      return user;
    });
    ctx.response.body = { success: true, data: users };
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = { success: false };
  }
};

export const findById = async (ctx: RouterContext) => {
  try {
    const user = await User.userModel.findById(ctx.params.id!);
    if (!user) {
      ctx.response.status = 404;
      ctx.response.body = { success: false, error: "User not found" };
      return;
    }

    delete user.password;

    ctx.response.body = { success: true, data: user };
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = { success: false };
  }
};

export const createUser = async (ctx: RouterContext) => {
  try {
    const body = await ctx.request.body();
    const { name, email, password } = body.value;
    // Check duplicate email
    const userWithEmail = await User.userModel.collection.findOne({ email });
    if (userWithEmail) {
      ctx.response.body = { success: false, error: "User already exists" };
      return;
    }

    const user = new User(name, email, password, []);
    // Hash password
    user.password = await hash(password);
    // Save user to database
    const createdUser = await user.save();
    // Remove password field from createdUser
    delete createdUser.password;
    // Create token
    const token = createToken(createdUser._id["$oid"]);

    ctx.response.status = 201;
    ctx.response.body = { success: true, token, data: createdUser };
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = { success: false };
  }
};

export const updateUser = async (ctx: RouterContext) => {
  try {
    // Get userId from header
    const userId = ctx.request.headers.get("id");
    // Check if userId exists
    const user = await User.userModel.findById(userId!);
    if (!user) {
      ctx.response.status = 404;
      ctx.response.body = { success: false, error: "User not found" };
      return;
    }

    const body = await ctx.request.body();

    // Hash password if exists
    if (body.value.password) {
      body.value.password = await hash(body.value.password);
    }

    // Check duplicate email
    if (body.value.email) {
      const userWithEmail = await User.userModel.collection.findOne({
        email: body.value.email,
      });
      if (userWithEmail) {
        ctx.response.status = 400;
        ctx.response.body = { success: false, error: "User already exists" };
        return;
      }
    }
    // Update User with value
    const updatedUser = await User.userModel.update(userId!, body.value);

    delete updatedUser["password"];

    ctx.response.body = { success: true, data: updatedUser };
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = { success: false };
  }
};

export const login = async (ctx: RouterContext) => {
  try {
    const body = await ctx.request.body();
    const { email, password } = body.value;

    if (!email || !password) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        error: "Please provide valid credentials",
      };
      return;
    }

    const userWithEmail = await User.userModel.collection.findOne({ email });

    if (!userWithEmail) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        error: "Please provide valid credentials",
      };
      return;
    }

    const passwordMatch = await compare(password, userWithEmail.password);

    if (!passwordMatch) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        error: "Please provide valid credentials",
      };
      return;
    }

    delete userWithEmail["password"];

    ctx.response.body = {
      success: true,
      token: createToken(userWithEmail._id["$oid"]),
      data: userWithEmail,
    };
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = { success: false };
  }
};
