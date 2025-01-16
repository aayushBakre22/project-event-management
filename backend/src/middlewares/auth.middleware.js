import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(403, "Unauthorized request (Login to continue)");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    // console.log("ACCESS TOKEN USED");
    req.user = user;
    next();
  } catch (error) {
    try {
      const refreshToken = req.header("Authorization")?.replace("Bearer ", "");

      if (!refreshToken) {
        throw new ApiError(403, "Unauthorized request (Login to continue)");
      }
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const user = await User.findById(decodedRefreshToken?._id);
      if (!user) {
        throw new ApiError(401, "NO USER FOUND FOR THIS REFRESH TOKEN");
      }
      if (user.refreshToken !== refreshToken) {
        throw new ApiError(
          401,
          `REFRESH TOKEN DOES NOT MATCH`
        );
      }
      // console.log("REFRESH TOKEN USED");
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
};
