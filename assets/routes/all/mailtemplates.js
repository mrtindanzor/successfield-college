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
        <br>
        <a href='${link}'>Verify email address</a>
        <br>
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
        <br>
        <a href='${link}'>Reset password</a>
        <br>
        <br>
        If you did not request a password reset, please ignore this email. Your account will remain secure.
        <br>
        <br>
        If you have any questions or need further assistance, feel free to contact us at ${process.env.MAILER_USER}.
        <br>
        <br>
        Thank you,
        <br>
        The SuccessField College Team
      </p>
    `
  }
  
  contactForm = (name, email, phone, text ) => {
    return `
     <h3>Hello,</h3>
        <br>
      <p>
       ${text.trim()}
        <br>
        <br>
        You may contact me on this email ${email.trim()}, or phone number ${phone.trim()}.
        <br>
        <br>
        Thank you,
        <br>
        ${name.trim().toUpperCase()}
      </p>
    `
  }
  
  newUser = (name, email ) => {
    return `
     <h3>Mr. Admin,</h3>
        <br>
      <p>
       ${name.trim().toUpperCase()} verified his email, on <a href="https://gism.online">successfield college</a>
        <br>
        <br>
        His/her email address is, ${email.trim()}.
        <br>
        <br>
        Adios.
      </p>
    `
  }
  
  setAdminStatus = (name, email, status) => {
    return `
     <h3>Mr. Admin,</h3>
        <br>
      <p>
       ${name.trim().toUpperCase()} , now has admin status set to <span style="color: green;">${status}</span> on <a href="https://gism.online">successfield college</a>
        <br>
        <br>
        His/her email address is, ${email.trim()}.
        <br>
        <br>
        Adios.
      </p>
    `
  }
}

export default mailTemplates