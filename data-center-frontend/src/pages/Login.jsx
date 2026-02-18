import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Radio, LogIn } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Background from '@/components/Background';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = login(email, password);

    if (success) {
      navigate('/');
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Background/>
      <div className="w-full max-w-sm space-y-8">
      <div className="bg-black/15 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-2xl space-y-8">

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Radio className="h-8 w-8 text-primary" />
            <div className="text-left">
              <h1 className="text-lg font-semibold text-foreground tracking-tight">DataCenter</h1>
              <p className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
                Leak Detector
              </p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Welcome back</h2>
          <p className="text-sm text-muted-foreground">Sign in to your monitoring dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="operator@datacenter.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full gap-2">
            <LogIn className="h-4 w-4" /> Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}
