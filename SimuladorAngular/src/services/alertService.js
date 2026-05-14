// Servicio mock para alertas en memoria
let mockAlerts = [];

export async function insertAlerts(deviceId, alerts) {
  if (alerts.length === 0) return true;
  const newAlerts = alerts.map((a, idx) => ({
    id: `alert-${Date.now()}-${idx}`,
    dispositivo_id: deviceId,
    tipo_alerta: a.tipo_alerta,
    mensaje: a.mensaje,
    severidad: a.severidad,
    valor_detectado: a.valor_detectado,
    leida: false,
    registrado_en: a.registrado_en,
  }));
  mockAlerts.push(...newAlerts);
  return true;
}

export async function getAlerts(deviceId, onlyUnread = false) {
  let filtered = mockAlerts.filter(a => a.dispositivo_id === deviceId);
  if (onlyUnread) {
    filtered = filtered.filter(a => !a.leida);
  }
  return filtered.sort((a, b) => new Date(b.registrado_en) - new Date(a.registrado_en));
}

export async function markAsRead(alertId) {
  const alert = mockAlerts.find(a => a.id === alertId);
  if (alert) {
    alert.leida = true;
  }
  return true;
}

export async function getUnreadCount(deviceId) {
  return mockAlerts.filter(a => a.dispositivo_id === deviceId && !a.leida).length;
}
