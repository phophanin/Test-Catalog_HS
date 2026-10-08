'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';

interface Translations {
  [key: string]: {
    en: string;
    km: string;
  };
}

export const translations: Translations = {
  // Navigation
  nav_home: { en: 'Home', km: 'ទំព័រដើម' },
  nav_products: { en: 'Products', km: 'ផលិតផលទាំងអស់' },
  nav_boots: { en: 'Football Boots', km: 'ស្បែកជើងបាល់ទាត់' },
  nav_jerseys: { en: 'Jerseys', km: 'អាវកីឡា' },
  nav_shorts: { en: 'Shorts', km: 'ខោកីឡា' },
  nav_accessories: { en: 'Accessories', km: 'គ្រឿងបន្លាស់' },
  nav_brands: { en: 'Brands', km: 'ម៉ាកយីហោ' },
  nav_about: { en: 'About', km: 'អំពីយើង' },
  nav_contact: { en: 'Contact', km: 'ទំនាក់ទំនង' },
  nav_admin: { en: 'Admin Panel', km: 'ផ្ទាំងគ្រប់គ្រង' },

  // Hero
  hero_title: { en: 'YOUR GAME. YOUR STYLE.', km: 'YOUR GAME. YOUR STYLE.' },
  hero_subtitle: {
    en: 'Discover football boots, jerseys and sports accessories at HOME SPORT.',
    km: 'ស្វែងរកស្បែកជើងបាល់ទាត់ អាវកីឡា និងគ្រឿងបន្លាស់កីឡាគុណភាពខ្ពស់នៅ HOME SPORT។',
  },
  hero_shop_now: { en: 'SHOP NOW', km: 'ទិញឥឡូវនេះ' },
  hero_contact_us: { en: 'CONTACT US', km: 'ទាក់ទងមកយើង' },

  // Section Headers
  section_featured_categories: { en: 'Featured Categories', km: 'ប្រភេទផលិតផលពេញនិយម' },
  section_featured_products: { en: 'Featured Products', km: 'ផលិតផលពិសេស' },
  section_best_sellers: { en: 'Best Sellers', km: 'ផលិតផលលក់ដាច់បំផុត' },
  section_new_arrivals: { en: 'New Arrivals', km: 'ផលិតផលមកដល់ថ្មី' },
  section_sale_products: { en: 'Special Sale', km: 'បញ្ចុះតម្លៃពិសេស' },
  section_popular_brands: { en: 'Popular Brands', km: 'ម៉ាកយីហោល្បីៗ' },
  section_why_choose: { en: 'Why Choose HOME SPORT?', km: 'ហេតុអ្វីជ្រើសរើស HOME SPORT?' },
  section_cta_title: { en: 'Ready to Elevate Your Game?', km: 'ត្រៀមខ្លួនបង្កើនសមត្ថភាពលើទីលានហើយឬនៅ?' },
  section_cta_subtitle: {
    en: 'Chat with our sports consultants to find the perfect gear, size, and fit today.',
    km: 'ជជែកជាមួយអ្នកជំនាញកីឡារបស់យើងដើម្បីជ្រើសរើសទំហំ និងស្បែកជើងដែលសក្តិសមបំផុត។',
  },

  // Badges & Status
  badge_new: { en: 'NEW', km: 'ថ្មី' },
  badge_sale: { en: 'SALE', km: 'ចុះតម្លៃ' },
  badge_best_seller: { en: 'BEST SELLER', km: 'លក់ដាច់' },
  stock_in: { en: 'IN STOCK', km: 'មានក្នុងស្តុក' },
  stock_low: { en: 'LOW STOCK', km: 'ស្តុកជិតអស់' },
  stock_out: { en: 'OUT OF STOCK', km: 'អស់ពីស្តុក' },

  // Product Card & Catalog
  view_product: { en: 'VIEW PRODUCT', km: 'មើលលម្អិត' },
  order_now: { en: 'ORDER NOW', km: 'បញ្ជាទិញឥឡូវនេះ' },
  available_sizes: { en: 'Available sizes:', km: 'ទំហំដែលមាន៖' },
  search_placeholder: { en: 'Search boots, jerseys, Nike, SKU...', km: 'ស្វែងរកស្បែកជើង, អាវកីឡា, ម៉ាក, SKU...' },
  products_found: { en: 'products found', km: 'ផលិតផលត្រូវបានរកឃើញ' },
  no_products_found: { en: 'No products found', km: 'រកមិនឃើញផលិតផលទេ' },
  no_products_msg: {
    en: 'Try clearing some filters or searching with different keywords.',
    km: 'សូមព្យាយាមលុបតម្រងមួយចំនួន ឬស្វែងរកជាមួយពាក្យគន្លឹះផ្សេង។',
  },
  filter: { en: 'Filter', km: 'តម្រង' },
  sort_by: { en: 'Sort by', km: 'តម្រៀបតាម' },
  reset_filters: { en: 'Reset All', km: 'កំណត់ឡើងវិញ' },

  // Filter Categories
  filter_category: { en: 'Category', km: 'ប្រភេទ' },
  filter_brand: { en: 'Brand', km: 'ម៉ាកយីហោ' },
  filter_price: { en: 'Price Range', km: 'ចន្លោះតម្លៃ' },
  filter_size: { en: 'Size', km: 'ទំហំ' },
  filter_color: { en: 'Color', km: 'ពណ៌' },
  filter_stock: { en: 'Stock Status', km: 'ស្ថានភាពស្តុក' },
  filter_tags: { en: 'Product Type', km: 'លក្ខណៈពិសេស' },

  // Sort Options
  sort_featured: { en: 'Featured', km: 'ពេញនិយម' },
  sort_newest: { en: 'Newest Arrivals', km: 'ទើបមកដល់ថ្មី' },
  sort_price_low: { en: 'Price: Low to High', km: 'តម្លៃ៖ ទាបទៅខ្ពស់' },
  sort_price_high: { en: 'Price: High to Low', km: 'តម្លៃ៖ ខ្ពស់ទៅទាប' },
  sort_name: { en: 'Alphabetical: A-Z', km: 'ឈ្មោះ៖ A-Z' },

  // Product Detail Page
  product_sku: { en: 'SKU', km: 'លេខកូដ' },
  product_specs: { en: 'Specifications & Tech', km: 'លក្ខណៈបច្ចេកទេស' },
  product_desc: { en: 'Description', km: 'ការពិពណ៌នា' },
  product_related: { en: 'Related Products', km: 'ផលិតផលស្រដៀងគ្នា' },
  select_size: { en: 'Select Size', km: 'ជ្រើសរើសទំហំ' },
  select_color: { en: 'Select Color', km: 'ជ្រើសរើសពណ៌' },
  quantity: { en: 'Quantity', km: 'ចំនួន' },
  size_guide: { en: 'Size Guide', km: 'តារាងវាស់ទំហំ' },

  // Order & Contact Modal
  order_modal_title: { en: 'Order / Contact HOME SPORT', km: 'បញ្ជាទិញ / ទំនាក់ទំនង HOME SPORT' },
  order_modal_subtitle: {
    en: 'Fast direct ordering with our Phnom Penh sales team via Telegram, Messenger or Phone.',
    km: 'បញ្ជាទិញលឿនរហ័សផ្ទាល់ជាមួយបុគ្គលិកផ្នែកលក់នៅភ្នំពេញ តាម Telegram, Messenger ឬខលផ្ទាល់។',
  },
  order_via_telegram: { en: 'Order via Telegram', km: 'កុម្ម៉ង់តាម Telegram' },
  order_via_messenger: { en: 'Order via Messenger', km: 'កុម្ម៉ង់តាម Messenger' },
  call_store: { en: 'Call Now', km: 'ខលទាក់ទងឥឡូវនេះ' },
  customer_name: { en: 'Your Name', km: 'ឈ្មោះរបស់អ្នក' },
  customer_phone: { en: 'Phone / Telegram Number', km: 'លេខទូរស័ព្ទ / Telegram' },
  customer_notes: { en: 'Notes (e.g. province delivery)', km: 'ចំណាំ (ឧ. ទីតាំងដឹកជញ្ជូន)' },
  submit_inquiry: { en: 'Send Order Request', km: 'ផ្ញើសំណើបញ្ជាទិញ' },
  inquiry_sent_success: { en: 'Order Request Sent Successfully!', km: 'សំណើបញ្ជាទិញត្រូវបានផ្ញើជោគជ័យ!' },

  // Footer & Value Props
  footer_about: {
    en: 'HOME SPORT is Cambodias premier sports gear and football apparel specialist. Genuine products, competitive prices, and fast 25-province delivery.',
    km: 'HOME SPORT ជាហាងឯកទេសផ្គត់ផ្គង់ឧបករណ៍កីឡា និងស្បែកជើងបាល់ទាត់ឈានមុខគេនៅកម្ពុជា។ ផលិតផលស្តង់ដារ តម្លៃសមរម្យ និងសេវាដឹកជញ្ជូនរហ័ស ២៥ ខេត្ត-ក្រុង។',
  },
  prop_authentic_title: { en: '100% Quality Guaranteed', km: 'ធានាគុណភាព ១០០%' },
  prop_authentic_desc: { en: 'Carefully curated professional sports gear & boots.', km: 'ជ្រើសរើសយ៉ាងសម្រិតសម្រាំងនូវឧបករណ៍កីឡាស្តង់ដារ។' },
  prop_delivery_title: { en: 'Nationwide Delivery', km: 'ដឹកជញ្ជូន ២៥ ខេត្ត-ក្រុង' },
  prop_delivery_desc: { en: 'Fast delivery across Phnom Penh & all provinces.', km: 'សេវាដឹកជញ្ជូនលឿនរហ័សទូទាំងប្រទេសកម្ពុជា។' },
  prop_consult_title: { en: 'Expert Consultation', km: 'ប្រឹក្សាទំហំត្រឹមត្រូវ' },
  prop_consult_desc: { en: 'Guidance on boots fit, pitch type, and sizing.', km: 'ណែនាំការជ្រើសរើសទំហំ និងប្រភេទស្បែកជើងតាមទីលាន។' },
  prop_support_title: { en: 'Dedicated Support', km: 'សេវាកម្មរួសរាយ' },
  prop_support_desc: { en: 'Quick reply via Telegram & Facebook Messenger 7 days a week.', km: 'ឆ្លើយតបរហ័សរាល់ថ្ងៃតាម Telegram និង Messenger។' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('km'); // Khmer is primary as specified!

  useEffect(() => {
    const saved = localStorage.getItem('home_sport_language') as Language;
    if (saved && (saved === 'km' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('home_sport_language', lang);
    }
  };

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    return item[language] || item.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
