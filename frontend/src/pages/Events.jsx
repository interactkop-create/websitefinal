import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { pastEvents } from '../mock';

export const Events = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Past <span className="text-primary">Events</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our journey through the impactful events and projects we've completed.
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {pastEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden card-hover">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Event Images */}
                  <div className="grid grid-cols-2 gap-2 p-4">
                    {event.images.map((image, index) => (
                      <div key={index} className="aspect-video overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`${event.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Event Details */}
                  <div className="p-6 flex flex-col justify-center">
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4 w-fit">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      {event.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Event Gallery
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Capturing moments of service, friendship, and impact
            </p>
          </div>
          <div className="gallery-grid">
            {pastEvents.flatMap(event => event.images).slice(0, 6).map((image, index) => (
              <div key={index} className="aspect-video overflow-hidden rounded-lg shadow-lg card-hover">
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};