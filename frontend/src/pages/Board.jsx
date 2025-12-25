import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { boardAPI } from '../services/api';

export const Board = () => {
  const [boardMembers, setBoardMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoardMembers = async () => {
      try {
        const response = await boardAPI.getAll();
        setBoardMembers(response.data);
      } catch (error) {
        console.error('Error fetching board members:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoardMembers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Board of <span className="text-primary">Directors</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Meet the dedicated leaders driving our mission forward and inspiring change in our community.
            </p>
          </div>
        </div>
      </section>

      {/* Board Members Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boardMembers.map((member) => (
              <Card key={member.id} className="card-hover overflow-hidden">
                <div className="aspect-square overflow-hidden bg-secondary/30">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <div className="text-sm font-medium text-primary">{member.position}</div>
                </CardHeader>
                <CardContent>
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="break-all">{member.email}</span>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Message */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-center">
                  Leadership Commitment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Our Board of Directors represents the heart and soul of Interact Club of Kolhapur. Each member brings unique talents, perspectives, and dedication to our shared mission of service and leadership development.
                </p>
                <p>
                  Together, we work tirelessly to create meaningful opportunities for our members, strengthen community partnerships, and expand our impact across Kolhapur and beyond.
                </p>
                <p>
                  We are committed to transparency, ethical leadership, and fostering an inclusive environment where every member can thrive and contribute to positive change.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};