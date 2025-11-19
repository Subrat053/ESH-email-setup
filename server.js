const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const cors = require("cors");

app.use(cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// POST API to send mail
app.post("/send-mail", async (req, res) => {
    const { name, email, company, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, msg: "Required fields missing" });
    }

    try {
        // Setup transporter (Gmail)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,   // your gmail
                pass: process.env.EMAIL_PASS    // app password
            },
        });

        // Email options
        const mailOptions = {
            from: email,
            to: process.env.RECEIVER_EMAIL, // where you want to receive the messages
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${company ?? "Not Provided"}</p>
                <p><strong>Message:</strong> ${message}</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, msg: "Email sent successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Email sending failed" });
    }
});

// Server start
app.listen(5000, () => console.log(`Server running  on port 5000`));
