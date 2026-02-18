'use client';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loading from './Loading';

const Auth = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, isLoading: authLoading, loginMutation } = useAuth();

    const [signinIdentifier, setSigninIdentifier] = useState('');
    const [signinPassword, setSigninPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!authLoading && isAuthenticated && user) {
            const userPrimaryRole = user.role ? user.role.toLowerCase() : 'customer';
            navigate(`/${userPrimaryRole}/dashboard`, { replace: true });
        }
    }, [isAuthenticated, user, authLoading, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        const trimmedIdentifier = signinIdentifier.trim();

        if (!trimmedIdentifier) {
            toast.error('Please enter email');
            return;
        }
        if (!signinPassword) {
            toast.error('Please enter password');
            return;
        }

        const payload = {
            email: trimmedIdentifier,
            password: signinPassword,
        };

        const toastId = toast.loading('Signing in...');
        try {
            const result = await loginMutation.mutateAsync(payload);

            toast.success('Login successful!', {
                id: toastId,
                description: `Welcome back, ${result.data.user.firstName || 'User'}!`,
            });
        } catch (error) {
            const errorMessage =
                error?.data?.message ||
                error?.message ||
                'Login failed. Please check your credentials.';

            setLoginError(errorMessage);
            toast.error('Login Failed', {
                id: toastId,
                description: errorMessage,
                duration: 5000,
            });
        }
    };

    if (authLoading || isAuthenticated) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen flex">
            {/* Left - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">

                <div className="w-full max-w-md space-y-8">
                    {/* Logo / Brand */}
                    <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            GroceryStore
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Manage smarter. Sell faster.
                        </p>
                    </div>

                    <div className="text-center">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Enter your credentials to access your dashboard
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="hello@yourstore.com"
                                    className="pl-10"
                                    value={signinIdentifier}
                                    onChange={(e) => setSigninIdentifier(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10"
                                    value={signinPassword}
                                    onChange={(e) => setSigninPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="remember" className="text-muted-foreground">
                                    Remember me
                                </Label>
                            </div>
                            <a href="#" className="text-primary hover:text-primary/90 font-medium">
                                Forgot password?
                            </a>
                        </div>

                        {loginError && (
                            <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-950/30 p-3 rounded-md">
                                {loginError}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/90 text-white h-11"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? (
                                <>Signing in...</>
                            ) : (
                                <>
                                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Social login */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white dark:bg-slate-950 px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-11">
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5 mr-2" />
                            Google
                        </Button>
                        <Button variant="outline" className="h-11">
                            <img src="https://www.apple.com/favicon.ico" alt="Apple" className="h-5 w-5 mr-2" />
                            Apple
                        </Button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-8">
                        Don't have an account?{' '}
                        <a href="/register" className="text-primary hover:text-primary/90 font-medium">
                            Register now
                        </a>
                    </p>
                </div>
            </div>

            {/* Right - Dashboard Preview / Marketing */}
            <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary/80 via-primary/70 to-primary/90 relative overflow-hidden">
                {/* Optional subtle background pattern / noise */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.12)_0%,transparent_50%)]" />
                </div>

                <div className="relative h-full flex items-center justify-center px-8 xl:px-16 py-12 text-white">
                    <div className="w-full max-w-2xl space-y-10">
                        {/* Headline + subheadline */}
                        <div className="space-y-5">
                            <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-extrabold leading-tight tracking-tight">
                                Run your grocery business
                                <br />
                                <span className="bg-gradient-to-r from-white via-gray/40 to-white bg-clip-text text-transparent">
                                    smarter — not harder
                                </span>
                            </h1>

                            <p className="text-xl opacity-90 leading-relaxed max-w-xl">
                                Real-time sales, inventory, staff scheduling and supplier orders — all in one modern dashboard.
                            </p>
                        </div>

                        {/* Mini dashboard preview */}
                        <div className="mt-8 bg-card backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl overflow-hidden">
                            <div className="h-10 bg-black/30 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                <div className="ml-4 text-xs opacity-70">GroceryStore • Today’s Overview</div>
                            </div>

                            <div className="p-6 pb-8">
                                <div className="flex items-baseline justify-between mb-6">
                                    <div>
                                        <p className="text-sm text-primary">Revenue Today</p>
                                        <p className="text-3xl font-bold text-primary">PKR 184,920</p>
                                    </div>
                                    {/* <div className="text-green-400 font-medium">+18.4%</div> */}
                                </div>

                                <div className="relative h-40 mb-6">
                                    <div className="absolute inset-0 flex items-end gap-1.5 px-1">
                                        {[35, 42, 38, 55, 68, 72, 65, 82, 95, 88, 76, 92,
                                            105, 118, 112, 135, 148, 155, 142, 168, 185, 172, 198, 215].map((height, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 bg-gradient-to-t from-primary/60 to-primary/30 rounded-t-sm transition-all"
                                                    style={{ height: `${height * 0.7}%` }}
                                                />
                                            ))}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent pointer-events-none" />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm opacity-80">
                                        <span className='text-primary'>Latest orders • showing 3 of 47</span>
                                        <span className="text-primary/70 hover:text-primary/50 cursor-pointer">View all →</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-sm opacity-75 ">
                            Trusted by 4,200+ grocery stores, mini-marts & supermarkets across Pakistan
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
