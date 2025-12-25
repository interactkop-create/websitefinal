import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { boardAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';
import { ImageUpload } from '../../components/ImageUpload';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

export const AdminBoardMembers = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    image: '',
    order: 0
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await boardAPI.getAll();
      setMembers(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch board members",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await boardAPI.update(editingMember._id, formData);
        toast({ title: "Success", description: "Board member updated successfully" });
      } else {
        await boardAPI.create(formData);
        toast({ title: "Success", description: "Board member added successfully" });
      }
      fetchMembers();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save board member",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this board member?')) return;
    try {
      await boardAPI.delete(id);
      toast({ title: "Success", description: "Board member deleted successfully" });
      fetchMembers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete board member",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      email: member.email,
      image: member.image,
      order: member.order
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      position: '',
      email: '',
      image: '',
      order: 0
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Board Members</h2>
          <p className="text-muted-foreground">Manage your club's board members</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Edit' : 'Add'} Board Member</DialogTitle>
              <DialogDescription>
                {editingMember ? 'Update' : 'Add new'} board member information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Save</Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Card key={member._id}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
                  <p className="text-sm text-primary">{member.position}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => openEditDialog(member)} className="flex-1">
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(member._id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};