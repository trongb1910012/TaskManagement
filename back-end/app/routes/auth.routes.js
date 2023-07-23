const auth = require("../controllers/auth.controller");
const middlewares = require("../middlewares");

module.exports = (app) => {
  app.post(
    "/api/auth/signup",
    [middlewares.checkDuplicateUsernameOrEmail],
    auth.signup
  );
  app.post("/api/auth/signin", auth.signin);
  app.put("/api/auth/:id", auth.changeUserRole);
};
