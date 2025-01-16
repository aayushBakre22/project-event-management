import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false, timestamps: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating JWTs.");
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { username, password, name } = req.body;
    if (!username || !password || !name) {
      throw new ApiError(401, "Missing Details...");
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new ApiError(409, "Username is taken!");
    }
    let avatar;
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (avatarLocalPath) {
      avatar = await uploadOnCloudinary(avatarLocalPath);
      if (!avatar) {
        throw new ApiError(400, "Could not upload avatar on cloudinary");
      }
    } else {
      avatar = {
        url: "https://res.cloudinary.com/dlsnwre9a/image/upload/v1736778700/default-avatar_wvjtkr.jpg",
      };
    }
    const user = await User.create({
      name,
      username,
      password,
      avatar: avatar.url,
    });
    const { refreshToken, accessToken } = await generateTokens(user._id);
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { user: createdUser, accessToken, refreshToken },
          "User registered successfully!"
        )
      );
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ApiError(401, "Missing Credentials...");
    }
    const user = await User.findOne({ username });
    if (!user) {
      throw new ApiError(409, "User doesn't exist!");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Incorrect password");
    }

    const { refreshToken, accessToken } = await generateTokens(user._id);
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const loggedInUser = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
        },
        "Current User found"
      )
    );
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser, currentUser };
