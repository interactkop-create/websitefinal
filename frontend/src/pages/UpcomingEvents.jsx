import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { eventsAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';

export const UpcomingEvents = () => {
  const { toast } = useToast();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const handleRegister = (eventId, eventTitle) => {
    if (registeredEvents.includes(eventId)) {
      toast({
        title: "Already Registered",
        description: `You're already registered for ${eventTitle}.`,
      });
      return;
    }
    
    setRegisteredEvents([...registeredEvents, eventId]);
    toast({
      title: "Registration Successful!",
      description: `You've successfully registered for ${eventTitle}.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Upcoming <span className="text-primary">Events</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Join us in our upcoming initiatives and be a part of meaningful change in our community.
            </p>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="flex flex-col card-hover">
                <CardHeader>
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3 w-fit">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription className="space-y-2 mt-3">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      {event.venue}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-sm text-muted-foreground mb-6 flex-grow">
                    {event.description}
                  </p>
                  {event.registrationOpen ? (
                    <Button 
                      className="w-full btn-primary"
                      onClick={() => handleRegister(event.id, event.title)}
                      disabled={registeredEvents.includes(event.id)}
                    >
                      {registeredEvents.includes(event.id) ? 'Registered' : 'Register Now'}
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      Registration Closed
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Want to Stay Updated?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Follow us on social media or contact us to receive updates about our upcoming events and initiatives.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};