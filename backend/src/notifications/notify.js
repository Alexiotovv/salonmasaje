// Simple notification stub.
// Replace with nodemailer or external provider later.
//src/notifications/notify.js
export function notifyCreate(turno) {
  try {
    // For now, just log a friendly message. In production replace with email/push.
    console.log('NOTIFY: Nuevo turno creado:', JSON.stringify(turno));
  } catch (err) {
    console.error('notifyCreate error', err);
  }
}

export function notifyCancel(turno) {
  try {
    console.log('NOTIFY: Turno cancelado:', JSON.stringify(turno));
  } catch (err) {
    console.error('notifyCancel error', err);
  }
}
