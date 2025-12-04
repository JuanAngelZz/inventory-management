import nodemailer from 'nodemailer'
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS
} from '../config'

let transporter: nodemailer.Transporter

const createTransporter = async () => {
  if (transporter) return transporter

  if (!SMTP_USER || !SMTP_PASS) {
    console.log('No SMTP credentials provided, creating Ethereal test account...')
    const testAccount = await nodemailer.createTestAccount()
    
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    })
    
    console.log('Ethereal Email Configured')
    console.log(`User: ${testAccount.user}`)
    console.log(`Pass: ${testAccount.pass}`)
  } else {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    })
  }

  return transporter
}

export const sendEmail = async (to: string, subject: string, html: string) => {
  const emailTransporter = await createTransporter()
  
  const info = await emailTransporter.sendMail({
    from: '"Inventory System" <system@inventory.com>',
    to,
    subject,
    html
  })

  console.log('Message sent: %s', info.messageId)
  
  // Preview only available when sending through an Ethereal account
  if (nodemailer.getTestMessageUrl(info)) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  }
  
  return info
}
