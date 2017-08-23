var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var emailer = {

    sendEmailNotification : sendEmailNotification

}

module.exports = emailer;

/*sendEmailNotification()-This below function is to send an dynamic email to the user.
and used handlebar template for templating.
@params-receiver, templateName, content,subject		
*/

function sendEmailNotification(receiver, templateName, content,subject) {
   var authDetail = {
    service: 'Gmail',
    auth: {
        user: 'meanstack007@gmail.com',
        pass: 'ilanji@123'
    }
}
var transporter = nodemailer.createTransport('smtps://meanstack007@gmail.com:ilanji@123@smtp.gmail.com');

var options = {
     viewEngine: {
         extname: '.hbs',
         layoutsDir: './server/emailer',
         defaultLayout : templateName,
         partialsDir : './server/emailer'
     },
     viewPath: './server/emailer',
     extName: '.hbs'
};
 
var mail = {
   from: 'meanstack007@gmail.com',
   to: receiver,
   subject: subject,
   template: templateName,
   context: content

}

transporter.use('compile', hbs(options));
// send mail with defined transport object
transporter.sendMail(mail, function(error, info){
    if(error){
        return console.log(error);
    }
});

}