var imageInput = document.getElementById("image-input");
var previewImage = document.getElementById("preview-image");
imageInput.addEventListener("change", function(event){
  if(event.target.files.length == 0){
    return;
  }
  var tempUrL = URL.createObjectURL(event.target.files[0]);
  previewImage.setAttribute("src", tempUrL);
});

require("dotenv").config();
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/send-email", upload.single("attachment"), async (req, res) => {
    const { phone, location, message } = req.body;
    const file = req.file;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL,
            subject: `New Contact Form Submission`,
            text: `Phone: ${phone}\nLocation: ${location}\nMessage: ${message}`,
            attachments: file
                ? [{ filename: file.originalname, content: file.buffer }]
                : [],
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Email sent successfully with attachment!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending email" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
