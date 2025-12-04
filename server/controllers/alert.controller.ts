import { Request, Response } from 'express'
import conn from '../db'
import { RowDataPacket } from 'mysql2'
import { sendEmail } from '../services/email.service'
import { format } from '@formkit/tempo'

export const checkAndSendAlerts = async () => {
    // 1. Verificar Stock Bajo (<= 10)
    const [lowStockProducts] = await conn.query<RowDataPacket[]>(
        'SELECT nombre, stock FROM productos WHERE stock <= 10 AND deleted_at IS NULL'
    )

    // 2. Verificar Vencimiento (próximos 30 días)
    const [expiringProducts] = await conn.query<RowDataPacket[]>(
        `SELECT nombre, fecha_vencimiento 
     FROM productos 
     WHERE deleted_at IS NULL 
       AND fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)`
    )

    if (lowStockProducts.length === 0 && expiringProducts.length === 0) {
        console.log('No hay alertas para enviar.')
        return { sent: false, message: 'No hay alertas para enviar' }
    }

    let htmlContent = '<h1>Reporte Diario de Inventario</h1>'

    if (lowStockProducts.length > 0) {
        htmlContent += '<h2>⚠️ Productos con Stock Bajo</h2><ul>'
        lowStockProducts.forEach((p) => {
            htmlContent += `<li><strong>${p.nombre}</strong>: ${p.stock} unidades</li>`
        })
        htmlContent += '</ul>'
    }

    if (expiringProducts.length > 0) {
        htmlContent += '<h2>📅 Productos Próximos a Vencer</h2><ul>'
        expiringProducts.forEach((p) => {
            const fecha = format(new Date(p.fecha_vencimiento), 'YYYY-MM-DD')
            htmlContent += `<li><strong>${p.nombre}</strong>: Vence el ${fecha}</li>`
        })
        htmlContent += '</ul>'
    }

    // Enviar correo
    const recipient = process.env.ALERT_EMAIL || 'admin@inventory.com'

    await sendEmail(recipient, 'Alerta de Inventario', htmlContent)
    return { sent: true, message: 'Alertas enviadas correctamente' }
}

export const triggerAlerts = async (req: Request, res: Response) => {
    try {
        const result = await checkAndSendAlerts()
        return res.json(result)
    } catch (error) {
        console.error('Error triggering alerts:', error)
        return res.status(500).json({ error: 'Error al enviar alertas' })
    }
}
