'use client';

import { useState, useRef } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast, Toaster } from 'sonner';

// Helper to get user-friendly error messages
function getFirebaseAuthError(error: AuthError): string {
    switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password. Please try again.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'The password is too weak. Please use at least 6 characters.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        default:
            console.error("Firebase auth error:", error);
            return 'An unexpected error occurred. Please try again later.';
    }
}

function DelegateLoginForm() {
    const { auth } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth) {
            toast.error("Authentication service is not available.");
            return;
        }
        setLoading(true);
        const toastId = toast.loading('Attempting to log in...');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Login successful! Redirecting...', { id: toastId });
            
            // Trigger the hidden close button
            if(closeButtonRef.current) {
                closeButtonRef.current.click();
            }

            router.push('/dashboard/delegate');
        } catch (error: any) {
            const errorMessage = getFirebaseAuthError(error as AuthError);
            toast.error(errorMessage, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="login-email" className="text-right">Email</Label>
                    <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" required disabled={loading} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="login-password" className="text-right">Password</Label>
                    <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" required disabled={loading} />
                </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging In...' : 'Log In'}
            </Button>
            <DialogClose asChild>
                <Button ref={closeButtonRef} className="hidden">Close</Button>
            </DialogClose>
        </form>
    );
}

function DelegateRegisterForm() {
  const { auth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement>(null);


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        toast.error("Authentication service is not available.");
        return;
    };
    setLoading(true);
    const toastId = toast.loading('Creating your account...');

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        // We should also create a delegate document in Firestore here, but that's out of scope for the auth fix.
        toast.success('Account created! Redirecting to complete your registration...', { id: toastId });
        
        // Trigger the hidden close button
        if(closeButtonRef.current) {
            closeButtonRef.current.click();
        }

        router.push('/dashboard/delegate/registration');
    } catch (error: any)        {
        const errorMessage = getFirebaseAuthError(error as AuthError);
        toast.error(errorMessage, { id: toastId });
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">First Name</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="col-span-3" required disabled={loading} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">Last Name</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="col-span-3" required disabled={loading} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" required disabled={loading} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" required disabled={loading} />
            </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
        <DialogClose asChild>
            <Button ref={closeButtonRef} className="hidden">Close</Button>
        </DialogClose>
    </form>
  );
}


export function RegisterDialogContent() {
  return (
    <DialogContent className="sm:max-w-[425px]">
        <Toaster richColors />
        <DialogHeader>
            <DialogTitle>Delegate Portal</DialogTitle>
            <DialogDescription>
                Log in to your account or create a new one to register.
            </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <DelegateLoginForm />
            </TabsContent>
            <TabsContent value="register">
                <DelegateRegisterForm />
            </TabsContent>
        </Tabs>
    </DialogContent>
  );
}
