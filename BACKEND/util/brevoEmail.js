const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY;

const transEmailApi = new Sib.TransactionalEmailsApi();

const brevoEmail = async (receiverEmail, uuid) =>  {
    const sender = {
        email: 'prakharpractice@gmail.com',
        name: 'Prakhar'
    }
    
    const receivers = [
        {
            email: receiverEmail
        }
    ]
    
    const Emailmsg = await transEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Reset password link',
        //textContent : `Change your password with the following link`,
        htmlContent: `<p>Change your password with the following link</p>
        <a href="http://localhost:5500/FRONTEND/components/Layout/updatePassword.html?uuid=${uuid}">Reset password link</a>`
    });

    return Emailmsg;
}

module.exports = brevoEmail;