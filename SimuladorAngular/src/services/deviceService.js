// Servicio mock para operaciones de dispositivos en memoria (usando sessionStorage)

export async function insertDevice(device) {
  const mockDevice = {
    id: 'device-1234',
    nombre: device.nombre,
    marca: device.marca,
    modelo: device.modelo,
    estado: 'conectado',
    email_cuenta: device.email_cuenta,
    permisos_otorgados: device.permisos_otorgados,
    ultima_sincronizacion: new Date().toISOString(),
  };
  sessionStorage.setItem('mockDevice', JSON.stringify(mockDevice));
  return mockDevice;
}

export async function getConnectedDevice() {
  const stored = sessionStorage.getItem('mockDevice');
  return stored ? JSON.parse(stored) : null;
}

export async function updateDeviceStatus(id, estado) {
  let mockDevice = await getConnectedDevice();
  if (mockDevice && mockDevice.id === id) {
    mockDevice.estado = estado;
    sessionStorage.setItem('mockDevice', JSON.stringify(mockDevice));
  }
  return mockDevice;
}

export async function updateLastSync(id) {
  let mockDevice = await getConnectedDevice();
  if (mockDevice && mockDevice.id === id) {
    mockDevice.ultima_sincronizacion = new Date().toISOString();
    sessionStorage.setItem('mockDevice', JSON.stringify(mockDevice));
  }
  return mockDevice;
}

export async function updateDevicePermissions(id, permisos) {
  let mockDevice = await getConnectedDevice();
  if (mockDevice && mockDevice.id === id) {
    mockDevice.permisos_otorgados = permisos;
    sessionStorage.setItem('mockDevice', JSON.stringify(mockDevice));
  }
  return mockDevice;
}

export async function disconnectDevice(id) {
  let mockDevice = await getConnectedDevice();
  if (mockDevice && mockDevice.id === id) {
    sessionStorage.removeItem('mockDevice');
  }
  return true;
}
