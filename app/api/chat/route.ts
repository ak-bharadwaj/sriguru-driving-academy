import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Advanced Keyword-Based Intent Engine (Free Tier)
export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    const lowerMsg = message.toLowerCase()

    let reply = "I'm still learning! While I might not understand that specific question, I can help you find your [Dashboard](/student/dashboard), check your [Schedule](/student/schedule), or answer basic RTO questions like 'what is the speed limit?'"

    // -----------------------------------------------------
    // 1. DRIVING SCHOOL INFO & INQUIRIES
    // -----------------------------------------------------
    if (lowerMsg.match(/(address|location|where|situated|find you|place|office|branch|maps|directions)/)) {
      reply = "Sri Guru Driving School is located at: **Shop No.27282-P2, Near Anu Hospital, Bommalasatram, Kadapa Road, Nandyal**. Come visit our office to get started!"
    }
    else if (lowerMsg.match(/(contact|phone|call|mobile|email|support|reach|connect|number|talk to)/)) {
      reply = "You can reach us directly! Phone: **+91 98765 43210**, Email: **support@sriguru.in**. We are happy to help you with any questions!"
    }
    else if (lowerMsg.match(/(price|cost|fee|charge|payment|rupee|rs|money|expensive|plan|course fee|package)/)) {
      reply = "Our training courses start from ₹3,000 depending on the level (Beginner, Refresher, or Advanced). You can view full details and book a plan here: [Browse Programs & Fees](/booking)"
    }
    else if (lowerMsg.match(/(duration|how long|how many days|how many weeks|duration of course|length|days to learn)/)) {
      reply = "Our standard curriculum is a highly structured **21-day program** designed to take you from a complete beginner to a confident, certified driver. We also offer custom refresher courses!"
    }
    else if (lowerMsg.match(/(enroll|join|register|sign up|book|admission|start class|how to start)/)) {
      reply = "Enrolling is easy! You can book a trial class or select a program directly from our booking page: [Book My Session](/booking). Once registered, you will get portal access immediately."
    }

    // -----------------------------------------------------
    // 2. PLATFORM NAVIGATION INTENTS
    // -----------------------------------------------------
    else if (lowerMsg.match(/(dashboard|home|progress|analysis|stats|how am i doing|my status|my performance|performance|grade|report card|how many points|my points)/)) {
      reply = "I can take you straight to your progress dashboard! Click here: [View My Dashboard](/student/dashboard)"
    }
    else if (lowerMsg.match(/(test|exam|mock|rto exam|quiz|questions|question paper|sample paper|rto test|written test|theory test|learner licence|ll test)/)) {
      reply = "Ready to test your knowledge? You can take a full Mock RTO Exam or review flashcards here: [Take Mock Exam](/student/rto) or [View Flashcards](/student/flashcards)"
    }
    else if (lowerMsg.match(/(flashcard|flash cards|study|learn|theory|road signs|signs|symbols|meanings|traffic signs|rules book)/)) {
      reply = "Our interactive 3D flashcards are the best way to study for the theory test! [Study Flashcards](/student/flashcards)"
    }
    else if (lowerMsg.match(/(schedule|booking|class|session|time|timings|timing|batch|hour|slot|calendar|date|instructor|teacher|coach|trainer|who is my instructor|who is my teacher|when is my class|when is my batch)/)) {
      reply = "You can view your assigned instructor, your daily fixed batch time, and your 21-day syllabus timeline here: [View My Schedule](/student/schedule)"
    }
    else if (lowerMsg.match(/(leaderboard|rank|xp|points|compete|score|ranking|rankings|who is first|leader board|position)/)) {
      reply = "Want to see how you stack up against other cadets? Check out the global rankings! [View Leaderboard](/student/leaderboard)"
    }
    else if (lowerMsg.match(/(certificate|graduate|completion|download|pdf|certify|licensed|congratulations|reward|pass certificate)/)) {
      reply = "Once you complete your 21-day course and pass the mock exams, you can generate your official certificate here: [Get Certificate](/student/certificate)"
    }
    else if (lowerMsg.match(/(profile|settings|password|avatar|change name|account|my name|edit info|personal details)/)) {
      reply = "You can update your personal details and app settings in your profile: [Edit Profile](/student/profile)"
    }
    else if (lowerMsg.match(/(simulator|simulation|game|drive online|practical test|virtual drive|driving simulator|3d driving|car game)/)) {
      reply = "Practice your clutch control, steering, and parking in our interactive HTML simulators before getting in the real car! [Start Simulators](/student/simulations)"
    }

    // -----------------------------------------------------
    // 3. RTO & DRIVING KNOWLEDGE BASE
    // -----------------------------------------------------
    else if (lowerMsg.match(/(speed limit|how fast|max speed|maximum speed|speed restriction|speed limits|driving speed)/)) {
      if (lowerMsg.includes('highway') || lowerMsg.includes('expressway')) {
        reply = "On Indian National Highways, the maximum speed limit for cars is generally 100 km/h, and on Expressways it is 120 km/h. Always look for local signs!"
      } else {
        reply = "In most Indian cities, the speed limit for cars (LMV) is 50 km/h unless otherwise posted. Near schools and hospitals, it drops to 25 km/h."
      }
    }
    else if (lowerMsg.match(/(yellow line|double yellow|solid line|continuous line|single yellow line|crossing line)/)) {
      reply = "A double solid yellow line means you are STRICTLY PROHIBITED from crossing or straddling the line to overtake. It is used on dangerous two-way roads."
    }
    else if (lowerMsg.match(/(stop sign|red sign|octagon|what is stop|shape of stop)/)) {
      reply = "A stop sign is the only octagonal red sign! You must come to a COMPLETE stop at the stop line, check for traffic, and only proceed when safe."
    }
    else if (lowerMsg.match(/(u turn|uturn|u-turn|turning back|reverse direction)/)) {
      reply = "U-turns are prohibited on highways, near curves, and where a 'No U-Turn' sign is present. Always check your mirrors and blind spots before executing one."
    }
    else if (lowerMsg.match(/(roundabout|circle|traffic circle|rotary|intersection circle)/)) {
      reply = "At a roundabout, traffic already IN the circle has the right of way. You must yield to vehicles coming from your right before entering."
    }
    else if (lowerMsg.match(/(clutch|stall|engine off|engine died|bite point|biting point|clutch control|gears|gear shift)/)) {
      reply = "To prevent stalling, slowly lift the clutch to the 'bite point' while gently pressing the accelerator. If you lift the clutch too fast, the engine will die!"
    }
    else if (lowerMsg.match(/(drink|drunk|alcohol|wine|beer|liquor|driving drunk|drinking)/)) {
      reply = "The legal blood alcohol limit in India is 0.03% (30mg per 100ml of blood). However, the best rule is ZERO alcohol when driving. Don't drink and drive!"
    }
    else if (lowerMsg.match(/(overtake|pass a car|passing|overtaking|pass vehicle)/)) {
      reply = "In India (left-hand traffic), you should generally overtake from the RIGHT side. Never overtake on blind curves, bridges, or solid white/yellow lines."
    }
    else if (lowerMsg.match(/(seat belt|seatbelt|safety belt|seat-belt)/)) {
      reply = "Wearing a seatbelt is mandatory for ALL passengers (front and rear) in a car. It reduces the risk of fatal injury in a crash by up to 50%!"
    }

    // -----------------------------------------------------
    // 4. CONVERSATIONAL
    // -----------------------------------------------------
    else if (lowerMsg.match(/^(hi|hello|hey|greetings|good morning|good afternoon)/)) {
      reply = "Hello there! 👋 I'm the Sri Guru Driving School AI assistant. I can guide you around the app, help with enrollment, or answer RTO driving handbook questions. What can I help you with?"
    }
    else if (lowerMsg.match(/(thank you|thanks|thx|great|awesome|perfect|helped)/)) {
      reply = "You're very welcome! Safe driving! 🚗"
    }
    else if (lowerMsg.match(/(who are you|what are you|bot or human|your name)/)) {
      reply = "I am the Sri Guru Driving School virtual assistant. I know all about the RTO handbook, training schedules, course prices, and location details."
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
