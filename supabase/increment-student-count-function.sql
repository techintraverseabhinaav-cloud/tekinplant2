-- Function to increment course student_count by 1
-- This preserves the base count from industry-data.ts and adds enrollments on top

CREATE OR REPLACE FUNCTION public.increment_course_student_count(course_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.courses
  SET student_count = COALESCE(student_count, 0) + 1
  WHERE id = course_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the trigger to increment instead of recalculating
-- This way we preserve the base count from industry-data.ts
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

