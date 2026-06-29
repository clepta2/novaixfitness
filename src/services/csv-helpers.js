import { Platform } from 'react-native';

export function convertToCSV(data, headers) {
  const rows = [headers.join(',')];
  data.forEach(row => {
    const values = headers.map(h => {
      const val = row[h] ?? '';
      const str = String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"` : str;
    });
    rows.push(values.join(','));
  });
  return rows.join('\n');
}

export async function saveAndShareCSV(csv, filename) {
  if (Platform.OS === 'web') {
    downloadFile(csv, filename, 'text/csv');
    return;
  }
  const FileSystem = require('expo-file-system');
  const Sharing = require('expo-sharing');
  const fileUri = FileSystem.documentDirectory + filename;
  await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: `Exportar ${filename}` });
  }
  return fileUri;
}

export async function saveAndShareJSON(data, filename) {
  const json = JSON.stringify(data, null, 2);
  if (Platform.OS === 'web') {
    downloadFile(json, filename, 'application/json');
    return;
  }
  const FileSystem = require('expo-file-system');
  const Sharing = require('expo-sharing');
  const fileUri = FileSystem.documentDirectory + filename;
  await FileSystem.writeAsStringAsync(fileUri, json, { encoding: FileSystem.EncodingType.UTF8 });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, { mimeType: 'application/json', dialogTitle: `Exportar ${filename}` });
  }
  return fileUri;
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
