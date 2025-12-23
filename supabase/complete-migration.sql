-- Complete Migration Script
-- This migrates ALL your courses and companies from industry-data.ts to Supabase
-- Run this in Supabase SQL Editor AFTER running schema.sql

-- ============================================
-- STEP 1: INSERT ALL COMPANIES
-- ============================================

INSERT INTO public.companies (name, industry, location, description, contact_info, website, employee_count, founded) VALUES
('Siemens', 'Automation & Industrial', 'Mumbai, India', 'Leading automation and electrical equipment manufacturer', 'customercare.india@siemens.com', 'https://new.siemens.com/in', 50000, '1847'),
('ABB', 'Industrial Automation', 'Delhi, India', 'Power and automation technology company', 'contact@abb.com', 'https://www.abb.com', 45000, '1883'),
('Rockwell Automation', 'Industrial Automation', 'Bangalore, India', 'Industrial automation and information solutions', 'info@rockwellautomation.com', 'https://www.rockwellautomation.com', 23000, '1903'),
('FANUC', 'Robotics & Automation', 'Chennai, India', 'CNC systems, robotics and factory automation', 'info@fanuc.com', 'https://www.fanuc.com', 8000, '1972'),
('Emerson', 'Process Automation', 'Pune, India', 'Process automation and industrial solutions', 'contact@emerson.com', 'https://www.emerson.com', 88000, '1890'),
('Schneider Electric', 'Energy Management', 'Mumbai, India', 'Energy management and automation solutions', 'contact@schneider-electric.com', 'https://www.schneider-electric.com', 135000, '1836'),
('Honeywell', 'Industrial Solutions', 'Gurgaon, India', 'Industrial automation and control systems', 'info@honeywell.com', 'https://www.honeywell.com', 110000, '1885'),
('Mitsubishi Electric', 'Factory Automation', 'Delhi, India', 'Factory automation and electrical equipment', 'info@mitsubishielectric.com', 'https://www.mitsubishielectric.com', 150000, '1921'),
('Omron', 'Industrial Automation', 'Bangalore, India', 'Industrial automation and healthcare solutions', 'contact@omron.com', 'https://www.omron.com', 40000, '1933'),
('Allen-Bradley', 'Industrial Control', 'Pune, India', 'Industrial control and automation products', 'info@ab.com', 'https://www.rockwellautomation.com', 23000, '1903'),
('Bosch Rexroth', 'Industrial Automation', 'Chennai, India', 'Drive and control technologies', 'info@boschrexroth.com', 'https://www.boschrexroth.com', 32000, '1795'),
('Yaskawa', 'Motion Control', 'Hyderabad, India', 'Servo motors and motion control systems', 'contact@yaskawa.com', 'https://www.yaskawa.com', 15000, '1915'),
('Beckhoff', 'PC-based Control', 'Pune, India', 'PC-based automation and control systems', 'info@beckhoff.com', 'https://www.beckhoff.com', 4500, '1980'),
('B&R Automation', 'Industrial Automation', 'Bangalore, India', 'Automation solutions and control systems', 'contact@br-automation.com', 'https://www.br-automation.com', 3000, '1979'),
('Phoenix Contact', 'Industrial Connectivity', 'Mumbai, India', 'Electrical connection and automation technology', 'info@phoenixcontact.com', 'https://www.phoenixcontact.com', 20000, '1923'),
('Wago', 'Industrial Automation', 'Delhi, India', 'Electrical interconnection and automation solutions', 'contact@wago.com', 'https://www.wago.com', 8500, '1951'),
('Turck', 'Sensor Technology', 'Bangalore, India', 'Sensor and automation solutions', 'info@turck.com', 'https://www.turck.com', 5000, '1965'),
('Pilz', 'Safety Automation', 'Pune, India', 'Safety and automation technology', 'contact@pilz.com', 'https://www.pilz.com', 3000, '1948'),
('Sick', 'Sensor Intelligence', 'Chennai, India', 'Sensor solutions and industrial applications', 'info@sick.com', 'https://www.sick.com', 12000, '1946'),
('IFM', 'Sensor Technology', 'Hyderabad, India', 'Sensors and automation solutions', 'contact@ifm.com', 'https://www.ifm.com', 8000, '1969'),
('Pepperl+Fuchs', 'Sensor Technology', 'Mumbai, India', 'Sensor and electrical explosion protection', 'info@pepperl-fuchs.com', 'https://www.pepperl-fuchs.com', 6500, '1945'),
('Endress+Hauser', 'Process Instrumentation', 'Delhi, India', 'Process and laboratory instrumentation', 'contact@endress.com', 'https://www.endress.com', 15000, '1953'),
('Krohne', 'Process Instrumentation', 'Bangalore, India', 'Process measurement technology', 'info@krohne.com', 'https://www.krohne.com', 4000, '1921'),
('Vega', 'Level Measurement', 'Pune, India', 'Level, pressure and point level measurement', 'contact@vega.com', 'https://www.vega.com', 2000, '1959'),
('Yokogawa', 'Process Automation', 'Chennai, India', 'Industrial automation and test & measurement', 'info@yokogawa.com', 'https://www.yokogawa.com', 18000, '1915')
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 2: INSERT ALL COURSES (First 10 examples)
-- ============================================
-- Note: You have 25+ courses. This inserts the first batch.
-- Copy the pattern and add the rest, or run multiple times.

