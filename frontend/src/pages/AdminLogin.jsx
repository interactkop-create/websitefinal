import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mock login - will be replaced with actual authentication
    if (formData.email && formData.password) {
      toast({
        title: "Login Successful",
        description: "Redirecting to admin dashboard...",
      });
      
      // Store mock auth token
      localStorage.setItem('adminToken', 'mock-token');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/30 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="https://customer-assets.emergentagent.com/job_interact-hub-1/artifacts/c0h4q5hl_interact.jpg"
              alt="Interact Club Kolhapur"
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@interactkop.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full btn-primary" size="lg">
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This is currently using mock authentication. Backend integration pending.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};