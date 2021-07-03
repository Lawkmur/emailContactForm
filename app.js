const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact', {layout:false});
  app.locals.layout = false;
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Subject: ${req.body.subject}</li>
      <li>Email: ${req.body.email}</li>
      <li>Message: ${req.body.message}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
 
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'johndoe@gmail.com',
      pass: 'password' 
    }
  });

  // tls:{
  //   rejectUnauthorized:false
  // }

  
  // Set up de los datos del correo
  let mailOptions = {
    from: '"Fabio Menjívar" <correoelectronico@outlook.com>', // Correo del emisor
    to: 'anotheremail@outlook.com', // Lista de receptores
    subject: 'Whats popping?!', // Asunto del correo
    html: output // cuerpo html.
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });

app.listen(3000, () => console.log('Server started...'));