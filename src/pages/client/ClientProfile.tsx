
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";

const ClientProfile = () => {
  const userString = localStorage.getItem("fixfinder_user");
  const user = userString ? JSON.parse(userString) : null;
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    addresses: user?.addresses || []
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddressChange = (index: number, field: string, value: string) => {
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      addresses: updatedAddresses
    }));
  };
  
  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      addresses: user?.addresses || []
    });
    setIsEditing(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update localStorage
    localStorage.setItem("fixfinder_user", JSON.stringify({
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      addresses: formData.addresses
    }));
    
    setIsEditing(false);
  };
  
  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [
        ...prev.addresses, 
        { type: "Other", street: "", city: "", state: "TX", zip: "" }
      ]
    }));
  };

  return (
    <ClientDashboardLayout title="Basic Information">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          {!isEditing && (
            <Button variant="ghost" onClick={() => setIsEditing(true)} className="flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6 flex items-start">
                {!isEditing ? (
                  <div className="mr-4">
                    <div className="w-20 h-20 bg-orange-100 rounded-full overflow-hidden">
                      <img 
                        src="https://randomuser.me/api/portraits/women/68.jpg" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mr-4">
                    <div className="w-20 h-20 bg-orange-100 rounded-full overflow-hidden relative">
                      <img 
                        src="https://randomuser.me/api/portraits/women/68.jpg" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <span className="text-white text-xs">Change</span>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md w-full"
                      />
                    ) : (
                      <p>{formData.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md w-full"
                      />
                    ) : (
                      <p>{formData.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  />
                ) : (
                  <p>{formData.email}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Addresses */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Addresses</h3>
              {isEditing && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addAddress} 
                  className="text-xs px-2 py-1 h-auto"
                >
                  + Add Address
                </Button>
              )}
            </div>
            
            {formData.addresses.map((address: any, index: number) => (
              <div key={index} className="border rounded-md p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700 mr-2">
                      Type:
                    </label>
                    {isEditing ? (
                      <select
                        value={address.type}
                        onChange={(e) => handleAddressChange(index, 'type', e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <span className="inline-block bg-gray-100 px-2 py-1 rounded text-sm">{address.type}</span>
                    )}
                  </div>
                  {isEditing && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="text-gray-500 h-6 w-6 p-0"
                      onClick={() => {
                        const updatedAddresses = formData.addresses.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, addresses: updatedAddresses }));
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
                  <div className="col-span-full md:col-span-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                        placeholder="Street Address"
                        className="px-3 py-2 border border-gray-300 rounded-md w-full"
                      />
                    ) : (
                      <p>{address.street}</p>
                    )}
                  </div>
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                        placeholder="City"
                        className="px-3 py-2 border border-gray-300 rounded-md w-full"
                      />
                    ) : (
                      <p>{address.city}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={address.state}
                          onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                          placeholder="State"
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                      ) : (
                        <p>{address.state}</p>
                      )}
                    </div>
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={address.zip}
                          onChange={(e) => handleAddressChange(index, 'zip', e.target.value)}
                          placeholder="ZIP"
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                      ) : (
                        <p>{address.zip}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {isEditing && (
            <div className="flex justify-end space-x-3 mt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </div>
    </ClientDashboardLayout>
  );
};

export default ClientProfile;
