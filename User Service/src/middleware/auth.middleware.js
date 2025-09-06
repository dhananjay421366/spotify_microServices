import jwt from "jsonwebtoken";
import { asyncHandler } from "../utility/asyncHandler.js";
import { User } from "../models/user.model.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const cookieToken =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
  const sessionUser = req.session?.user;

  if (!cookieToken && !sessionUser) {
    return res.status(401).json({ error: "Unauthorized - no token or session" });
  }

  let decodedToken = null;

  if (cookieToken) {
    try {
      decodedToken = jwt.verify(cookieToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }

  // ✅ Fix here: extract `_id`
  const userId = decodedToken?._id || sessionUser?._id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ error: "User not found or invalid token" });
  }

  req.user = user;
  next();
});
