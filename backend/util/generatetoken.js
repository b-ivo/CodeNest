import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.SECRET,
    { expiresIn: "2d" }
  );
};

export default generateToken;
