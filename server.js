const express = require('express');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');
const path = require('path');

app.use(cors());

// Configure your email transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '', // Replace with your email address
        pass: '' // Replace with your email password or app password
    }
});

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle the /send-email endpoint
app.post('/send-email', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Configure email options to send to your email address
    const mailOptions = {
        from: email, // Use the user's email address as the "from" address
        to: '', // Replace with your email address
        subject: `New message from ${name}: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
    };

    // Send email to your email address
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

// Handle the /send-confirmation endpoint
app.post('/send-confirmation', (req, res) => {
    const { email } = req.body;

    // Configure email options to send to the user's email address
    const mailOptions = {
        from: '', // Replace with your email address
        to: email,
        subject: 'Thank you for your feedback',
        text: 'Thank you for your feedback! We will get to it as soon as possible.'
    };

    // Send confirmation email to the user's email address
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending confirmation email:', error);
            res.status(500).send('Error sending confirmation email');
        } else {
            console.log('Confirmation email sent:', info.response);
            res.status(200).send('Confirmation email sent successfully');
        }
    });
});

// Serve the index.html file for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});