import axios from "axios";
import { asyncHandler } from "../utility/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const cookieToken = req.cookies?.token || req.headers.token;
  console.log(cookieToken);

  if (!cookieToken) {
    return res.status(401).json({ error: "Unauthorized - no token" });
  }

  try {
    const { data } = await axios.get(
      `${process.env.USER_URL}/api/v1/users/me`,
      {
        headers: {
          Authorization: `Bearer ${cookieToken}`, // ✅ Use standard Bearer format
        },
      }
    );

    req.user = data.user;
    next();
  } catch (error) {
    console.error(" verifyJWT error:", error.response?.data || error.message);
    return res.status(401).json({ error: "Unauthorized - invalid token" });
  }
});
