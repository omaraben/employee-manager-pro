import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import * as XLSX from 'xlsx';
import { EntryData } from "@/types/types";

interface Props {
  entries: EntryData[];
}

const EmployeeEntriesTable = ({ entries }: Props) => {
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(entries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entries");
    XLSX.writeFile(workbook, "employee-entries.xlsx");
    toast({
      title: "Success",
      description: "Data exported to Excel successfully",
    });
  };

  return (
    <Card className="animate-fade-in glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Employee Entries</CardTitle>
        <Button onClick={handleExportToExcel}>Export to Excel</Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Serial Numbers</TableHead>
                <TableHead>ID Number</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Van/Shop</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell className="max-w-md overflow-hidden text-ellipsis">
                    {entry.serialNumbers}
                  </TableCell>
                  <TableCell>{entry.idNumber}</TableCell>
                  <TableCell>{entry.phoneNumber}</TableCell>
                  <TableCell>{entry.vanShop}</TableCell>
                  <TableCell>{entry.location}</TableCell>
                  <TableCell>{new Date(entry.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No entries yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeEntriesTable;