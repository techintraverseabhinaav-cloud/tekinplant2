-- Update Course Images to Match Updated Unsplash URLs
-- Run this in Supabase SQL Editor to update all course images

-- ============================================
-- UPDATE ALL 25 COURSE IMAGES
-- ============================================

UPDATE public.courses
SET image_url = 'https://images.unsplash.com/photo-1700427296131-0cc4c4610fc6?q=80&w=2676&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'PLC Programming & Automation' AND company_name = 'Siemens';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1661817214148-2d4cf768a7c3?q=80&w=1896&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Electrical Panel Design' AND company_name = 'ABB';

UPDATE public.courses
SET image_url = 'https://images.unsplash.com/photo-1667264501379-c1537934c7ab?q=80&w=2274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'SCADA System Development' AND company_name = 'Rockwell Automation';

UPDATE public.courses
SET image_url = 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D'
WHERE title = 'Industrial Robotics Programming' AND company_name = 'FANUC';

UPDATE public.courses
SET image_url = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D'
WHERE title = 'Process Control & Instrumentation' AND company_name = 'Emerson';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1681426687411-21986b0626a8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'HMI Development & Design' AND company_name = 'Schneider Electric';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1681399975135-252eab5fd2db?q=80&w=2274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Industrial Networking & Communication' AND company_name = 'Cisco';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1764695678014-3b87d3c0a432?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Variable Frequency Drive Programming' AND company_name = 'Danfoss';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1661963874418-df1110ee39c1?q=80&w=2286&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Safety Systems & SIL Training' AND company_name = 'Honeywell';

UPDATE public.courses
SET image_url = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Industrial IoT & Industry 4.0' AND company_name = 'Bosch';

UPDATE public.courses
SET image_url = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Motor Control & Protection' AND company_name = 'Siemens';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1661962646119-0c9d2a604a63?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'DCS Programming & Configuration' AND company_name = 'Yokogawa';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1661964187664-e26f70e1a224?q=80&w=2687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Industrial Cybersecurity' AND company_name = 'Fortinet';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1661963515041-661b417c0b45?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Batch Process Control' AND company_name = 'Emerson';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1661963515041-661b417c0b45?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Machine Vision & Quality Control' AND company_name = 'Cognex';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1683121696175-d05600fefb85?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Industrial Data Analytics' AND company_name = 'SAP';

UPDATE public.courses
SET image_url = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Motion Control Systems' AND company_name = 'Rockwell Automation';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1683121696175-d05600fefb85?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Motion Control Systems' AND company_name = 'Yaskawa';

UPDATE public.courses
SET image_url = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE (title = 'CNC Programming & Machining' OR title = 'CNC Programming') AND company_name = 'Mazak';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1681400019731-5d7cc4cafb9d?q=80&w=2274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Power Distribution Systems' AND company_name = 'Siemens';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1733317290375-d39da9fcc8e3?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Advanced Process Control' AND company_name = 'ABB';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1764705723226-8ec5a8d8fda9?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Industrial Cloud Solutions' AND company_name = 'Microsoft';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1764695811910-d1b958dab303?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Industrial Machine Learning' AND company_name = 'Google Cloud';

UPDATE public.courses
SET image_url = 'https://images.unsplash.com/photo-1543946602-a0fce8117697?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Power Systems & Distribution' AND company_name = 'L&T';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1733317290375-d39da9fcc8e3?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Lean Manufacturing & Six Sigma' AND company_name = 'TATA Motors';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1764705723226-8ec5a8d8fda9?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Industrial Data Analytics' AND company_name = 'Siemens';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1764695811910-d1b958dab303?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Maintenance & Reliability Engineering' AND company_name = 'Emerson';

UPDATE public.courses
SET image_url = 'https://images.unsplash.com/photo-1543946602-a0fce8117697?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Advanced PLC Programming' AND company_name = 'Rockwell Automation';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1681399960857-f3bf93e87a03?q=80&w=2274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Supply Chain Management' AND company_name = 'Rockwell Automation';

UPDATE public.courses
SET image_url = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Quality Control & Assurance' AND company_name = 'ABB';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1752302839380-411d4411b0b1?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Renewable Energy Systems' AND company_name = 'Suzlon';

UPDATE public.courses
SET image_url = 'https://plus.unsplash.com/premium_photo-1733342554594-102b8e2d0623?q=80&w=3462&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Smart Grid Technologies' AND company_name = 'BHEL';

-- Verify updates
SELECT 
  title,
  company_name,
  CASE 
    WHEN image_url LIKE '%unsplash.com%' THEN '✅ Updated'
    ELSE '❌ Not updated'
  END as image_status,
  LEFT(image_url, 50) as image_preview
FROM public.courses
ORDER BY title;

