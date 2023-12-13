import allRoutes from "./routes.js";
import { static as staticDir } from "express";
const constructorMethod = (app) => {
  app.use("/", allRoutes);
  app.use("/public", staticDir("public"));

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route Not found" });
  });
};

export default constructorMethod;
