import { prisma } from '@/backend/prisma'
import moment from 'moment'
import { nanoid } from 'nanoid'
import mailer from '@/backend/mailer'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email } = req.body

    const token = nanoid(10)

    await prisma.verificationToken.create({
      data: {
        email,
        token,
        expires: moment().add(1, 'day').toDate(),
      },
    })

    try {
      await mailer.send({
        from: 'colby@devdead.ly',
        to: email,
        subject: 'Magic Sign In',
        html: `
        <div>
          Click on the link below to sign in!<br />
          <a href="http://localhost:3000/api/auth/token/${token}/verify">
            http://localhost:3000/api/auth/token/${token}/verify
          </a>
        </div>`,
      })

      console.log(`Magic link sent to ${email}`)

      res.status(200).json({
        toEmail: email,
        success: true,
      })
    } catch (err) {
      console.log(err.response.body)
      res.status(400).send({
        toEmail: email,
        error: err.body,
      })
    }
  }
}

export default handler
