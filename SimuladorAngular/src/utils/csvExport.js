// Utilidad para exportar datos a CSV usando PapaParse
// Genera un archivo CSV y lo descarga automaticamente en el navegador
import Papa from 'papaparse'

// Exporta un array de objetos a un archivo CSV descargable
// Recibe: data (array) - filas de datos como objetos
// Recibe: filename (string) - nombre del archivo sin extension
export function exportToCSV(data, filename = 'datos_healthsync') {
  if (!data || data.length === 0) return

  const csv = Papa.unparse(data, {
    quotes: true,
    delimiter: ',',
  })

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
