exports.register = (req, res) => {
  try {
    const { name, email, password } = req.body;

    const payload = {
      status: "success",
      data: {
        uid: 1,
        name,
        email,
      },
    };

    res.status(201).json(payload);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "500 - Internal server error",
    });
  }
};
