import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

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

const EmployeeDashboard = () => {
  const { logout, user } = useAuth();
  const [formData, setFormData] = useState<Omit<EntryData, "id" | "createdAt">>({
    name: "",
    serialNumbers: "",
    idNumber: "",
    phoneNumber: "",
    vanShop: "",
    allocationDate: "",
    location: "",
  });
  const [entries, setEntries] = useState<EntryData[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setEntries([...entries, newEntry]);
    setFormData({
      name: "",
      serialNumbers: "",
      idNumber: "",
      phoneNumber: "",
      vanShop: "",
      allocationDate: "",
      location: "",
    });
    toast({
      title: "Success",
      description: "Data submitted successfully",
    });
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
                value={formData.serialNumbers}
                onChange={(e) =>
                  setFormData({ ...formData, serialNumbers: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="ID Number"
                  value={formData.idNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, idNumber: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Van/Shop"
                  value={formData.vanShop}
                  onChange={(e) =>
                    setFormData({ ...formData, vanShop: e.target.value })
                  }
                  required
                />
                <Input
                  type="date"
                  placeholder="Allocation Date"
                  value={formData.allocationDate}
                  onChange={(e) =>
                    setFormData({ ...formData, allocationDate: e.target.value })
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
                  <div className="grid grid-cols-2 gap-4">
                    <p>
                      <span className="font-medium">Name:</span> {entry.name}
                    </p>
                    <p>
                      <span className="font-medium">ID Number:</span>{" "}
                      {entry.idNumber}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {entry.phoneNumber}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {entry.location}
                    </p>
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