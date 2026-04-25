function resetPasswordTemplate(otp) {
  return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f3f8ff;
            margin: 0;
            padding: 0;
          }
  
          .email-container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 3px solid black;
          }
  
          .header {
            background-color: #27D6FD59;
            color: #000000;
            padding: 20px;
            text-align: center;
          }
  
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
  
          .content {
            padding: 30px 20px;
            text-align: center;
          }
          .content p{
            padding: 30px 20px;
            text-align: center;
            font-size: 25px;
          }
  
  
          .otp {
            font-size: 36px;
            color: #333333;
            letter-spacing: 5px;
            font-weight: bold;
            margin: 30px 0;
          }
  
          .copy-button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 25px;
            background-color: #00bcd4;
            color: #ffffff;
            border: none;
            border-radius: 50px;
            font-size: 16px;
            text-decoration: none;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
  
          .copy-button:hover {
            background-color:rgb(242, 255, 0);
          }
  
          .footer {
            padding: 20px;
            background-color: #f1f1f1;
            text-align: center;
            color: #666666;
            font-size: 14px;
          }
  
          .footer p {
            margin: 0;
          }
  
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Reset Password</h1>
          </div>
          <div class="content">
            <p>Your OTP for resetting the password is:</p>
            <div class="otp" id="otp">${otp}</div>
          </div>
          <div class="footer">
            <p>This One-Time Password (OTP) for verification is valid for the next 15 minutes. If you did not request this, simply ignore this message.

</p>
          </div>
        </div>
      
      </body>
      </html>
    `;
}

export default resetPasswordTemplate;
