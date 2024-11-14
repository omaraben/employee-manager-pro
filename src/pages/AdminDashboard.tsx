import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
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
      </div>
    </div>
  );
};

export default AdminDashboard;