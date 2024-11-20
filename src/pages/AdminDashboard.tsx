import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import EmployeeManagementForm from "@/components/admin/EmployeeManagementForm";
import EmployeeEntriesTable from "@/components/admin/EmployeeEntriesTable";
import { toast } from "@/components/ui/use-toast";
import { Employee, EntryData } from "@/types/types";
import { createUser } from "../lib/api";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeEntries, setEmployeeEntries] = useState<EntryData[]>([]);

  const handleAddEmployee = (newEmployeeData: Omit<Employee, "id">) => {
    const employee = {
      id: Date.now().toString(),
      ...newEmployeeData,
    };
    createUser(employee);
    setEmployees([...employees, employee]);
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        <EmployeeManagementForm
          onAddEmployee={handleAddEmployee}
          onDeleteEmployee={handleDeleteEmployee}
          employees={employees}
        />

        <EmployeeEntriesTable entries={employeeEntries} />
      </div>
    </div>
  );
};

export default AdminDashboard;
