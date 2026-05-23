const fs = require('fs');
const path = './lib/data/rto-data.ts';
let content = fs.readFileSync(path, 'utf8');

const regex = /export const QUIZ_QUESTIONS: QuizQuestionItem\[\] = \[[\s\S]*?\];/;

const newQuiz = `export const QUIZ_QUESTIONS: QuizQuestionItem[] = [
  {
    id: "q1",
    question: "According to the Rules of the Road, which side of the road must you strictly keep to while driving?",
    options: ["Right side", "Left side", "Center of the road", "Whichever side has less traffic"],
    correctIndex: 1,
    explanation: "Under the Rules of the Road Regulations, drivers must drive as close to the left side of the road as possible.",
    topic: "General Rules"
  },
  {
    id: "q2",
    question: "When overtaking another vehicle, on which side should you generally pass?",
    options: ["On the left side", "On the right side", "Any side that is clear", "Overtaking is not allowed"],
    correctIndex: 1,
    explanation: "You must always overtake a vehicle from its right side, unless the vehicle in front is making a right turn.",
    topic: "Overtaking"
  },
  {
    id: "q3",
    question: "At an uncontrolled intersection, to whom must you give way?",
    options: ["Vehicles approaching from the left", "Vehicles approaching from the right", "Larger vehicles only", "No one, first come first serve"],
    correctIndex: 1,
    explanation: "When entering an intersection where there is no traffic light or police officer, you must give way to traffic approaching from your right.",
    topic: "Right of Way"
  },
  {
    id: "q4",
    question: "What must you do when an emergency vehicle (like an ambulance or fire engine) approaches with its siren on?",
    options: ["Speed up to stay ahead of it", "Continue at the same speed", "Pull over to the left side and allow it a free passage", "Stop immediately wherever you are"],
    correctIndex: 2,
    explanation: "Every driver must draw their vehicle to the left side of the road and allow free passage to emergency vehicles.",
    topic: "Emergency Vehicles"
  },
  {
    id: "q5",
    question: "Taking a U-Turn is strictly prohibited in which of the following areas?",
    options: ["Empty straight roads", "Near hospitals", "Busy roads, curves, and near traffic signals", "On all one-way streets only"],
    correctIndex: 2,
    explanation: "U-Turns should never be taken on a curve, near a traffic signal, or on a busy road where it could endanger other traffic.",
    topic: "Turning"
  },
  {
    id: "q6",
    question: "Parking a vehicle is completely prohibited:",
    options: ["In front of a private driveway", "On the left side of a highway", "At road crossings, bridges, and near traffic lights", "Inside a designated parking lot"],
    correctIndex: 2,
    explanation: "Parking at road crossings, on bridges, or near traffic lights obstructs the flow of traffic and is illegal.",
    topic: "Parking"
  },
  {
    id: "q7",
    question: "When approaching an unmarked Pedestrian Crossing, what is the correct action?",
    options: ["Sound horn and proceed quickly", "Slow down, prepare to stop, and give way to pedestrians", "Bypass the crossing from the wrong side", "Maintain speed if pedestrians are far away"],
    correctIndex: 1,
    explanation: "Pedestrians have the absolute right of way at pedestrian crossings. You must slow down and stop if necessary.",
    topic: "Pedestrians"
  },
  {
    id: "q8",
    question: "When is the use of a vehicle's horn completely prohibited?",
    options: ["During the night", "Near hospitals, courts, and designated 'Silent Zones'", "When overtaking", "On expressways"],
    correctIndex: 1,
    explanation: "Blowing a horn near hospitals, courts of law, and other areas marked as 'Silent Zones' is strictly punishable.",
    topic: "Noise Pollution"
  },
  {
    id: "q9",
    question: "What does a solid single or double yellow line in the center of the road mean?",
    options: ["Overtaking is allowed with caution", "You can park on the line", "Overtaking and crossing the line is strictly prohibited", "It indicates a one-way street"],
    correctIndex: 2,
    explanation: "A solid yellow line indicates a strict no-passing zone. You must not cross it to overtake another vehicle.",
    topic: "Road Markings"
  },
  {
    id: "q10",
    question: "Who has the right of way when two vehicles enter an uncontrolled roundabout?",
    options: ["The vehicle entering the roundabout", "The vehicle that is already circulating inside the roundabout", "The larger vehicle", "The faster vehicle"],
    correctIndex: 1,
    explanation: "Vehicles already circulating within the roundabout always have the right of way over vehicles trying to enter it.",
    topic: "Roundabouts"
  }
];`;

content = content.replace(regex, newQuiz);
fs.writeFileSync(path, content, 'utf8');
console.log("Updated QUIZ_QUESTIONS strictly based on AP Transport Rules of the Road");
