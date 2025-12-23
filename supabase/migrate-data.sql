-- Migration script to populate database with existing course and company data
-- Run this AFTER running schema.sql

-- ============================================
-- INSERT COMPANIES FIRST
-- ============================================

INSERT INTO public.companies (name, industry, location, description, contact_info, website, employee_count, founded) VALUES
('Siemens', 'Automation & Industrial', 'Mumbai, India', 'Leading automation and electrical equipment manufacturer', 'customercare.india@siemens.com', 'https://new.siemens.com/in', 50000, '1847'),
('ABB', 'Industrial Automation', 'Delhi, India', 'Power and automation technology company', 'contact@abb.com', 'https://www.abb.com', 45000, '1883'),
('Rockwell Automation', 'Industrial Automation', 'Bangalore, India', 'Industrial automation and information solutions', 'info@rockwellautomation.com', 'https://www.rockwellautomation.com', 23000, '1903'),
('Emerson', 'Process Automation', 'Pune, India', 'Process automation and industrial solutions', 'contact@emerson.com', 'https://www.emerson.com', 88000, '1890'),
('Honeywell', 'Industrial Solutions', 'Gurgaon, India', 'Industrial automation and control systems', 'info@honeywell.com', 'https://www.honeywell.com', 110000, '1885'),
('FANUC', 'Robotics & Automation', 'Chennai, India', 'CNC systems, robotics and factory automation', 'info@fanuc.com', 'https://www.fanuc.com', 8000, '1972'),
('Schneider Electric', 'Energy Management', 'Mumbai, India', 'Energy management and automation solutions', 'contact@schneider-electric.com', 'https://www.schneider-electric.com', 135000, '1836'),
('Mitsubishi Electric', 'Factory Automation', 'Delhi, India', 'Factory automation and electrical equipment', 'info@mitsubishielectric.com', 'https://www.mitsubishielectric.com', 150000, '1921'),
('Omron', 'Industrial Automation', 'Bangalore, India', 'Industrial automation and healthcare solutions', 'contact@omron.com', 'https://www.omron.com', 40000, '1933'),
('Allen-Bradley', 'Industrial Control', 'Pune, India', 'Industrial control and automation products', 'info@ab.com', 'https://www.rockwellautomation.com', 23000, '1903');

-- ============================================
-- INSERT COURSES
-- ============================================

-- Note: You'll need to insert courses one by one or in batches
-- Here's an example for the first few courses:

INSERT INTO public.courses (
  title, company_name, location, type, duration, price, description, 
  tags, contact, website, rating, student_count, is_active
) VALUES
(
  'PLC Programming & Automation',
  'Siemens',
  'Mumbai, India',
  'Industrial Training',
  '6 weeks',
  '₹45,000',
  'Comprehensive PLC programming training covering Siemens S7-1200 and TIA Portal software with hands-on automation projects.',
  ARRAY['PLC', 'Automation', 'Siemens', 'Industrial'],
  '+91 98765 43210',
  'https://siemens.com',
  4.8,
  245,
  true
),
(
  'Industrial SCADA & HMI',
  'ABB',
  'Delhi, India',
  'Industrial Training',
  '8 weeks',
  '₹55,000',
  'Advanced SCADA and HMI system design and implementation training.',
  ARRAY['SCADA', 'HMI', 'ABB', 'Industrial'],
  '+91 98765 43211',
  'https://abb.com',
  4.7,
  189,
  true
),
(
  'Drives & Motion Control',
  'Rockwell Automation',
  'Bangalore, India',
  'Industrial Training',
  '5 weeks',
  '₹50,000',
  'Training on variable frequency drives and motion control systems.',
  ARRAY['Drives', 'Motion Control', 'Rockwell', 'Industrial'],
  '+91 98765 43212',
  'https://rockwellautomation.com',
  4.6,
  156,
  true
);

-- ============================================
-- HELPER: Get company IDs for reference
-- ============================================
-- Run this to see company IDs:
-- SELECT id, name FROM public.companies;

-- ============================================
-- UPDATE COURSES WITH COMPANY_ID (optional)
-- ============================================
-- After inserting courses, you can link them to companies:
-- UPDATE public.courses SET company_id = (SELECT id FROM public.companies WHERE name = 'Siemens') WHERE company_name = 'Siemens';

