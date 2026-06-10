import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Advanced Keyword-Based Intent Engine (Free Tier)
export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    const lowerMsg = message.toLowerCase()

    let reply = "I'm still learning! While I might not understand that specific question, I can help you find your [Dashboard](/student/dashboard), check your [Schedule](/student/schedule), or answer basic RTO questions like 'what is the speed limit?'"

    // -----------------------------------------------------
    // 1. PLATFORM NAVIGATION INTENTS
    // -----------------------------------------------------
    if (lowerMsg.match(/(dashboard|home|progress|analysis|stats|how am i doing)/)) {
      reply = "I can take you straight to your progress dashboard! Click here: [View My Dashboard](/student/dashboard)"
    }
    else if (lowerMsg.match(/(test|exam|mock|rto exam|quiz)/)) {
      reply = "Ready to test your knowledge? You can take a full Mock RTO Exam or review flashcards here: [Take Mock Exam](/student/rto) or [View Flashcards](/student/flashcards)"
    }
    else if (lowerMsg.match(/(flashcard|flash cards|study|learn|theory)/)) {
      reply = "Our interactive 3D flashcards are the best way to study for the theory test! [Study Flashcards](/student/flashcards)"
    }
    else if (lowerMsg.match(/(schedule|booking|class|session|time|instructor|who is my instructor)/)) {
      reply = "You can view your assigned instructor, your daily fixed batch time, and your 21-day syllabus timeline here: [View My Schedule](/student/schedule)"
    }
    else if (lowerMsg.match(/(leaderboard|rank|xp|points|compete|score)/)) {
      reply = "Want to see how you stack up against other cadets? Check out the global rankings! [View Leaderboard](/student/leaderboard)"
    }
    else if (lowerMsg.match(/(certificate|graduate|completion|download|pdf)/)) {
      reply = "Once you complete your 21-day course and pass the mock exams, you can generate your official certificate here: [Get Certificate](/student/certificate)"
    }
    else if (lowerMsg.match(/(profile|settings|password|avatar|change name)/)) {
      reply = "You can update your personal details and app settings in your profile: [Edit Profile](/student/profile)"
    }
    else if (lowerMsg.match(/(simulator|simulation|game|drive online)/)) {
      reply = "Practice your clutch control, steering, and parking in our interactive HTML simulators before getting in the real car! [Start Simulators](/student/simulations)"
    }

    // -----------------------------------------------------
    // 2. RTO & DRIVING KNOWLEDGE BASE
    // -----------------------------------------------------
    else if (lowerMsg.match(/(speed limit|how fast)/)) {
      if (lowerMsg.includes('highway') || lowerMsg.includes('expressway')) {
        reply = "On Indian National Highways, the maximum speed limit for cars is generally 100 km/h, and on Expressways it is 120 km/h. Always look for local signs!"
      } else {
        reply = "In most Indian cities, the speed limit for cars (LMV) is 50 km/h unless otherwise posted. Near schools and hospitals, it drops to 25 km/h."
      }
    }
    else if (lowerMsg.match(/(yellow line|double yellow)/)) {
      reply = "A double solid yellow line means you are STRICTLY PROHIBITED from crossing or straddling the line to overtake. It is used on dangerous two-way roads."
    }
    else if (lowerMsg.match(/(stop sign|red sign|octagon)/)) {
      reply = "A stop sign is the only octagonal red sign! You must come to a COMPLETE stop at the stop line, check for traffic, and only proceed when safe."
    }
    else if (lowerMsg.match(/(u turn|uturn|u-turn)/)) {
      reply = "U-turns are prohibited on highways, near curves, and where a 'No U-Turn' sign is present. Always check your mirrors and blind spots before executing one."
    }
    else if (lowerMsg.match(/(roundabout|circle|traffic circle)/)) {
      reply = "At a roundabout, traffic already IN the circle has the right of way. You must yield to vehicles coming from your right before entering."
    }
    else if (lowerMsg.match(/(clutch|stall|engine off)/)) {
      reply = "To prevent stalling, slowly lift the clutch to the 'bite point' while gently pressing the accelerator. If you lift the clutch too fast, the engine will die!"
    }
    else if (lowerMsg.match(/(drink|drunk|alcohol)/)) {
      reply = "The legal blood alcohol limit in India is 0.03% (30mg per 100ml of blood). However, the best rule is ZERO alcohol when driving. Don't drink and drive!"
    }
    else if (lowerMsg.match(/(overtake|pass a car)/)) {
      reply = "In India (left-hand traffic), you should generally overtake from the RIGHT side. Never overtake on blind curves, bridges, or solid white/yellow lines."
    }
    else if (lowerMsg.match(/(seat belt|seatbelt)/)) {
      reply = "Wearing a seatbelt is mandatory for ALL passengers (front and rear) in a car. It reduces the risk of fatal injury in a crash by up to 50%!"
    }

    // -----------------------------------------------------
    // 3. CONVERSATIONAL
    // -----------------------------------------------------
    else if (lowerMsg.match(/^(hi|hello|hey|greetings)/)) {
      reply = "Hello there! 👋 I'm the Sri Guru Driving School assistant. I can guide you around the app or answer any questions you have about driving rules. What can I help you with?"
    }
    else if (lowerMsg.match(/(thank you|thanks|thx)/)) {
      reply = "You're very welcome! Drive safe! 🚗"
    }
    else if (lowerMsg.match(/(who are you|what are you|bot or human)/)) {
      reply = "I am an AI assistant built specifically for the Driving School! I know everything about the RTO handbook and where to find things in this app."
    }

    // Add a slight delay to simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 600))

    return NextResponse.json({ reply })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
