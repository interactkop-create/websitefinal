import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Heart, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { eventsAPI, newsAPI, settingsAPI } from '../services/api';

export const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [stats, setStats] = useState({
    active_members: 50,
    total_events: 20,
    lives_impacted: 1000,
    awards_won: 5
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, newsResponse, statsResponse] = await Promise.all([
          eventsAPI.getUpcoming(),
          newsAPI.getAll(),
          settingsAPI.get()
        ]);
        setUpcomingEvents(eventsResponse.data);
        setNewsArticles(newsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Building Leaders,
                <span className="text-primary"> Serving Communities</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Interact Club of Kolhapur is a youth-led service organization dedicated to creating positive change through leadership, service, and international understanding.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/upcoming-events">
                  <Button size="lg" className="btn-primary w-full sm:w-auto">
                    View Upcoming Events
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Learn More About Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.active_members > 0 && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stats.active_members}+</div>
                <div className="text-sm text-muted-foreground">Active Members</div>
              </div>
            )}
            {stats.total_events > 0 && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stats.total_events}+</div>
                <div className="text-sm text-muted-foreground">Events This Year</div>
              </div>
            )}
            {stats.lives_impacted > 0 && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stats.lives_impacted}+</div>
                <div className="text-sm text-muted-foreground">Lives Impacted</div>
              </div>
            )}
            {stats.awards_won > 0 && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stats.awards_won}+</div>
                <div className="text-sm text-muted-foreground">Awards Won</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join us in our upcoming initiatives and be a part of meaningful change
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.slice(0, 3).map((event) => (
              <Card key={event.id} className="card-hover transition-smooth">
                <CardHeader>
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription>{event.venue}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                  <Link to="/upcoming-events">
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Learn More <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/upcoming-events">
              <Button variant="outline" size="lg">
                View All Upcoming Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Latest News
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay updated with our recent activities and achievements
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {newsArticles.slice(0, 3).map((article) => (
              <Card key={article.id} className="overflow-hidden card-hover transition-smooth">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="text-sm text-muted-foreground mb-2">
                    {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{article.excerpt}</p>
                  <Link to="/news">
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/news">
              <Button variant="outline" size="lg">
                View All News
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join Interact Club of Kolhapur and be part of a community dedicated to service, leadership, and positive change.
              </p>
              <Link to="/contact">
                <Button size="lg" variant="secondary" className="hover-lift">
                  Get In Touch
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};