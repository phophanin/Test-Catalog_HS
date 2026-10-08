-- ================================================================
-- HOME SPORT - Seed Data
-- ================================================================

-- Categories
INSERT INTO public.categories (id, name, name_kh, slug, description, image_url, icon_name, display_order)
VALUES
('c1000000-0000-0000-0000-000000000001', 'Football Boots', 'ស្បែកជើងបាល់ទាត់', 'football-boots', 'Top tier football boots for FG, AG, and turf grounds.', 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800&auto=format&fit=crop', 'Footprints', 1),
('c1000000-0000-0000-0000-000000000002', 'Jerseys', 'អាវកីឡាបាល់ទាត់', 'jerseys', 'Official and player version club & national team jerseys.', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop', 'Shirt', 2),
('c1000000-0000-0000-0000-000000000003', 'Shorts', 'ខោកីឡា', 'shorts', 'Lightweight, breathable athletic football shorts.', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop', 'Scissors', 3),
('c1000000-0000-0000-0000-000000000004', 'Bags', 'កាតាបកីឡា', 'bags', 'Gym backpacks, boot bags, and team travel duffels.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', 'Briefcase', 4),
('c1000000-0000-0000-0000-000000000005', 'Caps', 'មួកកីឡា', 'caps', 'Breathable sports caps and trucker hats.', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop', 'Crown', 5),
('c1000000-0000-0000-0000-000000000006', 'Gloves', 'ស្រោមដៃអ្នកចាំទី', 'gloves', 'Pro match goalkeeper gloves with premium latex grip.', 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=800&auto=format&fit=crop', 'Hand', 6),
('c1000000-0000-0000-0000-000000000007', 'Socks', 'ស្រោមជើងកីឡា', 'socks', 'Anti-slip grip socks and compression match socks.', 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800&auto=format&fit=crop', 'Flame', 7),
('c1000000-0000-0000-0000-000000000008', 'Accessories', 'គ្រឿងបន្លាស់កីឡា', 'accessories', 'Shin pads, captain armbands, ball pumps, and training cones.', 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop', 'Sparkles', 8)
ON CONFLICT (id) DO NOTHING;

-- Brands
INSERT INTO public.brands (id, name, slug, description, description_kh, logo_url, country, is_featured)
VALUES
('b1000000-0000-0000-0000-000000000001', 'Nike', 'nike', 'World renowned footwear, apparel, and football equipment.', 'ម៉ាកយីហោលំដាប់ពិភពលោក ស្បែកជើង និងសម្លៀកបំពាក់កីឡា។', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop', 'USA', true),
('b1000000-0000-0000-0000-000000000002', 'Adidas', 'adidas', 'Iconic three-stripes performance football gear and boots.', 'ឧបករណ៍កីឡា និងស្បែកជើងល្បីល្បាញ Adidas។', 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=300&auto=format&fit=crop', 'Germany', true),
('b1000000-0000-0000-0000-000000000003', 'Puma', 'puma', 'Forever Faster athletic boots, jerseys, and street style.', 'ស្បែកជើង និងសម្លៀកបំពាក់កីឡាល្បឿនលឿន Puma។', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=300&auto=format&fit=crop', 'Germany', true),
('b1000000-0000-0000-0000-000000000004', 'Joma', 'joma', 'Spanish heritage sports brand renowned for futsal and turf.', 'ម៉ាកកីឡាអេស្ប៉ាញល្បីខាងហ្វូតសាល និងស្មៅសិប្បនិម្មិត។', 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=300&auto=format&fit=crop', 'Spain', true),
('b1000000-0000-0000-0000-000000000005', 'Mizuno', 'mizuno', 'Japanese handcrafted kangaroo leather football boots.', 'ស្បែកជើងបាល់ទាត់ស្បែកសុទ្ធដ៏ប្រណិតមកពីប្រទេសជប៉ុន។', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=300&auto=format&fit=crop', 'Japan', true),
('b1000000-0000-0000-0000-000000000006', 'Other', 'other', 'Selected quality football & sports gear from around the world.', 'ផលិតផលកីឡាគុណភាពខ្ពស់ដែលបានជ្រើសរើស។', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=300&auto=format&fit=crop', 'Global', true)
ON CONFLICT (id) DO NOTHING;

-- Initial Settings
INSERT INTO public.store_settings (id, store_name, phone, telegram, messenger, address, usd_to_khr_rate)
VALUES ('default', 'HOME SPORT', '+855 12 345 678', 'homesportkh', 'homesportcambodia', 'St 271, Sangkat Boeung Tumpun, Khan Mean Chey, Phnom Penh, Cambodia', 4100)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();
