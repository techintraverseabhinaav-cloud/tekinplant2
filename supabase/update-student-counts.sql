-- Update student_count for all courses to match industry-data.ts values
-- This restores the base counts that should be preserved

UPDATE public.courses
SET student_count = CASE
  WHEN title = 'PLC Programming & Automation' AND company_name = 'Siemens' THEN 245
  WHEN title = 'Electrical Panel Design' AND company_name = 'ABB' THEN 189
  WHEN title = 'SCADA System Development' AND company_name = 'Rockwell Automation' THEN 156
  WHEN title = 'HMI Programming' AND company_name = 'Emerson' THEN 134
  WHEN title = 'VFD Installation & Maintenance' AND company_name = 'Honeywell' THEN 178
  WHEN title = 'Industrial Networking' AND company_name = 'FANUC' THEN 167
  WHEN title = 'Robotics Programming' AND company_name = 'KUKA' THEN 145
  WHEN title = 'CNC Programming' AND company_name = 'Mazak' THEN 123
  WHEN title = 'Process Control Systems' AND company_name = 'Yokogawa' THEN 98
  WHEN title = 'Instrumentation & Calibration' AND company_name = 'Endress+Hauser' THEN 167
  WHEN title = 'Safety Systems Design' AND company_name = 'Schneider Electric' THEN 134
  WHEN title = 'Motor Control Systems' AND company_name = 'ABB' THEN 89
  WHEN title = 'Power Distribution' AND company_name = 'Siemens' THEN 112
  WHEN title = 'Automation Project Management' AND company_name = 'Rockwell Automation' THEN 78
  WHEN title = 'Industrial IoT Integration' AND company_name = 'Honeywell' THEN 145
  WHEN title = 'Machine Vision Systems' AND company_name = 'Cognex' THEN 67
  WHEN title = 'Motion Control Systems' AND company_name = 'Yaskawa' THEN 89
  WHEN title = 'Industrial Data Analytics' AND company_name = 'Siemens' THEN 56
  WHEN title = 'Energy Management Systems' AND company_name = 'Schneider Electric' THEN 123
  WHEN title = 'Maintenance & Reliability' AND company_name = 'Emerson' THEN 78
  WHEN title = 'Advanced PLC Programming' AND company_name = 'Rockwell Automation' THEN 156
  WHEN title = 'Industrial Cybersecurity' AND company_name = 'Honeywell' THEN 134
  WHEN title = 'Lean Manufacturing' AND company_name = 'Siemens' THEN 98
  WHEN title = 'Quality Control Systems' AND company_name = 'ABB' THEN 167
  WHEN title = 'Supply Chain Management' AND company_name = 'Rockwell Automation' THEN 145
  ELSE student_count -- Keep existing value if no match
END
WHERE student_count = 0 OR student_count IS NULL;

-- Verify the update
SELECT title, company_name, student_count 
FROM public.courses 
ORDER BY student_count DESC 
LIMIT 10;

