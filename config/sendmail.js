var nodeMailer = require('nodemailer')

module.exports = function(email,activation_link){
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'smartminds.developers@gmail.com',
            pass: 'Sm4rt.M!nds'
        }
    });
    let mailOptions = {
        from: '"SmartMinds Team" <smartminds.developers@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Confirmation d'adresse Email", // Subject line
        text: "", // plain text body
        html: '<p>Bienvenue, Cliquer <a href="'+activation_link+'">ici</a> pour activer votre compte </p>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }