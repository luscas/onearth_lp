import type { NextApiRequest, NextApiResponse } from 'next'

import Contact from '../../../types/Contact'

import * as Yup from 'yup'
const mailer = require('nodemailer');

export default async function handler(req: NextApiRequest, res: NextApiResponse<Contact|any>) {
  const schema = Yup
    .object({
      name: Yup.string().required('Digite seu nome'),
      email: Yup.string().email('Digite um e-mail válido').required('Digite seu email'),
      tel: Yup.string().matches(/(\(\d{2})\) 9 \d{4}-\d{4}$/, 'Número de telefone inválido').required('Digite um número de telefone'),
      message: Yup.string().min(6, 'Envie uma mensagem com no mínimo 6 caracteres'),
    });

  const valid = await schema.isValid(req.body);

  if (!valid) {
    res.status(403).send('');
  }

  const formData : Contact = req.body;

  let transporter = mailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const emailTemplate = `
    <b>Nome</b>: ${formData.name}<br/>
     <b>E-mail</b>: ${formData.email}<br/>
     <b>Número de telefone</b>: ${formData.tel}<br/>
     <b>Mensagem</b>: <br/>
     <p>${formData.message}</p>
  `;

  await transporter.sendMail({
    from: `"Onearth" <${process.env.MAIL_SENDER}>`,
    to: `${process.env.MAIL_SENDER}, rh@onearth.com.br`,
    subject: `Contato de ${formData.name} (${formData.email})`,
    text: formData.message,
    html: emailTemplate
  });

  res.status(200).json({
    status: 'success',
    message: 'E-mail enviado com sucesso!'
  });

}
