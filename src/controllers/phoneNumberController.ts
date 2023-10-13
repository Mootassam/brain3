import { Request, Response } from "express";

import PhoneNumberGenerator from "../utils/phoneNumberGenerator";
const { Client } = require("whatsapp-web.js");
import { Server } from "socket.io";
import { createObjectCsvStringifier } from "csv-writer";
import fs from "fs";
import multer, { Multer } from "multer";
const qrcode = require("qrcode-terminal");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload: Multer = multer({ storage });
class PhoneNumberController {
  static client: any; // Declare a static variable to store the client instance
  static isConnected: boolean = false; // Track the connection status

  static async generatePhoneNumbers(req: Request, res, io: any) {
    try {
      const phoneNumbers = await PhoneNumberGenerator.generatePhoneNumbers(req);
      res.json(phoneNumbers);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async sendMessage(req, res: Response, io) {
    try {
      console.log(req.body.phoneNumbers);
      console.log(req.body.message);
    } catch (error) {}
  }

  static async saveUsers(usersArray: string[], res: Response, io) {
    try {
      const phoneNumberRegistred: any[] = [];
      const phoneNumberRejected: any[] = [];
      const totalPhoneNumber: any[] = [];
      const promises: Promise<void>[] = [];

      if (!PhoneNumberController.isConnected) {
        // If the client is not connected, create a new instance and set up the event handlers
        const client = new Client();
        PhoneNumberController.client = client;
        client.on("qr", (qr: string, callback: () => void) => {
          io.emit("scan-qrcode", qr);
        });
        client.on("ready", () => {
          PhoneNumberController.isConnected = true; // Update the connection status
          io.emit("client-connect");
          for (const phoneNumber of usersArray) {
            promises.push(
              new Promise<void>(async (resolve, reject) => {
                const isRegistered =
                  await PhoneNumberController.client.isRegisteredUser(
                    phoneNumber
                  );
                if (isRegistered === true) {
                  phoneNumberRegistred.push(phoneNumber);
                } else if (isRegistered === false) {
                  phoneNumberRejected.push(phoneNumber);
                }
                totalPhoneNumber.push(phoneNumber);
                resolve();
              })
            );
          }

          Promise.all(promises).then(() => {
            io.emit("data-updated", {
              phoneNumberRegistred,
              phoneNumberRejected,
              totalPhoneNumber,
            });
          });
        });

        await client.initialize();
      } else {
        // If the client is already connected, skip the QR code generation
        for (const phoneNumber of usersArray) {
          promises.push(
            new Promise<void>(async (resolve, reject) => {
              const isRegistered =
                await PhoneNumberController.client.isRegisteredUser(
                  phoneNumber
                );
              if (isRegistered === true) {
                phoneNumberRegistred.push(phoneNumber);
                console.log(phoneNumber);
              } else if (isRegistered === false) {
                phoneNumberRejected.push(phoneNumber);
              }
              totalPhoneNumber.push(phoneNumber);
              resolve();
            })
          );
        }

        Promise.all(promises).then(() => {
          io.emit("data-updated", {
            phoneNumberRegistred,
            phoneNumberRejected,
            totalPhoneNumber,
          });
        });
      }

      return { phoneNumberRegistred, phoneNumberRejected, totalPhoneNumber };
    } catch (error) {
      console.error("Error initializing client:", error);
      res.status(500).json({ error: "Internal server error" });
      throw error;
    }
  }

  static async downloadCSV(req: Request, res: Response) {
    try {
      const { phoneNumbers } = req.body;

      if (!phoneNumbers || !Array.isArray(phoneNumbers)) {
        return res.status(400).json({ error: "Invalid phone numbers" });
      }
      const csvData = phoneNumbers.map((phoneNumber) => ({ phoneNumber }));
      const csvStringifier = createObjectCsvStringifier({
        header: [{ id: "phoneNumber", title: "phone_Number" }],
      });
      const csvString =
        csvStringifier.getHeaderString() +
        csvStringifier.stringifyRecords(csvData);
      res.attachment("downloaded_numbers.csv");
      res.setHeader("Content-Type", "text/csv");
      res.send(csvString);
    } catch (error) {
      console.error("Error creating or sending CSV file:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async uploadCSV(req, res: Response, io: Server) {
    const promises: Promise<void>[] = [];
    let data: string[] = [];

    try {
      await new Promise<void>((resolve, reject) => {
        upload.single("csvFile")(req, res, async (err: any) => {
          if (err) {
            console.error("Error uploading CSV file:", err);
            return reject(err);
          }
          if (req.file) {
            const csvData = fs.readFileSync(req.file.path, "utf-8");
            const phoneNumbers: string[] = csvData
              .split("\n")
              .slice(1)
              .map((line: string) => line.trim());
            for (const iterator of phoneNumbers) {
              if (iterator.trim() !== "") {
                data.push(iterator);
              }
            }
            fs.unlinkSync(req.file.path);
            resolve();
          } else {
            return reject(new Error("No file uploaded"));
          }
        });
      });

      return data;
    } catch (error) {
      console.error("Error uploading CSV file:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default PhoneNumberController;