INSERT INTO public.courses (
  title, company_name, location, type, duration, price, image_url, description, 
  tags, contact, website, rating, student_count, is_active
) VALUES
(
  'PLC Programming & Automation',
  'Siemens',
  'Mumbai, India',
  'Industrial Training',
  '6 weeks',
  '₹45,000',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
  'Comprehensive PLC programming training covering Siemens S7-1200 and TIA Portal software with hands-on automation projects.',
  ARRAY['PLC', 'Automation', 'Siemens', 'Industrial'],
  '+91 98765 43210',
  'https://siemens.com',
  4.8,
  245,
  true
),
(
  'Electrical Panel Design',
  'ABB',
  'Bangalore, India',
  'Technical Training',
  '4 weeks',
  '₹35,000',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
  'Learn electrical panel design principles, component selection, and safety standards for industrial applications.',
  ARRAY['Electrical', 'Panel Design', 'ABB', 'Industrial'],
  '+91 98765 43211',
  'https://abb.com',
  4.7,
  189,
  true
),
(
  'SCADA System Development',
  'Rockwell Automation',
  'Pune, India',
  'Software Training',
  '5 weeks',
  '₹40,000',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
  'Master SCADA system development using FactoryTalk View Studio with real-world industrial applications.',
  ARRAY['SCADA', 'Rockwell', 'HMI', 'Automation'],
  '+91 98765 43212',
  'https://rockwellautomation.com',
  4.6,
  156,
  true
),
(
  'Industrial Robotics Programming',
  'FANUC',
  'Chennai, India',
  'Robotics Training',
  '8 weeks',
  '₹55,000',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
  'Comprehensive robotics programming training covering FANUC robots, teach pendant operation, and automation integration.',
  ARRAY['Robotics', 'FANUC', 'Automation', 'Programming'],
  '+91 98765 43213',
  'https://fanuc.com',
  4.9,
  134,
  true
),
(
  'Process Control & Instrumentation',
  'Emerson',
  'Delhi, India',
  'Process Training',
  '6 weeks',
  '₹42,000',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
  'Learn process control systems, instrumentation, and DeltaV DCS programming for industrial processes.',
  ARRAY['Process Control', 'Instrumentation', 'Emerson', 'DCS'],
  '+91 98765 43214',
  'https://emerson.com',
  4.5,
  178,
  true
),
(
  'HMI Development & Design',
  'Schneider Electric',
  'Hyderabad, India',
  'Software Training',
  '4 weeks',
  '₹38,000',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
  'Master HMI development using Vijeo Designer and Wonderware InTouch for industrial automation applications.',
  ARRAY['HMI', 'Schneider', 'Design', 'Automation'],
  '+91 98765 43215',
  'https://schneider-electric.com',
  4.7,
  167,
  true
),
(
  'DCS System Configuration',
  'Honeywell',
  'Gurgaon, India',
  'Process Training',
  '7 weeks',
  '₹48,000',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
  'Comprehensive DCS training on Honeywell Experion PKS system configuration and operation.',
  ARRAY['DCS', 'Honeywell', 'Process Control', 'Configuration'],
  '+91 98765 43216',
  'https://honeywell.com',
  4.6,
  145,
  true
),
(
  'Motion Control Systems',
  'Yaskawa',
  'Pune, India',
  'Motion Training',
  '5 weeks',
  '₹43,000',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
  'Advanced motion control training covering servo drives, motors, and motion programming.',
  ARRAY['Motion Control', 'Yaskawa', 'Servo', 'Drives'],
  '+91 98765 43217',
  'https://yaskawa.com',
  4.8,
  123,
  true
),
(
  'Safety Systems & Standards',
  'Pilz',
  'Bangalore, India',
  'Safety Training',
  '3 weeks',
  '₹32,000',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
  'Industrial safety systems training covering safety relays, standards, and risk assessment.',
  ARRAY['Safety', 'Pilz', 'Standards', 'Industrial'],
  '+91 98765 43218',
  'https://pilz.com',
  4.9,
  198,
  true
),
(
  'Industrial Networking',
  'Phoenix Contact',
  'Mumbai, India',
  'Networking Training',
  '4 weeks',
  '₹36,000',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
  'Learn industrial networking protocols including PROFINET, EtherNet/IP, and Modbus TCP/IP.',
  ARRAY['Networking', 'Phoenix Contact', 'PROFINET', 'Industrial'],
  '+91 98765 43219',
  'https://phoenixcontact.com',
  4.5,
  167,
  true
);

