export interface QuizQuestionItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface RoadSignItem {
  name: string;
  category: string;
  meaning: string;
  rule: string;
  imagePath: string;
  signKey: string;
}

export const ROAD_SIGNS_DATA: RoadSignItem[] = [
  { name: 'Stop', category: 'Signs', meaning: 'You must come to a complete halt.', rule: 'Mandatory stop before the line.', imagePath: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Stop_sign_light_red.svg', signKey: 'stop' },
  { name: 'Give Way', category: 'Signs', meaning: 'Yield to traffic on the main road.', rule: 'Give right of way.', imagePath: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Give_way_sign.svg', signKey: 'give_way' },
  { name: 'No Entry', category: 'Signs', meaning: 'Vehicles are prohibited from entering.', rule: 'Do not enter.', imagePath: 'https://upload.wikimedia.org/wikipedia/commons/5/52/No_Entry_sign.svg', signKey: 'no_entry' },
  { name: 'One Way', category: 'Signs', meaning: 'Traffic flows only in one direction.', rule: 'Do not reverse or drive wrong way.', imagePath: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/One_way_traffic_sign.svg', signKey: 'one_way' },
  { name: 'No Parking', category: 'Parking', meaning: 'Do not park your vehicle here.', rule: 'Parking is strictly prohibited.', imagePath: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/No_parking_sign.svg', signKey: 'no_parking' },
  { name: 'Speed Limit 50', category: 'Laws', meaning: 'Maximum speed is 50 km/h.', rule: 'Do not exceed 50 km/h.', imagePath: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Speed_limit_50_sign.svg', signKey: 'speed_50' }
];

export const QUIZ_QUESTIONS: QuizQuestionItem[] = [
  {
    id: "q1",
    question: "Which side of the road must you keep to?",
    options: ["Left", "Right", "Center", "Whichever is clear"],
    correctIndex: 0,
    explanation: "The correct answer is 'Left'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "General Rules"
  },
  {
    id: "q2",
    question: "When overtaking, you should pass from?",
    options: ["Left", "Right", "Either side", "Above"],
    correctIndex: 1,
    explanation: "The correct answer is 'Right'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Overtaking"
  },
  {
    id: "q3",
    question: "At an uncontrolled intersection, who has right of way?",
    options: ["Vehicles from left", "Vehicles from right", "Bigger vehicles", "Faster vehicles"],
    correctIndex: 1,
    explanation: "The correct answer is 'Vehicles from right'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Intersections"
  },
  {
    id: "q4",
    question: "When an emergency vehicle approaches, you must:",
    options: ["Speed up", "Stop immediately", "Pull to the left and stop", "Ignore it"],
    correctIndex: 2,
    explanation: "The correct answer is 'Pull to the left and stop'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Emergency"
  },
  {
    id: "q5",
    question: "U-turns are prohibited:",
    options: ["On empty roads", "Near hospitals", "On busy roads and curves", "In residential areas"],
    correctIndex: 2,
    explanation: "The correct answer is 'On busy roads and curves'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Turning"
  },
  {
    id: "q6",
    question: "Pedestrians at a zebra crossing have:",
    options: ["No rights", "Right of way", "To wait for cars", "To run across"],
    correctIndex: 1,
    explanation: "The correct answer is 'Right of way'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Pedestrians"
  },
  {
    id: "q7",
    question: "When a vehicle approaches from behind to overtake:",
    options: ["Speed up", "Keep left and let it pass", "Block it", "Honk loudly"],
    correctIndex: 1,
    explanation: "The correct answer is 'Keep left and let it pass'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Overtaking"
  },
  {
    id: "q8",
    question: "You are approaching a narrow bridge, another vehicle enters from opposite side:",
    options: ["Enter and force them back", "Wait till they clear the bridge", "Turn on headlights", "Honk and proceed"],
    correctIndex: 1,
    explanation: "The correct answer is 'Wait till they clear the bridge'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Right of Way"
  },
  {
    id: "q9",
    question: "When entering a main road from a side road:",
    options: ["You have right of way", "Main road traffic has right of way", "Honk and enter", "Bigger vehicle goes first"],
    correctIndex: 1,
    explanation: "The correct answer is 'Main road traffic has right of way'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Intersections"
  },
  {
    id: "q10",
    question: "If a vehicle is already in a roundabout:",
    options: ["You must give way to it", "It must give way to you", "Both must stop", "First to honk goes first"],
    correctIndex: 0,
    explanation: "The correct answer is 'You must give way to it'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Roundabouts"
  },
  {
    id: "q11",
    question: "Before taking a right turn, you should:",
    options: ["Stay left", "Move to the center/right", "Speed up", "Turn off engine"],
    correctIndex: 1,
    explanation: "The correct answer is 'Move to the center/right'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Turning"
  },
  {
    id: "q12",
    question: "When is overtaking prohibited?",
    options: ["When road ahead is not clearly visible", "At night", "On a highway", "When raining"],
    correctIndex: 0,
    explanation: "The correct answer is 'When road ahead is not clearly visible'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Overtaking"
  },
  {
    id: "q13",
    question: "What is the rule for tailgating?",
    options: ["Maintain safe distance", "Stay bumper to bumper", "Flash lights constantly", "Drive zigzag"],
    correctIndex: 0,
    explanation: "The correct answer is 'Maintain safe distance'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safe Distance"
  },
  {
    id: "q14",
    question: "When driving on a hill, who has right of way?",
    options: ["Vehicle going downhill", "Vehicle going uphill", "Heavier vehicle", "Faster vehicle"],
    correctIndex: 1,
    explanation: "The correct answer is 'Vehicle going uphill'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Hills"
  },
  {
    id: "q15",
    question: "Overtaking is prohibited near:",
    options: ["A hospital", "A pedestrian crossing", "A police station", "A petrol pump"],
    correctIndex: 1,
    explanation: "The correct answer is 'A pedestrian crossing'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Overtaking"
  },
  {
    id: "q16",
    question: "If you are being overtaken, you should not:",
    options: ["Increase your speed", "Decrease your speed", "Keep to the left", "Look in the mirror"],
    correctIndex: 0,
    explanation: "The correct answer is 'Increase your speed'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Overtaking"
  },
  {
    id: "q17",
    question: "Reversing is prohibited on:",
    options: ["A one-way street", "A highway", "Both", "Neither"],
    correctIndex: 2,
    explanation: "The correct answer is 'Both'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Reversing"
  },
  {
    id: "q18",
    question: "At a blind corner, you must:",
    options: ["Speed up to clear it", "Sound horn and slow down", "Turn off lights", "Overtake"],
    correctIndex: 1,
    explanation: "The correct answer is 'Sound horn and slow down'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Turning"
  },
  {
    id: "q19",
    question: "When two roads cross without a signal:",
    options: ["Stop and wait", "Give way to traffic on your right", "Give way to traffic on your left", "Proceed without stopping"],
    correctIndex: 1,
    explanation: "The correct answer is 'Give way to traffic on your right'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Intersections"
  },
  {
    id: "q20",
    question: "When an animal is on the road:",
    options: ["Sound horn loudly", "Flash lights", "Slow down or stop safely", "Steer around quickly"],
    correctIndex: 2,
    explanation: "The correct answer is 'Slow down or stop safely'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Animals"
  },
  {
    id: "q21",
    question: "A red traffic light means:",
    options: ["Slow down", "Stop", "Proceed with caution", "Go"],
    correctIndex: 1,
    explanation: "The correct answer is 'Stop'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Traffic Lights"
  },
  {
    id: "q22",
    question: "A flashing red traffic light means:",
    options: ["Stop and proceed when safe", "Slow down", "Traffic signal is broken", "Pedestrian crossing"],
    correctIndex: 0,
    explanation: "The correct answer is 'Stop and proceed when safe'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Traffic Lights"
  },
  {
    id: "q23",
    question: "A flashing yellow traffic light means:",
    options: ["Stop", "Slow down and proceed with caution", "Speed up", "Signal broken"],
    correctIndex: 1,
    explanation: "The correct answer is 'Slow down and proceed with caution'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Traffic Lights"
  },
  {
    id: "q24",
    question: "A green arrow with a red light means:",
    options: ["Stop for all directions", "Proceed only in direction of arrow", "Go straight", "Wait for green light"],
    correctIndex: 1,
    explanation: "The correct answer is 'Proceed only in direction of arrow'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Traffic Lights"
  },
  {
    id: "q25",
    question: "Amber light appears after:",
    options: ["Red light", "Green light", "Flashing Red", "Flashing Amber"],
    correctIndex: 1,
    explanation: "The correct answer is 'Green light'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Traffic Lights"
  },
  {
    id: "q26",
    question: "A solid continuous yellow line in the center means:",
    options: ["Overtaking allowed", "No overtaking/crossing", "Parking allowed", "One way"],
    correctIndex: 1,
    explanation: "The correct answer is 'No overtaking/crossing'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Road Markings"
  },
  {
    id: "q27",
    question: "Broken white lines in the center mean:",
    options: ["Overtaking prohibited", "Overtaking allowed if safe", "Parking zone", "Pedestrian crossing"],
    correctIndex: 1,
    explanation: "The correct answer is 'Overtaking allowed if safe'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Road Markings"
  },
  {
    id: "q28",
    question: "Double solid yellow lines mean:",
    options: ["Strictly no passing", "Passing allowed", "Divided highway ends", "Lane merges"],
    correctIndex: 0,
    explanation: "The correct answer is 'Strictly no passing'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Road Markings"
  },
  {
    id: "q29",
    question: "Stop line before an intersection is:",
    options: ["White", "Yellow", "Red", "Blue"],
    correctIndex: 0,
    explanation: "The correct answer is 'White'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Road Markings"
  },
  {
    id: "q30",
    question: "Zebra crossing lines are:",
    options: ["Red and White", "Black and White", "Yellow and Black", "Blue and White"],
    correctIndex: 1,
    explanation: "The correct answer is 'Black and White'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Road Markings"
  },
  {
    id: "q31",
    question: "Mandatory signs are usually:",
    options: ["Triangular", "Circular", "Rectangular", "Octagonal"],
    correctIndex: 1,
    explanation: "The correct answer is 'Circular'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Road Signs"
  },
  {
    id: "q32",
    question: "Cautionary/Warning signs are usually:",
    options: ["Triangular", "Circular", "Rectangular", "Octagonal"],
    correctIndex: 0,
    explanation: "The correct answer is 'Triangular'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Road Signs"
  },
  {
    id: "q33",
    question: "Informatory signs are usually:",
    options: ["Triangular", "Circular", "Rectangular", "Octagonal"],
    correctIndex: 2,
    explanation: "The correct answer is 'Rectangular'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Road Signs"
  },
  {
    id: "q34",
    question: "A stop sign is shaped like an:",
    options: ["Octagon", "Triangle", "Circle", "Square"],
    correctIndex: 0,
    explanation: "The correct answer is 'Octagon'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Road Signs"
  },
  {
    id: "q35",
    question: "Give Way sign is an:",
    options: ["Inverted triangle", "Upright triangle", "Circle", "Hexagon"],
    correctIndex: 0,
    explanation: "The correct answer is 'Inverted triangle'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Road Signs"
  },
  {
    id: "q36",
    question: "Hand signal for stopping:",
    options: ["Right arm raised upward", "Right arm extended horizontally", "Left arm extended", "Waving hand"],
    correctIndex: 0,
    explanation: "The correct answer is 'Right arm raised upward'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Hand Signals"
  },
  {
    id: "q37",
    question: "Hand signal for turning right:",
    options: ["Right arm extended horizontally", "Right arm raised", "Left arm extended", "Waving hand"],
    correctIndex: 0,
    explanation: "The correct answer is 'Right arm extended horizontally'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Hand Signals"
  },
  {
    id: "q38",
    question: "Hand signal for turning left:",
    options: ["Right arm extended horizontally", "Right arm rotated anti-clockwise", "Left arm raised", "Both arms raised"],
    correctIndex: 1,
    explanation: "The correct answer is 'Right arm rotated anti-clockwise'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Hand Signals"
  },
  {
    id: "q39",
    question: "Hand signal to allow overtaking:",
    options: ["Right arm swung forwards and backwards", "Right arm raised", "Left arm extended", "Flash headlights"],
    correctIndex: 0,
    explanation: "The correct answer is 'Right arm swung forwards and backwards'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Hand Signals"
  },
  {
    id: "q40",
    question: "Using indicators instead of hand signals is:",
    options: ["Illegal", "Allowed and preferred", "Only for cars", "Only at night"],
    correctIndex: 1,
    explanation: "The correct answer is 'Allowed and preferred'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Signals"
  },
  {
    id: "q41",
    question: "Speed limit near a school zone is usually:",
    options: ["25 km/h", "50 km/h", "80 km/h", "No limit"],
    correctIndex: 0,
    explanation: "The correct answer is '25 km/h'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Speed Limits"
  },
  {
    id: "q42",
    question: "Driving above the speed limit is:",
    options: ["Allowed if road is empty", "An offence", "Allowed in emergencies", "Encouraged"],
    correctIndex: 1,
    explanation: "The correct answer is 'An offence'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Speed Limits"
  },
  {
    id: "q43",
    question: "When driving in heavy rain, you should:",
    options: ["Increase speed", "Maintain speed", "Reduce speed and increase following distance", "Turn on hazard lights"],
    correctIndex: 2,
    explanation: "The correct answer is 'Reduce speed and increase following distance'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safe Driving"
  },
  {
    id: "q44",
    question: "What is the two-second rule?",
    options: ["Time to start engine", "Safe following distance", "Time to stop at red light", "Time to overtake"],
    correctIndex: 1,
    explanation: "The correct answer is 'Safe following distance'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safe Distance"
  },
  {
    id: "q45",
    question: "Parking is prohibited:",
    options: ["In a parking lot", "On a footpath", "In your garage", "On a side street"],
    correctIndex: 1,
    explanation: "The correct answer is 'On a footpath'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Parking"
  },
  {
    id: "q46",
    question: "You should not park:",
    options: ["Near a fire hydrant", "In an open field", "In a designated zone", "In your driveway"],
    correctIndex: 0,
    explanation: "The correct answer is 'Near a fire hydrant'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Parking"
  },
  {
    id: "q47",
    question: "Parking near a road intersection is:",
    options: ["Allowed", "Prohibited", "Allowed at night", "Allowed for 5 mins"],
    correctIndex: 1,
    explanation: "The correct answer is 'Prohibited'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Parking"
  },
  {
    id: "q48",
    question: "Parking on a bridge is:",
    options: ["Allowed", "Prohibited", "Allowed if bridge is long", "Allowed for two-wheelers"],
    correctIndex: 1,
    explanation: "The correct answer is 'Prohibited'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Parking"
  },
  {
    id: "q49",
    question: "When parking uphill with a curb, turn wheels:",
    options: ["Towards the curb", "Away from the curb", "Straight", "Doesn't matter"],
    correctIndex: 1,
    explanation: "The correct answer is 'Away from the curb'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Parking"
  },
  {
    id: "q50",
    question: "When parking downhill, turn wheels:",
    options: ["Towards the curb", "Away from the curb", "Straight", "Parallel"],
    correctIndex: 0,
    explanation: "The correct answer is 'Towards the curb'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Parking"
  },
  {
    id: "q51",
    question: "Leaving a vehicle in a dangerous position is:",
    options: ["A minor mistake", "A punishable offence", "Allowed if hazards are on", "Allowed for 10 mins"],
    correctIndex: 1,
    explanation: "The correct answer is 'A punishable offence'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Parking"
  },
  {
    id: "q52",
    question: "Before opening your car door on the road:",
    options: ["Check mirrors and blind spots", "Open it quickly", "Honk", "Turn on interior light"],
    correctIndex: 0,
    explanation: "The correct answer is 'Check mirrors and blind spots'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q53",
    question: "Using a mobile phone while driving is:",
    options: ["Allowed if using speaker", "Allowed for texting", "Strictly prohibited", "Allowed in slow traffic"],
    correctIndex: 2,
    explanation: "The correct answer is 'Strictly prohibited'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q54",
    question: "Drinking and driving is:",
    options: ["Allowed up to 3 pegs", "Strictly prohibited", "Allowed at night", "Allowed if eating"],
    correctIndex: 1,
    explanation: "The correct answer is 'Strictly prohibited'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q55",
    question: "The permissible blood alcohol limit in India is:",
    options: ["30mg per 100ml", "50mg per 100ml", "80mg per 100ml", "Zero"],
    correctIndex: 0,
    explanation: "The correct answer is '30mg per 100ml'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Laws"
  },
  {
    id: "q56",
    question: "If dazzled by oncoming headlights at night:",
    options: ["Look to the left side of the road", "Look directly at the lights", "Turn on high beam", "Close your eyes"],
    correctIndex: 0,
    explanation: "The correct answer is 'Look to the left side of the road'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Night Driving"
  },
  {
    id: "q57",
    question: "When driving in fog, use:",
    options: ["High beam headlights", "Low beam headlights or fog lights", "Parking lights only", "No lights"],
    correctIndex: 1,
    explanation: "The correct answer is 'Low beam headlights or fog lights'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Fog Driving"
  },
  {
    id: "q58",
    question: "Hazard warning lights should be used when:",
    options: ["Parked illegally", "Vehicle is stationary/broken down in a hazardous place", "Driving fast", "Towing"],
    correctIndex: 1,
    explanation: "The correct answer is 'Vehicle is stationary/broken down in a hazardous place'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q59",
    question: "Free-wheeling (driving with clutch down or in neutral) is:",
    options: ["Good for fuel", "Dangerous as engine braking is lost", "Required on hills", "Recommended"],
    correctIndex: 1,
    explanation: "The correct answer is 'Dangerous as engine braking is lost'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safe Driving"
  },
  {
    id: "q60",
    question: "When a tyre bursts while driving:",
    options: ["Brake hard immediately", "Hold steering firmly and let vehicle slow down", "Accelerate", "Turn sharply"],
    correctIndex: 1,
    explanation: "The correct answer is 'Hold steering firmly and let vehicle slow down'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Emergencies"
  },
  {
    id: "q61",
    question: "Which document is NOT mandatory to carry while driving?",
    options: ["Driving License", "Registration Certificate", "Passport", "Insurance Certificate"],
    correctIndex: 2,
    explanation: "The correct answer is 'Passport'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Documents"
  },
  {
    id: "q62",
    question: "A learner's license is valid for:",
    options: ["1 month", "6 months", "1 year", "Lifetime"],
    correctIndex: 1,
    explanation: "The correct answer is '6 months'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Licenses"
  },
  {
    id: "q63",
    question: "You can apply for a permanent license after:",
    options: ["10 days of Learner's License", "30 days of Learner's License", "3 months of Learner's License", "Immediately"],
    correctIndex: 1,
    explanation: "The correct answer is '30 days of Learner's License'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Licenses"
  },
  {
    id: "q64",
    question: "Validity of PUC (Pollution Under Control) certificate for a new car is usually:",
    options: ["6 months", "1 year", "3 years", "5 years"],
    correctIndex: 1,
    explanation: "The correct answer is '1 year'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Documents"
  },
  {
    id: "q65",
    question: "Minimum age to drive a transport (commercial) vehicle is:",
    options: ["18 years", "20 years", "21 years", "25 years"],
    correctIndex: 1,
    explanation: "The correct answer is '20 years'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Licenses"
  },
  {
    id: "q66",
    question: "Minimum age to ride a 50cc gearless motorcycle is:",
    options: ["16 years", "18 years", "21 years", "14 years"],
    correctIndex: 0,
    explanation: "The correct answer is '16 years'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Licenses"
  },
  {
    id: "q67",
    question: "Third-party insurance covers:",
    options: ["Damage to your own car", "Damage to the other person's property/life", "Theft of your car", "Engine failure"],
    correctIndex: 1,
    explanation: "The correct answer is 'Damage to the other person's property/life'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Insurance"
  },
  {
    id: "q68",
    question: "Driving without insurance is:",
    options: ["Allowed for 1 month", "A punishable offence", "Allowed for two-wheelers", "Legal"],
    correctIndex: 1,
    explanation: "The correct answer is 'A punishable offence'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Laws"
  },
  {
    id: "q69",
    question: "If involved in an accident causing injury, you must:",
    options: ["Flee the scene", "Take the victim to a hospital and report to police", "Call insurance only", "Move the vehicles immediately"],
    correctIndex: 1,
    explanation: "The correct answer is 'Take the victim to a hospital and report to police'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Accidents"
  },
  {
    id: "q70",
    question: "Hit and run accidents involve:",
    options: ["Crashing into a tree", "Causing an accident and fleeing the scene", "Hitting an animal", "A small scratch"],
    correctIndex: 1,
    explanation: "The correct answer is 'Causing an accident and fleeing the scene'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Accidents"
  },
  {
    id: "q71",
    question: "Number plates must be:",
    options: ["Written in any language", "Written in English/Arabic numerals", "Written in local language only", "Hand painted"],
    correctIndex: 1,
    explanation: "The correct answer is 'Written in English/Arabic numerals'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Rules"
  },
  {
    id: "q72",
    question: "Using a vehicle without a registration mark is:",
    options: ["Illegal", "Allowed for 7 days", "Allowed if new", "Allowed for politicians"],
    correctIndex: 0,
    explanation: "The correct answer is 'Illegal'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Rules"
  },
  {
    id: "q73",
    question: "Tinted glass on vehicles:",
    options: ["Must allow 100% visibility", "Must comply with visual transmission standards", "Is completely banned", "Is fully allowed"],
    correctIndex: 1,
    explanation: "The correct answer is 'Must comply with visual transmission standards'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Rules"
  },
  {
    id: "q74",
    question: "Seatbelts are mandatory for:",
    options: ["Driver only", "Front passengers only", "Driver and all passengers", "Children only"],
    correctIndex: 2,
    explanation: "The correct answer is 'Driver and all passengers'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q75",
    question: "Wearing a helmet is mandatory for:",
    options: ["Rider only", "Pillion rider only", "Both rider and pillion", "Women are exempted everywhere"],
    correctIndex: 2,
    explanation: "The correct answer is 'Both rider and pillion'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q76",
    question: "A police officer in uniform asks for your documents:",
    options: ["You must produce them", "You can refuse", "You can show them later", "You must run"],
    correctIndex: 0,
    explanation: "The correct answer is 'You must produce them'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Laws"
  },
  {
    id: "q77",
    question: "If your license is suspended:",
    options: ["You can drive in another state", "You cannot drive any vehicle", "You can drive two-wheelers", "You can drive with an 'L' board"],
    correctIndex: 1,
    explanation: "The correct answer is 'You cannot drive any vehicle'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Laws"
  },
  {
    id: "q78",
    question: "An 'L' board must be displayed:",
    options: ["By all drivers", "By learner license holders", "By heavy vehicles", "By ladies"],
    correctIndex: 1,
    explanation: "The correct answer is 'By learner license holders'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Rules"
  },
  {
    id: "q79",
    question: "The color of an 'L' board is:",
    options: ["Red letter on white background", "Black letter on yellow background", "White letter on red background", "Red letter on yellow background"],
    correctIndex: 0,
    explanation: "The correct answer is 'Red letter on white background'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Rules"
  },
  {
    id: "q80",
    question: "Carrying more passengers than the permitted seating capacity is:",
    options: ["Allowed in rural areas", "An offence", "Allowed for short distances", "Allowed if they are children"],
    correctIndex: 1,
    explanation: "The correct answer is 'An offence'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Rules"
  },
  {
    id: "q81",
    question: "When an ambulance is approaching:",
    options: ["Do not yield", "Yield right of way by moving left", "Follow it closely", "Race it"],
    correctIndex: 1,
    explanation: "The correct answer is 'Yield right of way by moving left'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Emergency"
  },
  {
    id: "q82",
    question: "You should not sound your horn:",
    options: ["To warn of danger", "At a blind corner", "Near a hospital", "During the day"],
    correctIndex: 2,
    explanation: "The correct answer is 'Near a hospital'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Rules"
  },
  {
    id: "q83",
    question: "If a blind person with a white cane is crossing:",
    options: ["Honk to warn them", "Bypass them quickly", "Stop and wait for them to cross", "Shout at them"],
    correctIndex: 2,
    explanation: "The correct answer is 'Stop and wait for them to cross'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Pedestrians"
  },
  {
    id: "q84",
    question: "When you see a 'Stop' sign, you must:",
    options: ["Slow down", "Stop completely before the line", "Stop only if traffic is coming", "Honk and go"],
    correctIndex: 1,
    explanation: "The correct answer is 'Stop completely before the line'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Signs"
  },
  {
    id: "q85",
    question: "If you meet a procession on the road:",
    options: ["Drive through it", "Sound horn continuously", "Wait for it to pass or take another route", "Overtake them quickly"],
    correctIndex: 2,
    explanation: "The correct answer is 'Wait for it to pass or take another route'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Rules"
  },
  {
    id: "q86",
    question: "Overtaking is prohibited on:",
    options: ["A straight road", "A bridge or narrow road", "A multi-lane highway", "A one-way street"],
    correctIndex: 1,
    explanation: "The correct answer is 'A bridge or narrow road'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Overtaking"
  },
  {
    id: "q87",
    question: "The term 'Blind Spot' refers to:",
    options: ["Areas not visible in the mirrors", "Driving at night", "Foggy weather", "Tinted windows"],
    correctIndex: 0,
    explanation: "The correct answer is 'Areas not visible in the mirrors'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q88",
    question: "To check blind spots, you must:",
    options: ["Look in the rearview mirror", "Look in the side mirrors", "Turn your head and look over your shoulder", "Use a reverse camera"],
    correctIndex: 2,
    explanation: "The correct answer is 'Turn your head and look over your shoulder'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q89",
    question: "Before starting a vehicle, you should:",
    options: ["Rev the engine", "Check mirrors, seat, and seatbelt", "Turn on the radio", "Sound the horn"],
    correctIndex: 1,
    explanation: "The correct answer is 'Check mirrors, seat, and seatbelt'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q90",
    question: "Aquaplaning or hydroplaning occurs when:",
    options: ["Tyres lose contact with the road due to water", "Driving in snow", "Engine overheats", "Brakes fail"],
    correctIndex: 0,
    explanation: "The correct answer is 'Tyres lose contact with the road due to water'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Driving Conditions"
  },
  {
    id: "q91",
    question: "When driving down a steep hill, you should:",
    options: ["Put the car in neutral", "Turn off the engine", "Use a lower gear", "Use only the handbrake"],
    correctIndex: 2,
    explanation: "The correct answer is 'Use a lower gear'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Hills"
  },
  {
    id: "q92",
    question: "What is engine braking?",
    options: ["Using brakes to stop engine", "Using lower gears to slow the vehicle", "Engine failure", "Braking suddenly"],
    correctIndex: 1,
    explanation: "The correct answer is 'Using lower gears to slow the vehicle'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Driving Tech"
  },
  {
    id: "q93",
    question: "If your brakes fail, you should NOT:",
    options: ["Pump the brake pedal", "Use the handbrake carefully", "Turn off the ignition immediately", "Shift to a lower gear"],
    correctIndex: 2,
    explanation: "The correct answer is 'Turn off the ignition immediately'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Emergencies"
  },
  {
    id: "q94",
    question: "When towing another vehicle, the maximum speed is usually:",
    options: ["25 km/h", "50 km/h", "80 km/h", "No limit"],
    correctIndex: 0,
    explanation: "The correct answer is '25 km/h'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Towing"
  },
  {
    id: "q95",
    question: "The distance between the towing vehicle and towed vehicle should not exceed:",
    options: ["5 meters", "10 meters", "15 meters", "20 meters"],
    correctIndex: 0,
    explanation: "The correct answer is '5 meters'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Towing"
  },
  {
    id: "q96",
    question: "A vehicle with a red flashing beacon indicates:",
    options: ["A VIP", "An emergency/police/fire vehicle", "A slow moving vehicle", "A broken down vehicle"],
    correctIndex: 1,
    explanation: "The correct answer is 'An emergency/police/fire vehicle'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Vehicles"
  },
  {
    id: "q97",
    question: "A yellow flashing beacon indicates:",
    options: ["Police", "Ambulance", "A construction or maintenance vehicle", "Fire engine"],
    correctIndex: 2,
    explanation: "The correct answer is 'A construction or maintenance vehicle'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Vehicles"
  },
  {
    id: "q98",
    question: "If you feel drowsy while driving:",
    options: ["Drink coffee and continue", "Open windows", "Stop safely and take a rest", "Turn up the radio"],
    correctIndex: 2,
    explanation: "The correct answer is 'Stop safely and take a rest'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q99",
    question: "Driver's reaction time is affected by:",
    options: ["Good weather", "Alcohol, drugs, and fatigue", "Wearing seatbelts", "Listening to music"],
    correctIndex: 1,
    explanation: "The correct answer is 'Alcohol, drugs, and fatigue'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q100",
    question: "Exhaust noise should be controlled by:",
    options: ["Using a loud horn", "A proper silencer", "Driving slowly", "Turning off engine at signals"],
    correctIndex: 1,
    explanation: "The correct answer is 'A proper silencer'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Pollution"
  },
  {
    id: "q101",
    question: "When approaching a railway crossing without barriers:",
    options: ["Cross quickly", "Stop, look both ways, and cross if safe", "Sound horn and cross", "Follow the car ahead closely"],
    correctIndex: 1,
    explanation: "The correct answer is 'Stop, look both ways, and cross if safe'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Railways"
  },
  {
    id: "q102",
    question: "If a vehicle stalls on a railway crossing:",
    options: ["Leave it and run", "Try to push it clear or warn trains", "Sit inside and call police", "Lock it"],
    correctIndex: 1,
    explanation: "The correct answer is 'Try to push it clear or warn trains'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Emergencies"
  },
  {
    id: "q103",
    question: "You should dim your headlights at night when:",
    options: ["Driving in a city with streetlights", "Following a vehicle or facing oncoming traffic", "It rains", "Driving on a highway"],
    correctIndex: 1,
    explanation: "The correct answer is 'Following a vehicle or facing oncoming traffic'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Night Driving"
  },
  {
    id: "q104",
    question: "High beam headlights should be used:",
    options: ["In fog", "On unlit roads with no oncoming traffic", "In heavy traffic", "During the day"],
    correctIndex: 1,
    explanation: "The correct answer is 'On unlit roads with no oncoming traffic'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Night Driving"
  },
  {
    id: "q105",
    question: "A 'No Entry' sign means:",
    options: ["You can enter if empty", "All vehicles are prohibited from entering", "Only heavy vehicles prohibited", "Entry allowed for locals"],
    correctIndex: 1,
    explanation: "The correct answer is 'All vehicles are prohibited from entering'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Signs"
  },
  {
    id: "q106",
    question: "A 'One Way' sign means:",
    options: ["Traffic flows in both directions", "You must not reverse", "Traffic flows in one direction only", "Only one car at a time"],
    correctIndex: 2,
    explanation: "The correct answer is 'Traffic flows in one direction only'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Signs"
  },
  {
    id: "q107",
    question: "A 'No Parking' sign means:",
    options: ["You can stop to drop passengers", "You cannot stop at all", "You can park for 5 minutes", "You can park two-wheelers"],
    correctIndex: 0,
    explanation: "The correct answer is 'You can stop to drop passengers'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Signs"
  },
  {
    id: "q108",
    question: "A 'No Stopping or Standing' sign means:",
    options: ["You can drop passengers", "You cannot halt your vehicle at all", "You can wait inside the car", "You can park"],
    correctIndex: 1,
    explanation: "The correct answer is 'You cannot halt your vehicle at all'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Signs"
  },
  {
    id: "q109",
    question: "A 'Compulsory Turn Left' sign means:",
    options: ["You may go straight", "You must turn left", "Left turn is prohibited", "Left turn is optional"],
    correctIndex: 1,
    explanation: "The correct answer is 'You must turn left'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Signs"
  },
  {
    id: "q110",
    question: "A 'Yield' or 'Give Way' sign means:",
    options: ["You have right of way", "Stop completely", "Give way to traffic on the intersecting road", "Speed up"],
    correctIndex: 2,
    explanation: "The correct answer is 'Give way to traffic on the intersecting road'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Signs"
  },
  {
    id: "q111",
    question: "A rectangular blue sign with a 'P' and a car indicates:",
    options: ["No parking for cars", "Parking for cars only", "Petrol pump", "Police station"],
    correctIndex: 1,
    explanation: "The correct answer is 'Parking for cars only'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Signs"
  },
  {
    id: "q112",
    question: "A blue circular sign with a white bicycle means:",
    options: ["No bicycles", "Compulsory cycle track", "Bicycle shop", "Beware of bicycles"],
    correctIndex: 1,
    explanation: "The correct answer is 'Compulsory cycle track'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Signs"
  },
  {
    id: "q113",
    question: "If you hit an unattended parked car, you must:",
    options: ["Drive away", "Leave a note with your contact details", "Wait 5 minutes then leave", "Sound horn"],
    correctIndex: 1,
    explanation: "The correct answer is 'Leave a note with your contact details'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Accidents"
  },
  {
    id: "q114",
    question: "What should you do if your accelerator pedal gets stuck?",
    options: ["Turn off ignition immediately", "Shift to neutral and brake safely", "Pull the handbrake hard", "Jump out"],
    correctIndex: 1,
    explanation: "The correct answer is 'Shift to neutral and brake safely'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Emergencies"
  },
  {
    id: "q115",
    question: "What is the safe way to negotiate a curve?",
    options: ["Brake hard inside the curve", "Slow down before the curve, accelerate smoothly out", "Coast in neutral", "Overtake in the curve"],
    correctIndex: 1,
    explanation: "The correct answer is 'Slow down before the curve, accelerate smoothly out'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Driving Tech"
  },
  {
    id: "q116",
    question: "To stop a skidding vehicle without ABS:",
    options: ["Slam the brakes", "Pump the brakes and steer in direction of skid", "Accelerate", "Turn the steering sharply"],
    correctIndex: 1,
    explanation: "The correct answer is 'Pump the brakes and steer in direction of skid'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Emergencies"
  },
  {
    id: "q117",
    question: "When approaching a roundabout, you should:",
    options: ["Indicate left to enter", "Indicate right to enter", "Give way to traffic already on it", "Drive straight through"],
    correctIndex: 2,
    explanation: "The correct answer is 'Give way to traffic already on it'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Roundabouts"
  },
  {
    id: "q118",
    question: "A driver approaching a T-intersection must:",
    options: ["Give way to through traffic", "Have right of way", "Honk and proceed", "Stop and turn off engine"],
    correctIndex: 0,
    explanation: "The correct answer is 'Give way to through traffic'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Intersections"
  },
  {
    id: "q119",
    question: "If you miss your exit on a highway:",
    options: ["Reverse on the highway", "Make a U-turn in the median", "Continue to the next exit", "Stop and wait"],
    correctIndex: 2,
    explanation: "The correct answer is 'Continue to the next exit'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Highways"
  },
  {
    id: "q120",
    question: "When driving behind a heavy truck, you should:",
    options: ["Stay very close to avoid wind resistance", "Stay far back to have a clear view ahead", "Overtake from the left", "Honk continuously"],
    correctIndex: 1,
    explanation: "The correct answer is 'Stay far back to have a clear view ahead'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safe Distance"
  },
  {
    id: "q121",
    question: "The recommended grip on the steering wheel is:",
    options: ["10 and 2 o'clock or 9 and 3 o'clock", "One hand at 12 o'clock", "Underhand grip", "One hand out the window"],
    correctIndex: 0,
    explanation: "The correct answer is '10 and 2 o'clock or 9 and 3 o'clock'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q122",
    question: "In a manual car, riding the clutch means:",
    options: ["Keeping foot lightly on the clutch pedal while driving", "Fully pressing the clutch", "Changing gears smoothly", "Using clutch to brake"],
    correctIndex: 0,
    explanation: "The correct answer is 'Keeping foot lightly on the clutch pedal while driving'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Driving Tech"
  },
  {
    id: "q123",
    question: "Riding the clutch causes:",
    options: ["Better fuel economy", "Premature wear of the clutch plates", "Smoother ride", "Engine overheating"],
    correctIndex: 1,
    explanation: "The correct answer is 'Premature wear of the clutch plates'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Maintenance"
  },
  {
    id: "q124",
    question: "What should be checked regularly for tyre safety?",
    options: ["Air pressure and tread depth", "Color of the tyre", "Brand of the tyre", "Wheel covers"],
    correctIndex: 0,
    explanation: "The correct answer is 'Air pressure and tread depth'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Maintenance"
  },
  {
    id: "q125",
    question: "Low tyre pressure causes:",
    options: ["Better handling", "Poor fuel economy and unstable handling", "Higher top speed", "Nothing"],
    correctIndex: 1,
    explanation: "The correct answer is 'Poor fuel economy and unstable handling'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Maintenance"
  },
  {
    id: "q126",
    question: "What does a flashing pedestrian crossing light indicate?",
    options: ["Pedestrians must run", "Drivers must stop and yield if a pedestrian is crossing", "Drivers can speed up", "Traffic signal is broken"],
    correctIndex: 1,
    explanation: "The correct answer is 'Drivers must stop and yield if a pedestrian is crossing'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Pedestrians"
  },
  {
    id: "q127",
    question: "Which lane is generally used for overtaking on a multi-lane highway?",
    options: ["The left-most lane", "The extreme right lane", "The center lane", "The shoulder"],
    correctIndex: 1,
    explanation: "The correct answer is 'The extreme right lane'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Highways"
  },
  {
    id: "q128",
    question: "Zig-zag lines on the road mean:",
    options: ["Parking is allowed", "Overtaking and parking are strictly prohibited", "Pedestrian crossing ahead", "Bus stop"],
    correctIndex: 1,
    explanation: "The correct answer is 'Overtaking and parking are strictly prohibited'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Road Markings"
  },
  {
    id: "q129",
    question: "A yellow box junction indicates:",
    options: ["You can park inside", "You must not enter unless your exit is clear", "You have right of way", "You must stop inside it"],
    correctIndex: 1,
    explanation: "The correct answer is 'You must not enter unless your exit is clear'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Intersections"
  },
  {
    id: "q130",
    question: "When a police officer signals you to stop at a green light:",
    options: ["Follow the traffic light", "Obey the police officer", "Honk at the officer", "Ignore both"],
    correctIndex: 1,
    explanation: "The correct answer is 'Obey the police officer'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Signals"
  },
  {
    id: "q131",
    question: "What is the validity of a transport vehicle driving license?",
    options: ["20 years", "5 years", "1 year", "3 years"],
    correctIndex: 1,
    explanation: "The correct answer is '5 years'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Licenses"
  },
  {
    id: "q132",
    question: "Grace period for renewing an expired driving license without penalty is:",
    options: ["30 days", "15 days", "6 months", "1 year"],
    correctIndex: 0,
    explanation: "The correct answer is '30 days'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Licenses"
  },
  {
    id: "q133",
    question: "If you modify your vehicle's engine or chassis:",
    options: ["No action is needed", "You must get it approved by the RTO", "You must inform the police", "You must paint it red"],
    correctIndex: 1,
    explanation: "The correct answer is 'You must get it approved by the RTO'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Rules"
  },
  {
    id: "q134",
    question: "A private vehicle's registration plate has:",
    options: ["Yellow background, black letters", "White background, black letters", "Black background, yellow letters", "Green background, white letters"],
    correctIndex: 1,
    explanation: "The correct answer is 'White background, black letters'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Rules"
  },
  {
    id: "q135",
    question: "A commercial vehicle's registration plate has:",
    options: ["White background, black letters", "Yellow background, black letters", "Black background, yellow letters", "Red background, white letters"],
    correctIndex: 1,
    explanation: "The correct answer is 'Yellow background, black letters'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Rules"
  },
  {
    id: "q136",
    question: "An electric vehicle's registration plate has:",
    options: ["Green background", "White background", "Yellow background", "Blue background"],
    correctIndex: 0,
    explanation: "The correct answer is 'Green background'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Rules"
  },
  {
    id: "q137",
    question: "Foreign diplomatic vehicles have plates with:",
    options: ["Red background", "Light blue background", "White background", "Green background"],
    correctIndex: 1,
    explanation: "The correct answer is 'Light blue background'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Rules"
  },
  {
    id: "q138",
    question: "If your vehicle is stolen, the first step is:",
    options: ["Inform insurance company", "File an FIR with the police", "Buy a new car", "Inform RTO"],
    correctIndex: 1,
    explanation: "The correct answer is 'File an FIR with the police'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Emergencies"
  },
  {
    id: "q139",
    question: "PUC stands for:",
    options: ["Public Under Control", "Pollution Under Control", "Passenger Utility Car", "Private Utility Certificate"],
    correctIndex: 1,
    explanation: "The correct answer is 'Pollution Under Control'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Documents"
  },
  {
    id: "q140",
    question: "Using a mobile phone for navigation is:",
    options: ["Illegal", "Allowed if securely mounted and doesn't distract", "Allowed holding in one hand", "Allowed only for trucks"],
    correctIndex: 1,
    explanation: "The correct answer is 'Allowed if securely mounted and doesn't distract'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q141",
    question: "Loud music inside the car is:",
    options: ["Recommended", "Dangerous as it masks outside warning sounds", "Allowed on highways", "A requirement"],
    correctIndex: 1,
    explanation: "The correct answer is 'Dangerous as it masks outside warning sounds'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q142",
    question: "During a traffic jam, you should:",
    options: ["Switch off the engine to reduce pollution", "Honk continuously", "Try to squeeze between lanes", "Drive on the footpath"],
    correctIndex: 0,
    explanation: "The correct answer is 'Switch off the engine to reduce pollution'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Environment"
  },
  {
    id: "q143",
    question: "To save fuel, you should:",
    options: ["Drive in lower gears", "Accelerate and brake abruptly", "Maintain steady speed in highest possible gear", "Keep engine idling"],
    correctIndex: 2,
    explanation: "The correct answer is 'Maintain steady speed in highest possible gear'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Environment"
  },
  {
    id: "q144",
    question: "A catalytic converter is used to:",
    options: ["Reduce noise", "Increase speed", "Reduce toxic emissions", "Cool the engine"],
    correctIndex: 2,
    explanation: "The correct answer is 'Reduce toxic emissions'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Environment"
  },
  {
    id: "q145",
    question: "The term 'Engine Braking' is most useful:",
    options: ["On flat roads", "When driving downhill", "When parking", "When starting"],
    correctIndex: 1,
    explanation: "The correct answer is 'When driving downhill'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Driving Tech"
  },
  {
    id: "q146",
    question: "Airbags are designed to work in conjunction with:",
    options: ["Anti-lock brakes", "Seatbelts", "Power steering", "Headrests"],
    correctIndex: 1,
    explanation: "The correct answer is 'Seatbelts'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q147",
    question: "When driving past parked cars, beware of:",
    options: ["People opening doors", "Cars pulling out", "Children stepping out", "All of the above"],
    correctIndex: 3,
    explanation: "The correct answer is 'All of the above'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q148",
    question: "A 'School Zone' sign indicates:",
    options: ["Children playing on road", "School ahead, drive slowly", "School bus stop", "No entry for cars"],
    correctIndex: 1,
    explanation: "The correct answer is 'School ahead, drive slowly'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Signs"
  },
  {
    id: "q149",
    question: "If a school bus is stopped with flashing lights:",
    options: ["Overtake quickly", "Stop and wait for children to board/alight", "Sound horn", "Drive on the opposite side"],
    correctIndex: 1,
    explanation: "The correct answer is 'Stop and wait for children to board/alight'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Safety"
  },
  {
    id: "q150",
    question: "The minimum age for obtaining a permanent license for a car is:",
    options: ["16 years", "18 years", "20 years", "21 years"],
    correctIndex: 1,
    explanation: "The correct answer is '18 years'. This is mandated by official RTO regulations for safety and compliance.",
    topic: "Licenses"
  },
];
