import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { newsArticles } from '../mock';

export const News = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Latest <span className="text-primary">News</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay updated with our recent activities, achievements, and community impact.
            </p>
          </div>
        </div>
      </section>

      {/* News Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {newsArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden card-hover">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Article Image */}
                  <div className="aspect-video md:aspect-square overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Article Content */}
                  <div className="p-6 flex flex-col justify-center">
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4 w-fit">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      {new Date(article.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-2xl">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                      <p className="text-muted-foreground leading-relaxed">{article.content}</p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Stay Connected
                </h2>
                <p className="text-muted-foreground mb-6">
                  Follow us on social media to get the latest updates about our events, projects, and community initiatives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};