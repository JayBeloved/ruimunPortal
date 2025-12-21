'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { committees as committeeData } from '@/lib/committees';

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
    country: 'Nigeria',
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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    if (!user) {
        router.push('/');
        return;
    }
    
    // Set initial form data from user object and attempt to fetch existing registration
    setFormData(prev => ({ ...prev, email: user.email || '', name: user.displayName || '' }));
    
    if (db) {
        const docRef = doc(db, "registrations", user.uid);
        getDoc(docRef).then(docSnap => {
            if (docSnap.exists()) {
                const existingData = docSnap.data();
                // Ensure we don't overwrite the initial user data if the doc is empty
                if (existingData) {
                    setFormData(prev => ({...prev, ...existingData}));
                }
            }
        }).catch(err => {
            // It's okay if this fails (e.g., offline, permissions), the form will just be empty.
            console.warn("Could not fetch existing registration, starting with a blank form.", err);
        }).finally(() => {
            setLoading(false);
        });
    } else {
        setLoading(false);
    }

  }, [user, authLoading, db, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const getAvailableCountries = (committeeName: string) => {
    if (!committeeName) return [];
    const selectedCommittee = committeeData.find(c => c.committee === committeeName);
    return selectedCommittee ? selectedCommittee.countries : [];
  };

  const availableCountries1 = useMemo(() => getAvailableCountries(formData.committee1), [formData.committee1]);
  const availableCountries2 = useMemo(() => getAvailableCountries(formData.committee2), [formData.committee2]);
  const availableCountries3 = useMemo(() => getAvailableCountries(formData.committee3), [formData.committee3]);

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

  const getFilteredCommittees = (exclude: {committee: string; country: string}[]) => {
      return committeeData; // simplified for now
  }
  
  const selectedPairs = [
      { committee: formData.committee1, country: formData.country1 },
      { committee: formData.committee2, country: formData.country2 },
      { committee: formData.committee3, country: formData.country3 },
  ].filter(p => p.committee && p.country);


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
        <form onSubmit={handleSubmit} className="grid gap-8">

          {/* Section A: Personal Information */}
          <Card>
            <CardHeader>
                <CardTitle>A. Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
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
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select onValueChange={(value) => handleSelectChange('gender', value)} value={formData.gender}>
                            <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                            <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="delegate_type">Delegate Type</Label>
                        <Select onValueChange={(value) => handleSelectChange('delegate_type', value)} value={formData.delegate_type} required>
                            <SelectTrigger><SelectValue placeholder="Select Delegate Type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="redeemer">Redeemer's University (₦80,000)</SelectItem>
                                <SelectItem value="nigerian">Nigerian Delegate (₦100,000)</SelectItem>
                                <SelectItem value="international">International Delegate ($150)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
          </Card>

          {/* Section B: Additional Information */}
          <Card>
            <CardHeader>
                <CardTitle>B. Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="affiliation">Institution/University Name</Label>
                    <Input id="affiliation" value={formData.affiliation} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="position">Position (e.g., Student, Analyst)</Label>
                    <Input id="position" value={formData.position} onChange={handleChange} />
                    </div>
                </div>
                
                {formData.delegate_type === 'redeemer' && (
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" value={formData.department} onChange={handleChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="matric_num">Matriculation Number</Label>
                            <Input id="matric_num" value={formData.matric_num} onChange={handleChange} />
                        </div>
                    </div>
                )}
                
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
            </CardContent>
          </Card>

          {/* Section D: Committee Preferences */}
          <Card>
            <CardHeader>
                <CardTitle>C. Committee Preferences</CardTitle>
                <CardDescription>Select your preferred committees and countries. A country dropdown will activate once you select a committee.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                {/* 1st Preference */}
                <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-4">1st Choice</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="committee1">Committee</Label>
                            <Select onValueChange={(value) => { handleSelectChange('committee1', value); handleSelectChange('country1', ''); }} value={formData.committee1}>
                                <SelectTrigger><SelectValue placeholder="Select Committee" /></SelectTrigger>
                                <SelectContent>
                                    {committeeData.map(c => <SelectItem key={c.id} value={c.committee}>{c.committee}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country1">Country</Label>
                            <Select onValueChange={(value) => handleSelectChange('country1', value)} value={formData.country1} disabled={!formData.committee1}>
                                <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                                <SelectContent>
                                    {availableCountries1.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* 2nd Preference */}
                <div className="p-4 border rounded-md">
                     <h4 className="font-medium mb-4">2nd Choice</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="committee2">Committee</Label>
                            <Select onValueChange={(value) => { handleSelectChange('committee2', value); handleSelectChange('country2', ''); }} value={formData.committee2}>
                                <SelectTrigger><SelectValue placeholder="Select Committee" /></SelectTrigger>
                                <SelectContent>
                                    {committeeData.filter(c => !(c.committee === formData.committee1 && formData.country1)).map(c => <SelectItem key={c.id} value={c.committee}>{c.committee}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country2">Country</Label>
                            <Select onValueChange={(value) => handleSelectChange('country2', value)} value={formData.country2} disabled={!formData.committee2}>
                                <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                                <SelectContent>
                                    {availableCountries2.filter(c => !(c === formData.country1 && formData.committee1 === formData.committee2)).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* 3rd Preference */}
                <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-4">3rd Choice</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="committee3">Committee</Label>
                             <Select onValueChange={(value) => { handleSelectChange('committee3', value); handleSelectChange('country3', ''); }} value={formData.committee3}>
                                <SelectTrigger><SelectValue placeholder="Select Committee" /></SelectTrigger>
                                <SelectContent>
                                    {committeeData.filter(c => !(c.committee === formData.committee1 && formData.country1) && !(c.committee === formData.committee2 && formData.country2)).map(c => <SelectItem key={c.id} value={c.committee}>{c.committee}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country3">Country</Label>
                            <Select onValueChange={(value) => handleSelectChange('country3', value)} value={formData.country3} disabled={!formData.committee3}>
                                <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                                <SelectContent>
                                    {availableCountries3.filter(c => !(c === formData.country1 && formData.committee1 === formData.committee3) && !(c === formData.country2 && formData.committee2 === formData.committee3)).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>

          {/* Section C: Other Information */}
          <Card>
              <CardHeader>
                <CardTitle>D. Other Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="mun_experience">MUN Experience</Label>
                    <Textarea id="mun_experience" placeholder="e.g., 3 conferences as delegate, 1 as chair..." value={formData.mun_experience} onChange={handleChange} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="advert">How did you hear about us?</Label>
                        <Select onValueChange={(value) => handleSelectChange('advert', value)} value={formData.advert}>
                            <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="social_media">Social Media</SelectItem>
                                <SelectItem value="friend">Friend/Colleague</SelectItem>
                                <SelectItem value="university">University</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
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
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="diet">Dietary Restrictions</Label>
                        <Textarea id="diet" placeholder="e.g., Vegetarian, nut allergy" value={formData.diet} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="medical">Medical Conditions</Label>
                        <Textarea id="medical" placeholder="Please list any relevant medical conditions or allergies." value={formData.medical} onChange={handleChange} />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="referral">Referral Code (if any)</Label>
                    <Input id="referral" value={formData.referral} onChange={handleChange} />
                </div>
              </CardContent>
          </Card>


          <Button type="submit" size="lg">Submit Registration</Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
