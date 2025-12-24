'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from 'sonner';

// Helper to get user-friendly error messages
function getFirebaseAuthError(error: AuthError): string {
    switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password. Please try again.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        default:
            console.error("Firebase auth error:", error);
            return 'An unexpected error occurred. Please try again later.';
    }
}

export default function LoginPage() {
    const { auth, isAdmin, user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth) {
            toast.error("Authentication service is not available.");
            return;
        }

        setFormLoading(true);
        const toastId = toast.loading('Attempting to log in...');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // The FirebaseProvider will handle the redirect on successful login + admin check
            // We just need to wait for the user state to update.
        } catch (error: any) {
            const errorMessage = getFirebaseAuthError(error as AuthError);
            toast.error(errorMessage, { id: toastId });
            setFormLoading(false); // Only stop loading on error
        }
    };

    useEffect(() => {
        // Redirect the user if they are successfully logged in and are an admin.
        if (!authLoading && user && isAdmin) {
            toast.success('Admin login successful! Redirecting...');
            router.push('/dashboard/admin');
        }

        // Handle the case where a non-admin user is logged in.
        // The provider will log them out, so we can show a message.
        if (!authLoading && user && !isAdmin) {
            toast.error("Access Denied. You do not have permission.");
            // The provider handles the sign-out.
        }
    }, [user, isAdmin, authLoading, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Toaster richColors />
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={formLoading || authLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={formLoading || authLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={formLoading || authLoading}>
                            {(formLoading || authLoading) ? 'Logging in...' : 'Log in'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
