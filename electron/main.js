// Envuelve el servidor Express en una ventana de escritorio (Electron).
const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

if (!app.requestSingleInstanceLock()) app.quit();

let win;

// La base de datos va en la carpeta de datos del usuario (%APPDATA% en Windows),
// así sobrevive a las actualizaciones y no depende de dónde se instale el programa.
function startServer() {
  const dataDir = path.join(app.getPath('userData'), 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  process.env.INVENTARIO_DB = path.join(dataDir, 'inventario.db');

  const expressApp = require('../src/app'); // se carga después de definir la ruta de la BD
  return new Promise((resolve, reject) => {
    const server = expressApp.listen(0, '127.0.0.1', () => resolve(server.address().port));
    server.on('error', reject);
  });
}

function createWindow(port) {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 760,
    minHeight: 560,
    title: 'Inventario · Mi Tienda',
    autoHideMenuBar: true,
    backgroundColor: '#0e1120',
  });
  win.loadURL(`http://127.0.0.1:${port}`);
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  try {
    createWindow(await startServer());
  } catch (err) {
    dialog.showErrorBox('No se pudo iniciar Inventario', String(err.stack || err));
    app.quit();
  }
});

app.on('window-all-closed', () => app.quit());
