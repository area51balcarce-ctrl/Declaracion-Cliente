import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método no permitido' });
  }

  const { pdfBase64, nombre, dni, seguro, fecha } = req.body;

  if (!pdfBase64) {
    return res.status(400).json({ ok: false, error: 'Falta PDF' });
  }

  try {
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    await resend.emails.send({
      from: 'AREA 51 <no-reply@area51.vercel.app>',
      to: 'area51.balcarce@gmail.com',
      subject: `Declaración de cliente - ${nombre || 'Sin nombre'}`,
      text: `Nueva declaración de cliente.

Nombre: ${nombre || ''}
DNI: ${dni || ''}
Seguro del Hogar: ${seguro || ''}
Fecha: ${fecha || ''}

Se adjunta el PDF con la declaración firmada.`,
      attachments: [
        {
          filename: 'Declaracion_Seguro_AREA51.pdf',
          content: pdfBuffer,
        },
      ],
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}
