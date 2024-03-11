/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
initializeApp({
  credential: applicationDefault()
});

const db = getFirestore();
const {setGlobalOptions} = require("firebase-functions/v2");
setGlobalOptions({maxInstances: 10});
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(cors());
const fs = require("fs");
const ejs = require("ejs");
const resolve = require("path").resolve;
const sendMail = require("./lib/utils");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
app.post("/contacto", async (req, res) => {
    logger.info("Hello logs!", {structuredData: true});
    const datosContacto = req.body.datosContacto;
    logger.info("datosContacto!",datosContacto, {structuredData: true});
    const contactoAdd = await db.collection("Contactos").add(datosContacto);
    const file = fs.readFileSync(resolve("templates/mail-mensaje.html"), "utf-8");
    const html= ejs.render(file);
    const options = {
      to: 'ni.catalmir@gmail.com',
      cc: req.body.correosCopia,
      subject: 'Solicitud de Contacto Catalpro',
      html: html,
      textEncoding: "base64",
      headers: [
        {key: "X-Application-Developer", value: "Amit Agarwal"},
        {key: "X-Application-Version", value: "v1.0.0.2"},
      ],
    };
    sendMail(options)
    res.send({message: "Contacto creado correctamente", contactoAdd});
});

exports.app = onRequest(app);