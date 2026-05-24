export const sendTokenResponse = (user, statusCode, res) => {
  const token = user.signToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      status: user.status
    }
  });
};

