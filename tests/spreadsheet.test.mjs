// estado: ""
import test from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import { readSpreadsheetRows } from '../src/lib/spreadsheet.ts';

test('CSV conserva comas y saltos de línea entre comillas', async () => {
  const file = new File(['Nombre,Dirección\n"Maresa, Centro","Av. Uno\nLocal 2"'], 'agencias.csv', { type: 'text/csv' });
  assert.deepEqual(await readSpreadsheetRows(file), [{ Nombre: 'Maresa, Centro', Dirección: 'Av. Uno\nLocal 2' }]);
});

test('XLSX se importa después de generar un libro real', async () => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Agencias');
  sheet.addRow(['Nombre', 'Ciudad']);
  sheet.addRow(['Maresa', 'Quito']);
  const bytes = await workbook.xlsx.writeBuffer();
  const file = new File([bytes], 'agencias.xlsx');
  assert.deepEqual(await readSpreadsheetRows(file), [{ Nombre: 'Maresa', Ciudad: 'Quito' }]);
});

test('rechaza más de 400 filas antes de escribir en Firebase', async () => {
  const file = new File([`Nombre\n${'Agencia\n'.repeat(401)}`], 'muchas.csv');
  await assert.rejects(readSpreadsheetRows(file), /400 filas/);
});

test('rechaza formatos no compatibles', async () => {
  const file = new File(['contenido'], 'agencias.xls');
  await assert.rejects(readSpreadsheetRows(file), /\.xlsx o \.csv/);
});
