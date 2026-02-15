import XLSX from "xlsx";

export interface UserData {
  name: string;
  emailid: string;
}

export const readExcelFile = (data: string | Buffer): UserData[] => {
  // Read workbook
  const workbook = typeof data === 'string' ? XLSX.readFile(data) : XLSX.read(data, { type: 'buffer' });

  // Get first sheet
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName as string];

  // Convert to JSON
  const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(sheet as any);

  // Clean + Map required fields
  const result: UserData[] = rawData
    .filter(row => row.name && row.emailid)
    .map(row => ({
      name: String(row.name).trim(),
      emailid: String(row.emailid).trim(),
    }));

  return result;
};

// console.log(readExcelFile("./sample_user.xlsx"));
