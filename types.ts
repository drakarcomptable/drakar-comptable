
import React from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceContent {
  introduction: string;
  mission: string[];
  methodology: string;
  importance: string;
  target: string;
  faq: FAQItem[];
}

export interface SubService {
  id: string;
  slug: string;
  title: string;
  content?: ServiceContent;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  subServices: SubService[];
  content?: ServiceContent;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Agency {
  name: string;
  slug: string;
  region: string;
  description?: string;
}

export interface RegionData {
  name: string;
  cities: string[];
}
