class mailTemplates{
  verifyAccoutTemplate = (link) => {
    return `
      <h3>Verify email address</h3>
      <p> You are receiving this email because you used this address to register at SuccessField College.
        <br>
        If you did not initiate this registration, please feel free to ignore this message.
        <br>
        If you did register, kindly click the link below to verify your email address and complete your registration:
        <br>
        <a href='${link}'>Verify email address</a>
        <br>
        Thank you,
        <br>
        The SuccessField College Team
      </p>
    `
  }
  
  forgotPasswordTemplate = (link) => {
    return `
      <h3>Hello,</h3>
      <p>
        We received a request to reset the password for your SuccessField College account. If you made this request, please click the link below to reset your password:
        <br>
        <a href='${link}'>Verify email address</a>
        <br>
        <br>
        If you did not request a password reset, please ignore this email. Your account will remain secure.
        <br>
        If you have any questions or need further assistance, feel free to contact us at ${process.env.MAILER_USER}.
        <br>
        Thank you,
        <br>
        The SuccessField College Team
      </p>
    `
  }
  
}

export default mailTemplates