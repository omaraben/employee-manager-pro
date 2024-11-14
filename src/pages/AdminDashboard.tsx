import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import * as XLSX from 'xlsx';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface EntryData {
  id: string;
  name: string;
  serialNumbers: string;
  idNumber: string;
  phoneNumber: string;
  vanShop: string;
  allocationDate: string;
  location: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeEntries, setEmployeeEntries] = useState<EntryData[]>([]);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
    };
    setEmployees([...employees, employee]);
    setNewEmployee({ name: "", email: "", password: "", role: "employee" });
    toast({
      title: "Success",
      description: "Employee added successfully",
    });
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    toast({
      title: "Success",
      description: "Employee deleted successfully",
    });
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(employeeEntries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entries");
    XLSX.writeFile(workbook, "employee-entries.xlsx");
    toast({
      title: "Success",
      description: "Data exported to Excel successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="animate-fade-in glass-card">
            <CardHeader>
              <CardTitle>Add New Employee</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <Input
                  placeholder="Name"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={newEmployee.password}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, password: e.target.value })
                  }
                  required
                />
                <Button type="submit" className="w-full hover-scale">
                  Add Employee
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="animate-fade-in glass-card">
            <CardHeader>
              <CardTitle>Employee List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-gray-500">{employee.email}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
                {employees.length === 0 && (
                  <p className="text-center text-gray-500">No employees yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Employee Entries</CardTitle>
            <Button onClick={handleExportToExcel}>Export to Excel</Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ID Number</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Van/Shop</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.idNumber}</TableCell>
                      <TableCell>{entry.phoneNumber}</TableCell>
                      <TableCell>{entry.vanShop}</TableCell>
                      <TableCell>{entry.location}</TableCell>
                      <TableCell>{new Date(entry.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {employeeEntries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No entries yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;