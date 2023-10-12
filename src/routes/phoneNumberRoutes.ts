import express, { Request, Response, Router } from "express";
import PhoneNumberController from "../controllers/phoneNumberController";

const router: Router = express.Router();

// Initialize Socket.io (assuming it's already set up in your app)

// Route to generate phone numbers

const phoneNumberRoutes = (io: any) => {
  router.post("/generate", async (req: Request, res: Response) => {
    try {
      const phoneNumbers = await PhoneNumberController.generatePhoneNumbers(
        req,
        res,
        io
      );
      res.json(phoneNumbers);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Route to save users and check WhatsApp registration
  router.post("/save", async (req, res: Response) => {
    try {
      const result = await PhoneNumberController.saveUsers(
        req.body.users,
        res,
        io
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Route to download CSV
  router.post("/download", async (req: Request, res: Response) => {
    try {
      const results = await PhoneNumberController.downloadCSV(req, res);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Route to upload CSV
  router.post("/upload", async (req: Request, res: Response) => {
    try {
      const data = await PhoneNumberController.uploadCSV(req, res, io);
      res.json({ data });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  return router;
};

export default phoneNumberRoutes;
