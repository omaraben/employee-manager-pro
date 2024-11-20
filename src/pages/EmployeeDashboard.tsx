import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { createEntry } from "@/lib/api";
import { EntryData } from "@/types/types";

const EmployeeDashboard = () => {
  const { logout, user } = useAuth();
  const [formData, setFormData] = useState<Omit<EntryData, "id" | "created_at">>({
    user_id: user?.id || "",
    name: "",
    serial_numbers: "",
    id_number: "",
    phone_number: "",
    van_shop: "",
    allocation_date: "",
    location: "",
  });
  const [entries, setEntries] = useState<EntryData[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting form data:", formData);
      const result = await createEntry(formData);
      const newEntry: EntryData = {
        ...result,
        created_at: new Date().toISOString()
      };
      
      setEntries([newEntry, ...entries]);
      setFormData({
        user_id: user?.id || "",
        name: "",
        serial_numbers: "",
        id_number: "",
        phone_number: "",
        van_shop: "",
        allocation_date: "",
        location: "",
      });
      
      toast({
        title: "Success",
        description: "Data submitted successfully",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      toast({
        title: "Error",
        description: "Failed to submit data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Employee Dashboard</h1>
            <p className="text-gray-500">Welcome, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        <Card className="animate-fade-in glass-card">
          <CardHeader>
            <CardTitle>Enter Data</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <Textarea
                placeholder="Serial Numbers (one per line)"
                value={formData.serial_numbers}
                onChange={(e) =>
                  setFormData({ ...formData, serial_numbers: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="ID Number"
                  value={formData.id_number}
                  onChange={(e) =>
                    setFormData({ ...formData, id_number: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Phone Number"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Van/Shop"
                  value={formData.van_shop}
                  onChange={(e) =>
                    setFormData({ ...formData, van_shop: e.target.value })
                  }
                  required
                />
                <Input
                  type="date"
                  placeholder="Allocation Date"
                  value={formData.allocation_date}
                  onChange={(e) =>
                    setFormData({ ...formData, allocation_date: e.target.value })
                  }
                  required
                />
              </div>
              <Input
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
              <Button type="submit" className="w-full hover-scale">
                Submit Data
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="animate-fade-in glass-card">
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <p>
                        <span className="font-medium">Name:</span> {entry.name}
                      </p>
                      <p>
                        <span className="font-medium">ID Number:</span>{" "}
                        {entry.id_number}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {entry.phone_number}
                      </p>
                      <p>
                        <span className="font-medium">Location:</span>{" "}
                        {entry.location}
                      </p>
                    </div>
                    <div className="border-t pt-2">
                      <p className="font-medium">Serial Numbers:</p>
                      <pre className="mt-1 whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded">
                        {entry.serial_numbers}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <p className="text-center text-gray-500">No entries yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;