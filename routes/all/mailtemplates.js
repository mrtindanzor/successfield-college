function upperCase(string){
  const words = string.split(' ')
    let spiltUpperCase = []
    words.forEach(el => {
    let word = el.charAt(0).toUpperCase()
    word = word + el.slice(1)
    spiltUpperCase.push(word)
    })

    return spiltUpperCase.join(' ')
}
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
       ${name.trim().toUpperCase()} verified his email, on <a href="${process.env.LIVE_BASE_URL}">successfield college</a>
        <br>
        <br>
        His/her email address is, ${email.trim()}.
        <br>
        <br>
        Adios.
      </p>
    `
  }
  
  newCertificateIssued = (admin, name, studentNumber, certificateCode, certificateName) => {
    return `
     <h3>${admin.toUpperCase()},</h3>
        <br>
      <p>
       A new certificate has been is issued to ${upperCase(name)} with student number ${studentNumber.toUpperCase()} for ${upperCase(certificateName)}. The certificate code is ${certificateCode.toUpperCase()}.
        <br>
        Adios.
      </p>
    `
  }

  courseRegistered = (studentName, course ) => {
    const courseName = upperCase(course)
    return `
      <h3>Dear ${upperCase(studentName)},</h3>
        <br>
        <p>
          Congratulations! You have successfully registered for the ${courseName} at Successfield College.
          We are thrilled to welcome you to our community and look forward to supporting you on your academic journey.
          Your registration details are now confirmed, and you can access your program materials on our online learning platform.
          If you have any questions or concerns, please don't hesitate to reach out to us at <a href="mailto:successfieldcollege@gmail.com"> Successfieldcollege@gmail.com </a>.
          <br/>
          Thank you for choosing Successfield College!
          <br>
          <br>
          Best regards,
          <br>
          The Successfield College Team.
      </p>
    `
  }
  
  setAdminStatus = (name, email, status) => {
    let color = 'red'
    if(status === true) color = 'green'
    return `
     <h3>Mr. Admin,</h3>
        <br>
      <p>
       ${name.trim().toUpperCase()} , now has admin status set to <span style="color: ${color};">${status}</span> on <a href="https://gism.online">successfield college</a>
        <br>
        <br>
        His/her email address is, ${email.trim()}.
        <br>
        <br>
        Adios.
      </p>
    `
  }

  deployed(){
    return `
    <h3>Mr. Tindanzor,</h3>
       <br>
     <p>
      Your express app, successfield college has been deployed successfully
       <br>
       <br>
       Adios.
     </p>
   `
  }

  serverError(status, message){
    return `
       <h3>Mr. Tindanzor,</h3>
       <br>
      <p>
        Your express app, successfield college has failed with a status code of ${status}
        <br>
        <br>
        ${message}
        <br>
        <br>
        Adios.
      </p>
    `
  }
}

export default mailTemplates