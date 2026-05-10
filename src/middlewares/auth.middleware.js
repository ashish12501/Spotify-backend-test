import jwt from "jsonwebtoken";

async function authArtist(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({
      message: "Unauthorised",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "artist") {
      return res
        .status(403)
        .json({ message: "You don't have access to this service!" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unauthorised" });
  }
}

async function isUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({
      message: "Unauthorised",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "user" && decoded.role !== "artist") {
      return res
        .status(403)
        .json({ message: "You don't have access to this service!" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unauthorised" });
  }
}

export default { authArtist, isUser };
