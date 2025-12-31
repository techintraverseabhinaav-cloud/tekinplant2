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

// GET - Fetch quiz attempts
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServiceClient()
    const searchParams = request.nextUrl.searchParams
    const attemptId = searchParams.get('id')
    const quizId = searchParams.get('quizId')
    const studentId = searchParams.get('studentId')

    // Get single attempt by ID
    if (attemptId) {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quizzes (*),
          profiles!quiz_attempts_student_id_fkey (id, full_name, email)
        `)
        .eq('id', attemptId)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Quiz attempt not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(data)
    }

    // Get attempts by quiz
    if (quizId) {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          profiles!quiz_attempts_student_id_fkey (id, full_name, email)
        `)
        .eq('quiz_id', quizId)
        .order('attempted_at', { ascending: false })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch quiz attempts' },
          { status: 500 }
        )
      }

      return NextResponse.json(data)
    }

    // Get attempts by student
    if (studentId) {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quizzes (*)
        `)
        .eq('student_id', studentId)
        .order('attempted_at', { ascending: false })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch quiz attempts' },
          { status: 500 }
        )
      }

      return NextResponse.json(data)
    }

    // Get all attempts (admin)
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select(`
        *,
        quizzes (*),
        profiles!quiz_attempts_student_id_fkey (id, full_name, email)
      `)
      .order('attempted_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch quiz attempts' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Quiz attempts API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch quiz attempts' },
      { status: 500 }
    )
  }
}

// POST - Submit quiz attempt
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
    const supabaseUserId = generateUserIdFromClerkId(clerkId)
    const body = await request.json()
    const { quizId, answers } = body

    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      )
    }

    // Get quiz and questions
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single()

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('question_order', { ascending: true })

    if (questionsError) {
      return NextResponse.json(
        { error: 'Failed to fetch quiz questions' },
        { status: 500 }
      )
    }

    // Calculate score
    let correctAnswers = 0
    let totalPoints = 0
    let earnedPoints = 0

    questions.forEach((question: any) => {
      totalPoints += question.points || 1
      const userAnswer = answers[question.id]
      if (userAnswer === question.correct_answer) {
        correctAnswers++
        earnedPoints += question.points || 1
      }
    })

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
    const passed = score >= (quiz.passing_score || 70)

    // Create attempt
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        student_id: supabaseUserId,
        quiz_id: quizId,
        answers: answers,
        score: score,
        passed: passed,
        time_taken: body.timeTaken || 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating quiz attempt:', error)
      return NextResponse.json(
        { error: 'Failed to submit quiz', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      attempt: data,
      score,
      correctAnswers,
      totalQuestions: questions.length,
      passed
    })
  } catch (error: any) {
    console.error('Submit quiz error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit quiz' },
      { status: 500 }
    )
  }
}