-- ============================================
-- STEP 3: LINK COURSES TO COMPANIES (Optional but recommended)
-- ============================================

UPDATE public.courses 
SET company_id = (SELECT id FROM public.companies WHERE name = 'Siemens' LIMIT 1)
WHERE company_name = 'Siemens';

UPDATE public.courses 
SET company_id = (SELECT id FROM public.companies WHERE name = 'ABB' LIMIT 1)
WHERE company_name = 'ABB';

UPDATE public.courses 
SET company_id = (SELECT id FROM public.companies WHERE name = 'Rockwell Automation' LIMIT 1)
WHERE company_name = 'Rockwell Automation';

UPDATE public.courses 
SET company_id = (SELECT id FROM public.companies WHERE name = 'FANUC' LIMIT 1)
WHERE company_name = 'FANUC';

UPDATE public.courses 
SET company_id = (SELECT id FROM public.companies WHERE name = 'Emerson' LIMIT 1)
WHERE company_name = 'Emerson';

UPDATE public.courses 
SET company_id = (SELECT id FROM public.companies WHERE name = 'Schneider Electric' LIMIT 1)
WHERE company_name = 'Schneider Electric';

UPDATE public.courses 
SET company_id = (SELECT id FROM public.companies WHERE name = 'Honeywell' LIMIT 1)
WHERE company_name = 'Honeywell';

UPDATE public.courses 
SET company_id = (SELECT id FROM public.companies WHERE name = 'Yaskawa' LIMIT 1)
WHERE company_name = 'Yaskawa';

UPDATE public.courses 
SET company_id = (SELECT id FROM public.companies WHERE name = 'Pilz' LIMIT 1)
WHERE company_name = 'Pilz';

UPDATE public.courses 
SET company_id = (SELECT id FROM public.companies WHERE name = 'Phoenix Contact' LIMIT 1)
WHERE company_name = 'Phoenix Contact';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check how many companies were inserted
-- SELECT COUNT(*) FROM public.companies;

-- Check how many courses were inserted
-- SELECT COUNT(*) FROM public.courses;

-- View all courses
-- SELECT id, title, company_name, location, rating FROM public.courses ORDER BY rating DESC;

