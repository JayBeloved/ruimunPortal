'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase/provider';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

function FormLoading() {
    return (
        <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-10" /></div>
                <div className="grid gap-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-10" /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-10" /></div>
                <div className="grid gap-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-10" /></div>
            </div>
             <div className="grid gap-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-20" /></div>
            <Skeleton className="h-12 w-full" />
        </div>
    )
}

export function DelegateRegistrationForm() {
  const { user, loading: authLoading } = useAuth();
  const db = useFirestore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    delegate_type: '',
    gender: '',
    mun_experience: '',
    affiliation: '',
    position: '',
    department: '',
    matric_num: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    advert: '',
    tshirt_size: '',
    medical: '',
    diet: '',
    referral: '',
    committee1: '',
    country1: '',
    committee2: '',
    country2: '',
    committee3: '',
    country3: '',
    code: '',
    token: '',
    status: 'pending',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;
    if (!user || !db) {
        router.push('/');
        return;
    }

    setFormData(prev => ({ ...prev, email: user.email || '', name: user.displayName || '' }));
    const docRef = doc(db, "registrations", user.uid);
    getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
            setFormData(prev => ({...prev, ...docSnap.data()}));
        }
    }).finally(() => {
        setLoading(false);
    });

  }, [user, authLoading, db, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
        setError("You must be logged in to register.");
        return;
    }

    try {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/register_delegate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "An unknown error occurred.");
        }
        
        toast({
            title: "Registration Submitted!",
            description: "Your registration has been submitted successfully.",
        });

        router.push("/dashboard/delegate");

    } catch (error: any) {
        setError(error.message);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: error.message,
        });
    }
  };

  if (loading || authLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Delegate Registration Form</CardTitle>
                 <CardDescription>Please fill out the form below to register for the conference.</CardDescription>
            </CardHeader>
            <CardContent>
                <FormLoading />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delegate Registration Form</CardTitle>
        <CardDescription>Please fill out the form below to register for the conference.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} required disabled />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => handleSelectChange('gender', value)} value={formData.gender}>
                <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="delegate_type">Delegate Type</Label>
                <Select onValueChange={(value) => handleSelectChange('delegate_type', value)} value={formData.delegate_type}>
                    <SelectTrigger><SelectValue placeholder="Select Delegate Type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="observer">Observer</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="mun_experience">MUN Experience</Label>
                <Textarea id="mun_experience" placeholder="e.g., 3 conferences as delegate, 1 as chair..." value={formData.mun_experience} onChange={handleChange} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="affiliation">Affiliation (University/Organization)</Label>
              <Input id="affiliation" value={formData.affiliation} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Position (e.g., Student, Analyst)</Label>
              <Input id="position" value={formData.position} onChange={handleChange} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={formData.department} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="matric_num">Matriculation Number (if applicable)</Label>
                  <Input id="matric_num" value={formData.matric_num} onChange={handleChange} />
              </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={formData.city} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State/Province</Label>
              <Input id="state" value={formData.state} onChange={handleChange} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={formData.country} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zipcode">Zip/Postal Code</Label>
              <Input id="zipcode" value={formData.zipcode} onChange={handleChange} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="advert">How did you hear about us?</Label>
            <Textarea id="advert" value={formData.advert} onChange={handleChange} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="tshirt_size">T-Shirt Size</Label>
              <Select onValueChange={(value) => handleSelectChange('tshirt_size', value)} value={formData.tshirt_size}>
                  <SelectTrigger><SelectValue placeholder="Select T-Shirt Size" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="xs">XS</SelectItem>
                      <SelectItem value="s">S</SelectItem>
                      <SelectItem value="m">M</SelectItem>
                      <SelectItem value="l">L</SelectItem>
                      <SelectItem value="xl">XL</SelectItem>
                      <SelectItem value="xxl">XXL</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="diet">Dietary Restrictions</Label>
              <Textarea id="diet" value={formData.diet} onChange={handleChange} />
            </div>
          </div>

            <div className="grid gap-2">
                <Label htmlFor="medical">Medical Conditions</Label>
                <Textarea id="medical" placeholder="Please list any relevant medical conditions or allergies." value={formData.medical} onChange={handleChange} />
            </div>

          <div className="grid gap-2">
            <Label htmlFor="referral">Referral Code (if any)</Label>
            <Input id="referral" value={formData.referral} onChange={handleChange} />
          </div>

          <Card>
            <CardHeader>
                <CardTitle>Committee Preferences</CardTitle>
                <CardDescription>Select your preferred committees and countries.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="committee1">1st Preference Committee</Label>
                        <Input id="committee1" value={formData.committee1} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="country1">1st Preference Country</Label>
                        <Input id="country1" value={formData.country1} onChange={handleChange} />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="committee2">2nd Preference Committee</Label>
                        <Input id="committee2" value={formData.committee2} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="country2">2nd Preference Country</Label>
                        <Input id="country2" value={formData.country2} onChange={handleChange} />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="committee3">3rd Preference Committee</Label>
                        <Input id="committee3" value={formData.committee3} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="country3">3rd Preference Country</Label>
                        <Input id="country3" value={formData.country3} onChange={handleChange} />
                    </div>
                </div>
            </CardContent>
          </Card>


          <Button type="submit">Submit Registration</Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
