const { app, PORT } = require("./index");

app.listen(PORT, (req, res) => {
  console.log(`Server running on port ${PORT}`); // Server is running on port 5000
});
