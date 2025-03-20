import { Router } from "express";

import DefaultController from "./default.controller";

const router = Router();

router.get("/", DefaultController.helloWorld);

export default router;
