// estado: ""

const MAX_IMPORT_BYTES = 2 * 1024 * 1024;
const MAX_IMPORT_ROWS = 400;
const MAX_IMPORT_COLUMNS = 40;

function cellText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object' && 'text' in value && typeof value.text === 'string') return value.text;
  if (typeof value === 'object' && 'result' in value) return cellText(value.result);
  return '';
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(cell); cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some(value => value.trim())) rows.push(row);
      row = [];
      if (rows.length > MAX_IMPORT_ROWS + 1) throw new Error('El archivo supera el límite de 400 filas.');
    } else {
      cell += char;
    }
  }
  if (quoted) throw new Error('El CSV tiene comillas sin cerrar.');
  row.push(cell);
  if (row.some(value => value.trim())) rows.push(row);
  return rows;
}

export async function readSpreadsheetRows(file: File): Promise<Record<string, string>[]> {
  if (file.size > MAX_IMPORT_BYTES) throw new Error('El archivo debe pesar máximo 2 MB.');
  const extension = file.name.split('.').pop()?.toLowerCase();
  let rows: string[][];
  if (extension === 'csv') {
    rows = parseCsv((await file.text()).replace(/^\uFEFF/, ''));
  } else if (extension === 'xlsx') {
    const { default: ExcelJS } = await import('exceljs');
    const workbook = new ExcelJS.Workbook();
    const bytes = new Uint8Array(await file.arrayBuffer());
    await workbook.xlsx.load(bytes as Buffer);
    const sheet = workbook.worksheets[0];
    if (!sheet) throw new Error('El libro no contiene hojas.');
    if (sheet.rowCount > MAX_IMPORT_ROWS + 1 || sheet.columnCount > MAX_IMPORT_COLUMNS) {
      throw new Error('El archivo supera el límite de 400 filas o 40 columnas.');
    }
    rows = [];
    sheet.eachRow({ includeEmpty: false }, row => {
      const cells: string[] = [];
      for (let index = 1; index <= Math.min(sheet.columnCount, MAX_IMPORT_COLUMNS); index++) {
        cells.push(cellText(row.getCell(index).value));
      }
      rows.push(cells);
    });
  } else {
    throw new Error('Usa un archivo .xlsx o .csv.');
  }
  if (rows.length < 2) throw new Error('El archivo necesita una fila de encabezados y datos.');
  if (rows.length > MAX_IMPORT_ROWS + 1 || rows[0].length > MAX_IMPORT_COLUMNS) {
    throw new Error('El archivo supera el límite de 400 filas o 40 columnas.');
  }
  const headers = rows[0].map(value => value.trim());
  return rows.slice(1).map(values => Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() || ''])));
}

function safeExcelValue(value: unknown): string | number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const text = cellText(value);
  return /^[\s]*[=+@\-\t\r]/.test(text) ? `'${text}` : text;
}

export async function downloadSpreadsheet(rows: Record<string, unknown>[], sheetName: string, filename: string): Promise<void> {
  if (rows.length === 0) return;
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);
  const headers = Object.keys(rows[0]);
  sheet.addRow(headers);
  for (const row of rows) sheet.addRow(headers.map(header => safeExcelValue(row[header])));
  const bytes = new Uint8Array(await workbook.xlsx.writeBuffer());
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
