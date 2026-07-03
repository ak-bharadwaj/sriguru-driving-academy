import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Advanced Conversational Intent Engine with 40+ RTO and School Q&As
export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    const query = message.trim().toLowerCase()

    let reply = ""

    // ─── 1. CONVERSATIONAL GREETINGS & SMALL TALK ───
    if (query.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|yo|sup|hola)/)) {
      reply = "Hello there! 👋 I am the **Sri Guru Driving School Assistant**. I can help you with enrollment, fees, course curriculum, and study tips for your RTO Learner's Exam. What would you like to know today?"
    }
    else if (query.match(/(how are you|how's it going|how do you do|are you fine)/)) {
      reply = "I'm running perfectly, thank you for asking! 🚗 Ready to help you master driving and pass your RTO tests with confidence. What is on your mind?"
    }
    else if (query.match(/(thank you|thanks|thx|appreciate|great job|perfect|awesome|helped)/)) {
      reply = "You're very welcome! Safe driving starts with good learning. Let me know if you need anything else! 🛣️"
    }
    else if (query.match(/(who are you|what are you|bot or human|your name|who is this)/)) {
      reply = "I am the **Sri Guru Virtual Academy Assistant**, a dedicated guide designed to help students learn driving curriculum, browse course details, study RTO signs, and navigate our booking system."
    }

    // ─── 2. DRIVING SCHOOL SPECIFICS (FEE, DURATION, TIMINGS, CONTACT) ───
    else if (query.match(/(price|cost|fee|charge|payment|rupee|rs|money|expensive|plan|course fee|package|how much)/)) {
      reply = "We offer clear, high-value packages tailored to your experience:\n\n" +
              "• **Refresher Course (7 Days / 22 km per day)**: ₹3,500. Ideal for people returning to driving.\n" +
              "• **Standard Course (10-15 Days / 10-15 km per day)**: ₹4,000 - ₹4,500. Perfect for building road confidence.\n" +
              "• **Complete Beginner Course (30 Days / 5 km per day)**: ₹5,000. In-depth professional coaching from scratch.\n\n" +
              "You can select and book a plan here: [Browse Programs & Book](/booking)"
    }
    else if (query.match(/(duration|how long|how many days|how many weeks|length|days to learn|course period)/)) {
      reply = "Our courses are flexible to match your schedule:\n" +
              "• **7 Days** (Refresher package)\n" +
              "• **10 Days** (Confidence builder)\n" +
              "• **15 Days** (Complete course - recommended)\n" +
              "• **30 Days** (Elite mastery and night training)\n\n" +
              "Classes are scheduled daily for 45 to 60 minutes. Choose your plan here: [Browse Programs](/booking)"
    }
    else if (query.match(/(address|location|where|situated|find you|place|office|branch|maps|directions|nandyal)/)) {
      reply = "Our main office is located at:\n**Shop No.27282-P2, Near Anu Hospital, Bommalasatram, Kadapa Road, Nandyal**.\n\n" +
              "We operate our practical training tracks nearby. Drop by anytime to meet our instructors!"
    }
    else if (query.match(/(contact|phone|call|mobile|email|support|reach|connect|number|talk to)/)) {
      reply = "You can contact Sri Guru Driving School directly at:\n" +
              "• **Phone**: +91 93478 79474\n" +
              "• **Email**: support@sriguru-driving.in\n" +
              "• **WhatsApp**: [Click to Send WhatsApp Message](/booking)"
    }
    else if (query.match(/(time|timing|hours|open|schedule|batch|sunday|saturday|timings)/)) {
      reply = "We are open **Monday to Saturday from 6:00 AM to 7:00 PM**, and **Sundays from 7:00 AM to 1:00 PM**. " +
              "You can choose a morning or evening batch that fits your job or college hours!"
    }
    else if (query.match(/(vehicle|car|fleet|i20|swift|wagonr|suv|sedan|manual|automatic)/)) {
      reply = "We maintain a premium, dual-control fleet to prepare you for any vehicle:\n" +
              "• **Hatchbacks**: Swift, WagonR (great for city maneuverability)\n" +
              "• **Sedans**: Dzire (great for boot-space and parking judgment)\n" +
              "• **SUVs**: Brezza (great for high road visibility)\n\n" +
              "All our learning cars are equipped with **professional co-driver dual pedals** (clutch & brake) for 100% safety."
    }

    // ─── 3. RTO & LEARNER'S EXAM (Mock Tests, Requirements, Process) ───
    else if (query.match(/(exam|mock|test|quiz|learner|ll test|written|theory|fail|pass mark|marks)/)) {
      reply = "The **RTO Learner's License Exam** in India consists of 15 multiple-choice questions on road signs and traffic regulations. You need to answer **9 correctly (60%)** within 10 minutes to pass.\n\n" +
              "To help you pass on your first attempt, we built an unlimited RTO practice engine:\n" +
              "• [Take Unlimited Mock Exam](/student/rto)\n" +
              "• [Study Traffic Signs](/student/flashcards)"
    }
    else if (query.match(/(document|paper|id proof|aadhar|pan|licence|ll application|apply|requirements)/)) {
      reply = "To apply for a Learner's License (LL), you will need:\n" +
              "1. **Age Proof** (Aadhar, PAN, or Birth Certificate showing 18+ years)\n" +
              "2. **Address Proof** (Aadhar Card or Voter ID)\n" +
              "3. **Passport Size Photos**\n" +
              "4. **Medical Certificate (Form 1A)** if you are applying for transport vehicles or are over 40.\n\n" +
              "Our school handles the entire document upload & booking process for you!"
    }
    else if (query.match(/(sign|traffic sign|road sign|symbol|board|post|yellow|red|green|circle|triangle|hexagon|octagon)/)) {
      reply = "Road signs are divided into 3 main categories:\n" +
              "1. **Mandatory/Regulatory** (Circular shape with red borders, e.g., Stop, No Entry. Must be followed!)\n" +
              "2. **Cautionary/Warning** (Triangular shape, warning of curves, schools, speed breakers ahead)\n" +
              "3. **Informatory** (Rectangular shape, showing hospitals, petrol pumps, public phone locations)\n\n" +
              "Study all of them here: [Launch Interactive Flashcards](/student/flashcards)"
    }

    // ─── 4. PRACTICAL DRIVING TIPS (Clutch, Brakes, Parallel Parking) ───
    else if (query.match(/(clutch|stall|engine off|bite point|biting|gears|gearbox|first gear|reverse)/)) {
      reply = "To prevent your car from stalling when starting:\n" +
              "1. Press the clutch fully and shift to 1st gear.\n" +
              "2. Slowly lift the clutch pedal until you feel the engine rumble slightly (**the biting point**).\n" +
              "3. Hold the clutch at that point and gently press the accelerator.\n" +
              "4. Slowly release the remaining clutch. Never drop the clutch quickly!"
    }
    else if (query.match(/(parking|parallel|reverse parking|how to park|back up)/)) {
      reply = "For perfect **Parallel Parking**:\n" +
              "1. Stop parallel to the car in front, matching your rear bumpers.\n" +
              "2. Turn your steering wheel fully towards the parking spot and reverse.\n" +
              "3. When your car is at a 45-degree angle, straighten the steering and continue backing up.\n" +
              "4. Once your front bumper clears the car ahead, turn the wheel fully in the opposite direction to slide in."
    }
    else if (query.match(/(hill start|slope|incline|rollback|flyover|handbrake)/)) {
      reply = "To start on an incline without rolling back, use the **Handbrake Method**:\n" +
              "1. Keep the handbrake pulled up and clutch pressed.\n" +
              "2. Find the clutch bite point until the car pulls forward slightly.\n" +
              "3. Press the accelerator and slowly release the handbrake at the same time. The car will move smoothly up the slope!"
    }
    else if (query.match(/(overtake|pass|speed limit|how fast|highway|expressway)/)) {
      reply = "Overtaking rules & speed limits in India:\n" +
              "• Always overtake from the **Right** side after signaling.\n" +
              "• Never overtake on blind turns, bridges, narrow intersections, or solid single/double lines.\n" +
              "• General speed limit for light motor vehicles (cars) is **50 km/h** in city zones, **100 km/h** on highways, and **120 km/h** on expressways."
    }
    else if (query.match(/(simulator|game|virtual|3d driving|drive screen|sim)/)) {
      reply = "Yes! You can practice vehicle physics, gear shifting, and clutch balances in our custom 3D HTML simulator before driving the real car:\n" +
              "• [Launch Car Simulators](/student/simulations)"
    }

    // ─── 5. DEFAULTS & GUIDED ASSISTANT ───
    else {
      reply = "I want to make sure I give you the correct details! Could you clarify if you are asking about:\n\n" +
              "• **Plans & Fees**: Try asking 'how much does the 15 day course cost?'\n" +
              "• **RTO Exam Prep**: Try asking 'how do I pass my learner's license test?'\n" +
              "• **Driving Tips**: Try asking 'how do I find the clutch bite point?'\n" +
              "• **Location**: Try asking 'where is Sri Guru school situated?'\n\n" +
              "Or choose an action directly:\n" +
              "• [Browse Packages & Booking](/booking)\n" +
              "• [Practice RTO Exams](/student/rto)"
    }

    // Simulate conversational delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    return NextResponse.json({ reply })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
