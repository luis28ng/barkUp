import allRoutes from "./routes.js";
import reviewRoutes from "./reviewRoutes.js";
import petRoutes from "./petRoutes.js";
import { static as staticDir } from "express";
const constructorMethod = (app) => {
  app.use("/", allRoutes);
  app.use("/review", reviewRoutes);
  app.use("/pets", petRoutes);
  app.use("/public", staticDir("public"));

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route Not found" });
  });
};

export default constructorMethod;
