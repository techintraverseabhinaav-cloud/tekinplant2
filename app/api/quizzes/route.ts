import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { generateUserIdFromClerkId } from '../../../lib/supabase/sync-clerk-user'

async function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch quizzes
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServiceClient()
    const searchParams = request.nextUrl.searchParams
    const quizId = searchParams.get('id')
    const courseId = searchParams.get('courseId')

    // Get single quiz by ID with questions
    if (quizId) {
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single()

      if (quizError) {
        return NextResponse.json(
          { error: 'Quiz not found' },
          { status: 404 }
        )
      }

      // Get questions for this quiz
      const { data: questions, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('question_order', { ascending: true })

      return NextResponse.json({
        ...quiz,
        questions: questions || []
      })
    }

    // Get quizzes by course
    if (courseId) {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch quizzes' },
          { status: 500 }
        )
      }

      return NextResponse.json(data)
    }

    // Get all quizzes
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch quizzes' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Quizzes API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch quizzes' },
      { status: 500 }
    )
  }
}

// POST - Create quiz
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createServiceClient()
    const body = await request.json()
    const { questions, ...quizData } = body

    // Create quiz
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert(quizData)
      .select()
      .single()

    if (quizError) {
      return NextResponse.json(
        { error: 'Failed to create quiz', details: quizError.message },
        { status: 500 }
      )
    }

    // Create questions if provided
    if (questions && Array.isArray(questions) && questions.length > 0) {
      const questionsToInsert = questions.map((q: any, index: number) => ({
        quiz_id: quiz.id,
        question_text: q.question_text,
        question_type: q.question_type || 'multiple_choice',
        options: q.options || [],
        correct_answer: q.correct_answer,
        points: q.points || 1,
        question_order: q.question_order || index + 1
      }))

      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(questionsToInsert)

      if (questionsError) {
        console.error('Error creating questions:', questionsError)
        // Don't fail if questions fail, quiz is already created
      }
    }

    return NextResponse.json({ success: true, quiz })
  } catch (error: any) {
    console.error('Create quiz error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create quiz' },
      { status: 500 }
    )
  }
}

// PUT - Update quiz
export async function PUT(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createServiceClient()
    const body = await request.json()
    const { id, questions, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      )
    }

    // Update quiz
    const { data, error } = await supabase
      .from('quizzes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update quiz', details: error.message },
        { status: 500 }
      )
    }

    // Update questions if provided
    if (questions && Array.isArray(questions)) {
      // Delete existing questions
      await supabase
        .from('quiz_questions')
        .delete()
        .eq('quiz_id', id)

      // Insert new questions
      if (questions.length > 0) {
        const questionsToInsert = questions.map((q: any, index: number) => ({
          quiz_id: id,
          question_text: q.question_text,
          question_type: q.question_type || 'multiple_choice',
          options: q.options || [],
          correct_answer: q.correct_answer,
          points: q.points || 1,
          question_order: q.question_order || index + 1
        }))

        await supabase
          .from('quiz_questions')
          .insert(questionsToInsert)
      }
    }

    return NextResponse.json({ success: true, quiz: data })
  } catch (error: any) {
    console.error('Update quiz error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update quiz' },
      { status: 500 }
    )
  }
}

// DELETE - Delete quiz
export async function DELETE(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createServiceClient()
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      )
    }

    // Delete questions first (cascade should handle this, but being explicit)
    await supabase
      .from('quiz_questions')
      .delete()
      .eq('quiz_id', id)

    // Delete quiz
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete quiz', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Quiz deleted' })
  } catch (error: any) {
    console.error('Delete quiz error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete quiz' },
      { status: 500 }
    )
  }
}

