import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Calendar, Newspaper, Image } from 'lucide-react';
import { settingsAPI } from '../../services/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    active_members: 50,
    total_events: 20,
    lives_impacted: 1000,
    awards_won: 5
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await settingsAPI.get();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Welcome to the admin panel. Manage your website content here.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Board Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_members}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_events}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lives Impacted</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lives_impacted}</div>
            <p className="text-xs text-muted-foreground">People helped</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Awards Won</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.awards_won}</div>
            <p className="text-xs text-muted-foreground">Recognitions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/admin/board-members" className="block p-3 rounded-lg hover:bg-secondary transition-colors">
              <div className="font-medium">Manage Board Members</div>
              <div className="text-sm text-muted-foreground">Add, edit, or remove board members</div>
            </a>
            <a href="/admin/events" className="block p-3 rounded-lg hover:bg-secondary transition-colors">
              <div className="font-medium">Manage Events</div>
              <div className="text-sm text-muted-foreground">Create and manage past and upcoming events</div>
            </a>
            <a href="/admin/news" className="block p-3 rounded-lg hover:bg-secondary transition-colors">
              <div className="font-medium">Publish News</div>
              <div className="text-sm text-muted-foreground">Add news articles and updates</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Website Status</div>
              <div className="font-medium text-green-600">● Live</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Last Updated</div>
              <div className="font-medium">{new Date().toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Database</div>
              <div className="font-medium text-green-600">Connected</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};