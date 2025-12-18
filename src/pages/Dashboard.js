import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Twitter, LogOut, Sparkles, Clock, BarChart3, Send, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total_posts: 0, successful_posts: 0, failed_posts: 0, scheduled_posts: 0 });
  const [twitterAccount, setTwitterAccount] = useState(null);
  const [contentConfig, setContentConfig] = useState({ topic: '', tone: 'professional', length: 'medium', hashtags: true, emojis: false });
  const [schedule, setSchedule] = useState({ frequency: 'daily', time_of_day: '09:00', timezone: 'UTC', enabled: false });
  const [posts, setPosts] = useState([]);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, twitterRes, contentRes, scheduleRes, postsRes] = await Promise.allSettled([
        axios.get(`${API}/stats`, config),
        axios.get(`${API}/twitter/account`, config),
        axios.get(`${API}/content-config`, config),
        axios.get(`${API}/schedule`, config),
        axios.get(`${API}/posts?limit=10`, config)
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (twitterRes.status === 'fulfilled') setTwitterAccount(twitterRes.value.data);
      if (contentRes.status === 'fulfilled') setContentConfig(contentRes.value.data);
      if (scheduleRes.status === 'fulfilled') setSchedule(scheduleRes.value.data);
      if (postsRes.status === 'fulfilled') setPosts(postsRes.value.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const handleConnectTwitter = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/twitter/auth-url`, config);
      window.location.href = response.data.auth_url;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to initiate Twitter connection');
      setLoading(false);
    }
  };

  const handleDisconnectTwitter = async () => {
    if (!window.confirm('Are you sure you want to disconnect your Twitter account?')) return;

    try {
      await axios.delete(`${API}/twitter/disconnect`, config);
      setTwitterAccount(null);
      toast.success('Twitter account disconnected');
    } catch (error) {
      toast.error('Failed to disconnect Twitter account');
    }
  };

  const handleSaveContentConfig = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/content-config`, contentConfig, config);
      toast.success('Content configuration saved!');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to save content configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedule = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/schedule`, schedule, config);
      toast.success('Schedule saved!');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to save schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutomation = async (enabled) => {
    try {
      await axios.patch(`${API}/schedule/toggle?enabled=${enabled}`, {}, config);
      setSchedule({ ...schedule, enabled });
      toast.success(`Automation ${enabled ? 'enabled' : 'disabled'}!`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to toggle automation');
    }
  };

  const handleGenerateTestPost = async () => {
    if (!twitterAccount) {
      toast.error('Please connect your Twitter account first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/posts/generate`, {}, config);
      toast.success(`Tweet ${response.data.status === 'success' ? 'posted' : 'generated'} successfully!`);
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to generate post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="dashboard">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Twitter className="w-8 h-8 text-brand-600" />
              <span className="text-2xl font-heading font-extrabold gradient-text">TwiLight</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 hidden sm:block">Welcome, {user.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                data-testid="logout-btn"
                className="border-slate-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" data-testid="overview-tab">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="twitter" data-testid="twitter-tab">
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </TabsTrigger>
            <TabsTrigger value="content" data-testid="content-tab">
              <Sparkles className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="schedule" data-testid="schedule-tab">
              <Clock className="w-4 h-4 mr-2" />
              Schedule
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6" data-testid="overview-section">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stats.total_posts}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Successful</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats.successful_posts}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Failed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{stats.failed_posts}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Automation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${schedule.enabled ? 'text-brand-600' : 'text-slate-400'}`}>
                    {schedule.enabled ? 'ON' : 'OFF'}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>Your latest automated tweets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Send className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No posts yet. Configure your settings and start posting!</p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <div key={post.id} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex-shrink-0">
                          {post.status === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900">{post.content}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${post.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {post.status}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(post.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Twitter Tab */}
          <TabsContent value="twitter" className="space-y-6" data-testid="twitter-section">
            <Card>
              <CardHeader>
                <CardTitle>Twitter Account</CardTitle>
                <CardDescription>Connect your Twitter account to start automating</CardDescription>
              </CardHeader>
              <CardContent>
                {twitterAccount ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <img
                        src={twitterAccount.profile_image_url}
                        alt={twitterAccount.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{twitterAccount.name}</p>
                        <p className="text-sm text-slate-600">@{twitterAccount.screen_name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">Connected</span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleDisconnectTwitter}
                      data-testid="disconnect-twitter-btn"
                    >
                      Disconnect Account
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Twitter className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600 mb-4">No Twitter account connected</p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-left">
                          <p className="font-semibold text-yellow-800 mb-2">Setup Required</p>
                          <p className="text-yellow-700 mb-2">To connect Twitter, you need to:</p>
                          <ol className="list-decimal list-inside space-y-1 text-yellow-700">
                            <li>Create a Twitter Developer account at developer.twitter.com</li>
                            <li>Create a new app and enable OAuth 1.0a</li>
                            <li>Set callback URL to: https://x-content-hub-2.preview.emergentagent.com/twitter-callback</li>
                            <li>Add your API keys to the backend .env file</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleConnectTwitter}
                      data-testid="connect-twitter-btn"
                      disabled={loading}
                      className="bg-twitter hover:bg-twitter-dark"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      {loading ? 'Connecting...' : 'Connect Twitter Account'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6" data-testid="content-section">
            <Card>
              <CardHeader>
                <CardTitle>AI Content Configuration</CardTitle>
                <CardDescription>Configure how AI generates your tweets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    data-testid="topic-input"
                    placeholder="e.g., AI, Technology, Marketing"
                    value={contentConfig.topic}
                    onChange={(e) => setContentConfig({ ...contentConfig, topic: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={contentConfig.tone} onValueChange={(value) => setContentConfig({ ...contentConfig, tone: value })}>
                    <SelectTrigger id="tone" data-testid="tone-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length">Length</Label>
                  <Select value={contentConfig.length} onValueChange={(value) => setContentConfig({ ...contentConfig, length: value })}>
                    <SelectTrigger id="length" data-testid="length-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (50-100 chars)</SelectItem>
                      <SelectItem value="medium">Medium (100-200 chars)</SelectItem>
                      <SelectItem value="long">Long (200-280 chars)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="space-y-0.5">
                    <Label htmlFor="hashtags">Include Hashtags</Label>
                    <p className="text-sm text-slate-500">Add relevant hashtags to tweets</p>
                  </div>
                  <Switch
                    id="hashtags"
                    data-testid="hashtags-switch"
                    checked={contentConfig.hashtags}
                    onCheckedChange={(checked) => setContentConfig({ ...contentConfig, hashtags: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="space-y-0.5">
                    <Label htmlFor="emojis">Include Emojis</Label>
                    <p className="text-sm text-slate-500">Add emojis to make tweets engaging</p>
                  </div>
                  <Switch
                    id="emojis"
                    data-testid="emojis-switch"
                    checked={contentConfig.emojis}
                    onCheckedChange={(checked) => setContentConfig({ ...contentConfig, emojis: checked })}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3"> {/* Stacks vertically on mobile */}
                  <Button
                    onClick={handleSaveContentConfig}
                    data-testid="save-content-btn"
                    disabled={loading}
                    className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-base px-6 py-5 sm:py-2.5" // Larger tap area on mobile
                  >
                    {loading ? 'Saving...' : 'Save Configuration'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGenerateTestPost}
                    data-testid="test-post-btn"
                    disabled={loading || !twitterAccount}
                    className="w-full sm:w-auto text-base px-6 py-5 sm:py-2.5 border-slate-300" // Consistent height & padding
                  >
                    <Send className="w-5 h-5 mr-2" /> {/* Slightly larger icon for mobile */}
                    Generate & Post Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6" data-testid="schedule-section">
            <Card>
              <CardHeader>
                <CardTitle>Posting Schedule</CardTitle>
                <CardDescription>Set when your tweets should be posted automatically</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={schedule.frequency} onValueChange={(value) => setSchedule({ ...schedule, frequency: value })}>
                    <SelectTrigger id="frequency" data-testid="frequency-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time of Day (UTC)</Label>
                  <Input
                    id="time"
                    data-testid="time-input"
                    type="time"
                    value={schedule.time_of_day}
                    onChange={(e) => setSchedule({ ...schedule, time_of_day: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="space-y-0.5">
                    <Label htmlFor="automation-toggle" className="text-base font-semibold">
                      Automation {schedule.enabled ? 'Enabled' : 'Disabled'}
                    </Label>
                    <p className="text-sm text-slate-500">
                      {schedule.enabled ? 'Posts will be generated and published automatically' : 'Automation is currently paused'}
                    </p>
                  </div>
                  <Switch
                    id="automation-toggle"
                    data-testid="automation-toggle"
                    checked={schedule.enabled}
                    onCheckedChange={handleToggleAutomation}
                  />
                </div>

                {/* IMPROVED: Save Schedule button - full width on mobile for better UX */}
                <Button
                  onClick={handleSaveSchedule}
                  data-testid="save-schedule-btn"
                  disabled={loading}
                  className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-base px-6 py-5 sm:py-2.5"
                >
                  {loading ? 'Saving...' : 'Save Schedule'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
