'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { committees } from '@/lib/committees';

const siteConfig = { name: "RUIMUN" };

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    delegate_type: 'RUN',
    gender: 'male',
    mun_experience: '',
    affiliation: '',
    position: '',
    department: '',
    matric_num: '',
    city: '',
    state: '',
    country: 'Nigeria',
    zipcode: '',
    advert: 'friend/colleague',
    tshirt_size: 'm',
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

  const [availableCountries1, setAvailableCountries1] = useState([]);
  const [availableCountries2, setAvailableCountries2] = useState([]);
  const [availableCountries3, setAvailableCountries3] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [emailStatus, setEmailStatus] = useState('');

  const checkEmail = useCallback(async (email) => {
    if (!email) {
      setEmailStatus('');
      return;
    }
    try {
      const response = await fetch(`/api/check_registration?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.isRegistered) {
        setEmailStatus('This email is already registered.');
      } else {
        setEmailStatus('This email is available.');
      }
    } catch (error) {
      setEmailStatus('Could not verify email.');
    }
  }, []);

  useEffect(() => {
    if (formData.committee1) {
      const selectedCommittee = committees.find(c => c.committee === formData.committee1);
      setAvailableCountries1(selectedCommittee ? selectedCommittee.countries : []);
    } else {
      setAvailableCountries1([]);
    }
  }, [formData.committee1]);

  useEffect(() => {
    if (formData.committee2) {
      const selectedCommittee = committees.find(c => c.committee === formData.committee2);
      setAvailableCountries2(selectedCommittee ? selectedCommittee.countries : []);
    } else {
      setAvailableCountries2([]);
    }
  }, [formData.committee2]);

  useEffect(() => {
    if (formData.committee3) {
      const selectedCommittee = committees.find(c => c.committee === formData.committee3);
      setAvailableCountries3(selectedCommittee ? selectedCommittee.countries : []);
    } else {
      setAvailableCountries3([]);
    }
  }, [formData.committee3]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      // Simple debounce
      const timer = setTimeout(() => {
        checkEmail(value);
      }, 500);
      return () => clearTimeout(timer);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/register_delegate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage('Registration successful!');
        setTimeout(() => {
        }, 2000);
      } else if (response.status === 409) {
        setSubmitMessage(data.message || 'You have already registered.');
      } else {
        setSubmitMessage(data.error || 'An error occurred during registration.');
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Registration</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <div>{emailStatus}</div>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
        <select name="delegate_type" value={formData.delegate_type} onChange={handleChange}>
          <option value="RUN">RUN</option>
          <option value="other">Other</option>
        </select>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input type="text" name="mun_experience" value={formData.mun_experience} onChange={handleChange} placeholder="MUN Experience" />
        <input type="text" name="affiliation" value={formData.affiliation} onChange={handleChange} placeholder="Affiliation" />
        <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position" />
        <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" />
        <input type="text" name="matric_num" value={formData.matric_num} onChange={handleChange} placeholder="Matric Number" />
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
        <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
        <input type="text" name="zipcode" value={formData.zipcode} onChange={handleChange} placeholder="Zipcode" />
        <select name="advert" value={formData.advert} onChange={handleChange}>
          <option value="friend/colleague">Friend/Colleague</option>
          <option value="social media">Social Media</option>
          <option value="other">Other</option>
        </select>
        <select name="tshirt_size" value={formData.tshirt_size} onChange={handleChange}>
          <option value="s">S</option>
          <option value="m">M</option>
          <option value="l">L</option>
          <option value="xl">XL</option>
        </select>
        <textarea name="medical" value={formData.medical} onChange={handleChange} placeholder="Medical Conditions"></textarea>
        <textarea name="diet" value={formData.diet} onChange={handleChange} placeholder="Dietary Restrictions"></textarea>
        <input type="text" name="referral" value={formData.referral} onChange={handleChange} placeholder="Referral" />
        <select name="committee1" value={formData.committee1} onChange={handleChange}>
          <option value="">Select Committee 1</option>
          {committees.map(c => <option key={c.id} value={c.committee}>{c.committee}</option>)}
        </select>
        <select name="country1" value={formData.country1} onChange={handleChange}>
          <option value="">Select Country 1</option>
          {availableCountries1.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="committee2" value={formData.committee2} onChange={handleChange}>
          <option value="">Select Committee 2</option>
          {committees.map(c => <option key={c.id} value={c.committee}>{c.committee}</option>)}
        </select>
        <select name="country2" value={formData.country2} onChange={handleChange}>
          <option value="">Select Country 2</option>
          {availableCountries2.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="committee3" value={formData.committee3} onChange={handleChange}>
          <option value="">Select Committee 3</option>
          {committees.map(c => <option key={c.id} value={c.committee}>{c.committee}</option>)}
        </select>
        <select name="country3" value={formData.country3} onChange={handleChange}>
          <option value="">Select Country 3</option>
          {availableCountries3.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Register'}</button>
        {submitMessage && <div>{submitMessage}</div>}
      </form>
    </div>
  )
}

export default Registration;
