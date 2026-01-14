-- ============================================
-- COMPLETE FIX: Update Student Counts + Trigger
-- ============================================
-- Run this in Supabase SQL Editor to:
-- 1. Update all courses with base student_count from industry-data.ts
-- 2. Fix the trigger to increment instead of recalculating
-- ============================================

-- STEP 1: Update the trigger function to increment instead of recalculating
CREATE OR REPLACE FUNCTION public.update_course_student_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if status is 'approved'
  IF NEW.status = 'approved' THEN
    -- Increment by 1 instead of recalculating
    UPDATE public.courses
    SET student_count = COALESCE(student_count, 0) + 1
    WHERE id = NEW.course_id;
  ELSIF OLD.status = 'approved' AND (NEW.status != 'approved' OR TG_OP = 'DELETE') THEN
    -- Decrement if enrollment is deleted or status changes from approved
    UPDATE public.courses
    SET student_count = GREATEST(COALESCE(student_count, 0) - 1, 0)
    WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 2: Update student_count for all courses to match industry-data.ts values
UPDATE public.courses
SET student_count = CASE
  WHEN title = 'PLC Programming & Automation' AND company_name = 'Siemens' THEN 245
  WHEN title = 'Electrical Panel Design' AND company_name = 'ABB' THEN 189
  WHEN title = 'SCADA System Development' AND company_name = 'Rockwell Automation' THEN 156
  WHEN title = 'Industrial Robotics Programming' AND company_name = 'FANUC' THEN 134
  WHEN title = 'Process Control & Instrumentation' AND company_name = 'Emerson' THEN 178
  WHEN title = 'HMI Development & Design' AND company_name = 'Schneider Electric' THEN 167
  WHEN title = 'VFD Installation & Maintenance' AND company_name = 'Honeywell' THEN 178
  WHEN title = 'Industrial Networking & Communication' AND company_name = 'Cisco' THEN 145
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
  ELSE COALESCE(student_count, 0) -- Keep existing value if no match, default to 0
END;

-- STEP 3: Verify the update
SELECT 
  title, 
  company_name, 
  student_count,
  CASE 
    WHEN student_count > 0 THEN '✅' 
    ELSE '❌' 
  END as status
FROM public.courses 
ORDER BY student_count DESC;

