import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Employee } from "@/types/types";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  onAddEmployee: (employee: Omit<Employee, "id">) => void;
  onDeleteEmployee: (id: string) => void;
  employees: Employee[];
}

const EmployeeManagementForm = ({ onAddEmployee, onDeleteEmployee, employees }: Props) => {
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("Creating new employee:", newEmployee);
      
      // Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newEmployee.email,
        password: newEmployee.password,
        email_confirm: true, // Auto-confirms the email
        user_metadata: {
          name: newEmployee.name,
          role: newEmployee.role
        }
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("No user created");
      }

      const createdEmployee = {
        id: authData.user.id,
        email: authData.user.email!,
        name: newEmployee.name,
        role: newEmployee.role
      };

      console.log("Employee created:", createdEmployee);
      onAddEmployee(createdEmployee);
      setNewEmployee({ name: "", email: "", password: "", role: "employee" });
      toast.success(`New ${newEmployee.role} added successfully`);
    } catch (error: any) {
      console.error("Error creating employee:", error);
      toast.error(error.message || "Failed to create employee");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="animate-fade-in glass-card">
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
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
            <Select
              value={newEmployee.role}
              onValueChange={(value) =>
                setNewEmployee({ ...newEmployee, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full hover-scale" disabled={isLoading}>
              {isLoading ? "Adding User..." : "Add User"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="animate-fade-in glass-card">
        <CardHeader>
          <CardTitle>User List</CardTitle>
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
                  <p className="text-xs text-gray-400 capitalize">{employee.role}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteEmployee(employee.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
            {employees.length === 0 && (
              <p className="text-center text-gray-500">No users yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagementForm;