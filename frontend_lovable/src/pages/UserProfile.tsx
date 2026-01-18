import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CredibilityScore } from '@/components/CredibilityScore';
import { usersAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Award,
  CheckCircle,
  BarChart3,
  Calendar,
  TrendingUp,
  Loader2,
  Shield,
  User,
  LogOut
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { VoteImpactIndicator } from '@/components/VoteImpactIndicator';

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await usersAPI.getProfile();
        setUser(profileRes.data);

        if (profileRes.data.id) {
          try {
            const credRes = await usersAPI.getCredibilityProfile(profileRes.data.id);
            setStats(credRes.data);
          } catch (e) {
            console.error("Failed to fetch credibility stats", e);
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
        toast.error('Could not load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="text-muted-foreground">User not found. Please log in.</div>
        <Link to="/login"><Button>Sign In</Button></Link>
      </div>
    );
  }

  let categoryCredibility = {};
  try {
    if (typeof user.category_credibility === 'string') {
      categoryCredibility = JSON.parse(user.category_credibility);
    } else {
      categoryCredibility = user.category_credibility || {};
    }
  } catch (e) {
    console.error("Error parsing category credibility", e);
  }

  const reportsSubmitted = stats?.activity?.total_reports || 0;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Feed
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1 rounded-md">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold font-serif">My Profile</h1>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">

        {/* Profile Header */}
        <Card className="mb-8 border-none shadow-lg bg-gradient-to-br from-card to-secondary/30">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-serif text-primary border-4 border-background shadow-sm">
                    {user.username.substring(0, 1).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-sm">
                    <CredibilityScore score={user.credibility_score} size="md" showLabel={false} />
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-2">
                <h1 className="text-3xl font-bold font-serif tracking-tight">{user.username}</h1>
                <p className="text-muted-foreground">{user.email}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm pt-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Joined {format(new Date(user.created_at), 'MMMM yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                    <Shield className="h-3.5 w-3.5" />
                    <span>{user.role === 'admin' ? 'Administrator' : 'Community Member'}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Stats Area */}
          <div className="lg:col-span-2 space-y-6">

            {/* Category Credibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-serif">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Domain Expertise
                </CardTitle>
                <CardDescription>
                  Your automated credibility rating by topic area.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(categoryCredibility).length > 0 ? (
                  Object.entries(categoryCredibility).map(([category, score]: [string, any]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium capitalize flex items-center gap-2">
                          {category}
                          {score > 80 && <Award className="h-3 w-3 text-amber-500" />}
                        </span>
                        <span className="font-mono text-muted-foreground">{score}%</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No expertise data accumulated yet. Participate in more verifications!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm text-center py-4">Activity feed coming soon...</p>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground border-none shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <CardContent className="pt-8 text-center relative z-10">
                <p className="text-sm font-medium text-primary-foreground/80 uppercase tracking-widest mb-2">Trust Score</p>
                <div className="text-6xl font-bold font-serif mb-2">{Math.round(user.credibility_score)}</div>
                <p className="text-xs text-primary-foreground/60">Top 15% of Contributors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shadow-sm">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Votes Cast</span>
                  </div>
                  <span className="text-xl font-bold font-serif">{stats?.activity?.total_ratings || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shadow-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium">Reports</span>
                  </div>
                  <span className="text-xl font-bold font-serif">{reportsSubmitted}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
