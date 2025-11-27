import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export interface QuoteEmailData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    modelLink?: string;
    fileName?: string;
    material: string;
    color: string;
    weight: number;
    price: number;
    timestamp: string;
}

export async function sendQuoteEmail(data: QuoteEmailData): Promise<boolean> {
    try {
        const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
            .label { font-weight: bold; color: #6b7280; }
            .value { color: #111827; }
            .price { font-size: 32px; font-weight: bold; color: #2563EB; text-align: center; margin: 20px 0; }
            .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎯 Novo Orçamento Solicitado</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Forge3D - Impressão 3D Sob Demanda</p>
            </div>
            <div class="content">
              <h2 style="color: #111827; margin-top: 0;">Dados do Cliente</h2>
              <div class="detail-row">
                <span class="label">Nome:</span>
                <span class="value">${data.customerName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">${data.customerEmail}</span>
              </div>
              <div class="detail-row">
                <span class="label">Telefone:</span>
                <span class="value">${data.customerPhone}</span>
              </div>

              <h2 style="color: #111827; margin-top: 30px;">Detalhes do Pedido</h2>
              ${data.modelLink ? `
                <div class="detail-row">
                  <span class="label">Link do Modelo:</span>
                  <span class="value"><a href="${data.modelLink}" style="color: #2563EB;">${data.modelLink}</a></span>
                </div>
              ` : ''}
              ${data.fileName ? `
                <div class="detail-row">
                  <span class="label">Arquivo:</span>
                  <span class="value">${data.fileName}</span>
                </div>
              ` : ''}
              <div class="detail-row">
                <span class="label">Material:</span>
                <span class="value">${data.material}</span>
              </div>
              <div class="detail-row">
                <span class="label">Cor:</span>
                <span class="value">${data.color}</span>
              </div>
              <div class="detail-row">
                <span class="label">Peso Estimado:</span>
                <span class="value">${data.weight}g</span>
              </div>

              <div class="price">R$ ${data.price.toFixed(2)}</div>

              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 20px; border-radius: 5px;">
                <strong>⏱️ Observação:</strong> Entrega a combinar
              </div>

              <div class="footer">
                <p>Solicitação recebida em: ${data.timestamp}</p>
                <p>Este é um email automático do sistema Forge3D</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

        await resend.emails.send({
            from: 'Forge3D <onboarding@resend.dev>', // Trocar depois
            to: ['deivismedeiros8@gmail.com'],
            subject: `Novo Orçamento Solicitado — Forge3D`,
            html: emailHtml,
        });

        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}
