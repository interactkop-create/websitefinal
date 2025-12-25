import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { eventsAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Switch } from '../../components/ui/switch';

export const AdminEvents = () => {
  const { toast } = useToast();
  const [pastEvents, setPastEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventType, setEventType] = useState('upcoming');
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    description: '',
    images: [],
    registration_open: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const [pastRes, upcomingRes] = await Promise.all([
        eventsAPI.getPast(),
        eventsAPI.getUpcoming()
      ]);
      setPastEvents(pastRes.data);
      setUpcomingEvents(upcomingRes.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (eventType === 'past') {
        const data = {
          title: formData.title,
          date: formData.date,
          description: formData.description,
          images: formData.images.filter(img => img.trim() !== '')
        };
        
        if (editingEvent) {
          await eventsAPI.updatePast(editingEvent._id, data);
          toast({ title: "Success", description: "Past event updated successfully" });
        } else {
          await eventsAPI.createPast(data);
          toast({ title: "Success", description: "Past event created successfully" });
        }
      } else {
        const data = {
          title: formData.title,
          date: formData.date,
          time: formData.time,
          venue: formData.venue,
          description: formData.description,
          registration_open: formData.registration_open
        };
        
        if (editingEvent) {
          await eventsAPI.updateUpcoming(editingEvent._id, data);
          toast({ title: "Success", description: "Upcoming event updated successfully" });
        } else {
          await eventsAPI.createUpcoming(data);
          toast({ title: "Success", description: "Upcoming event created successfully" });
        }
      }
      fetchEvents();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      if (type === 'past') {
        await eventsAPI.deletePast(id);
      } else {
        await eventsAPI.deleteUpcoming(id);
      }
      toast({ title: "Success", description: "Event deleted successfully" });
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (event, type) => {
    setEditingEvent(event);
    setEventType(type);
    if (type === 'past') {
      setFormData({
        title: event.title,
        date: event.date,
        description: event.description,
        images: event.images || [],
        time: '',
        venue: '',
        registration_open: false
      });
    } else {
      setFormData({
        title: event.title,
        date: event.date,
        time: event.time,
        venue: event.venue,
        description: event.description,
        registration_open: event.registration_open,
        images: []
      });
    }
    setIsDialogOpen(true);
  };

  const openAddDialog = (type) => {
    resetForm();
    setEventType(type);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      date: '',
      time: '',
      venue: '',
      description: '',
      images: [],
      registration_open: true
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground">Events Management</h2>
        <p className="text-muted-foreground">Manage past and upcoming events</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isDialogOpen && eventType === 'upcoming'} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openAddDialog('upcoming')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Upcoming Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? 'Edit' : 'Add'} Upcoming Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="10:00 AM" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="venue">Venue</Label>
                    <Input id="venue" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} required />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="registration" checked={formData.registration_open} onCheckedChange={(checked) => setFormData({ ...formData, registration_open: checked })} />
                    <Label htmlFor="registration">Registration Open</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">Save</Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <Card key={event._id}>
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()} • {event.time} • {event.venue}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${event.registration_open ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {event.registration_open ? 'Registration Open' : 'Registration Closed'}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(event, 'upcoming')}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(event._id, 'upcoming')}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isDialogOpen && eventType === 'past'} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openAddDialog('past')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Past Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? 'Edit' : 'Add'} Past Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} required />
                  </div>
                  <div>
                    <Label>Event Images (URLs)</Label>
                    {formData.images.map((img, index) => (
                      <Input key={index} value={img} onChange={(e) => handleImageChange(index, e.target.value)} placeholder="https://..." className="mt-2" />
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addImageField} className="mt-2">Add Image</Button>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">Save</Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {pastEvents.map((event) => (
              <Card key={event._id}>
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{event.description}</p>
                  <div className="text-xs text-muted-foreground mb-4">{event.images?.length || 0} images</div>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(event, 'past')}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(event._id, 'past')}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};