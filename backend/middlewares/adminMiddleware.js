export const isAdmin = (req, res, next) => {
  console.log("DEBUG isAdmin - req.user:", req.user);
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied, admin only' });
};