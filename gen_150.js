const fs = require('fs');
const path = './lib/data/rto-data.ts';

const rawQuestions = [
  "Which side of the road must you keep to?|Left|Right|Center|Whichever is clear|0|General Rules",
  "When overtaking, you should pass from?|Left|Right|Either side|Above|1|Overtaking",
  "At an uncontrolled intersection, who has right of way?|Vehicles from left|Vehicles from right|Bigger vehicles|Faster vehicles|1|Intersections",
  "When an emergency vehicle approaches, you must:|Speed up|Stop immediately|Pull to the left and stop|Ignore it|2|Emergency",
  "U-turns are prohibited:|On empty roads|Near hospitals|On busy roads and curves|In residential areas|2|Turning",
  "Pedestrians at a zebra crossing have:|No rights|Right of way|To wait for cars|To run across|1|Pedestrians",
  "When a vehicle approaches from behind to overtake:|Speed up|Keep left and let it pass|Block it|Honk loudly|1|Overtaking",
  "You are approaching a narrow bridge, another vehicle enters from opposite side:|Enter and force them back|Wait till they clear the bridge|Turn on headlights|Honk and proceed|1|Right of Way",
  "When entering a main road from a side road:|You have right of way|Main road traffic has right of way|Honk and enter|Bigger vehicle goes first|1|Intersections",
  "If a vehicle is already in a roundabout:|You must give way to it|It must give way to you|Both must stop|First to honk goes first|0|Roundabouts",
  "Before taking a right turn, you should:|Stay left|Move to the center/right|Speed up|Turn off engine|1|Turning",
  "When is overtaking prohibited?|When road ahead is not clearly visible|At night|On a highway|When raining|0|Overtaking",
  "What is the rule for tailgating?|Maintain safe distance|Stay bumper to bumper|Flash lights constantly|Drive zigzag|0|Safe Distance",
  "When driving on a hill, who has right of way?|Vehicle going downhill|Vehicle going uphill|Heavier vehicle|Faster vehicle|1|Hills",
  "Overtaking is prohibited near:|A hospital|A pedestrian crossing|A police station|A petrol pump|1|Overtaking",
  "If you are being overtaken, you should not:|Increase your speed|Decrease your speed|Keep to the left|Look in the mirror|0|Overtaking",
  "Reversing is prohibited on:|A one-way street|A highway|Both|Neither|2|Reversing",
  "At a blind corner, you must:|Speed up to clear it|Sound horn and slow down|Turn off lights|Overtake|1|Turning",
  "When two roads cross without a signal:|Stop and wait|Give way to traffic on your right|Give way to traffic on your left|Proceed without stopping|1|Intersections",
  "When an animal is on the road:|Sound horn loudly|Flash lights|Slow down or stop safely|Steer around quickly|2|Animals",

  "A red traffic light means:|Slow down|Stop|Proceed with caution|Go|1|Traffic Lights",
  "A flashing red traffic light means:|Stop and proceed when safe|Slow down|Traffic signal is broken|Pedestrian crossing|0|Traffic Lights",
  "A flashing yellow traffic light means:|Stop|Slow down and proceed with caution|Speed up|Signal broken|1|Traffic Lights",
  "A green arrow with a red light means:|Stop for all directions|Proceed only in direction of arrow|Go straight|Wait for green light|1|Traffic Lights",
  "Amber light appears after:|Red light|Green light|Flashing Red|Flashing Amber|1|Traffic Lights",
  "A solid continuous yellow line in the center means:|Overtaking allowed|No overtaking/crossing|Parking allowed|One way|1|Road Markings",
  "Broken white lines in the center mean:|Overtaking prohibited|Overtaking allowed if safe|Parking zone|Pedestrian crossing|1|Road Markings",
  "Double solid yellow lines mean:|Strictly no passing|Passing allowed|Divided highway ends|Lane merges|0|Road Markings",
  "Stop line before an intersection is:|White|Yellow|Red|Blue|0|Road Markings",
  "Zebra crossing lines are:|Red and White|Black and White|Yellow and Black|Blue and White|1|Road Markings",
  "Mandatory signs are usually:|Triangular|Circular|Rectangular|Octagonal|1|Road Signs",
  "Cautionary/Warning signs are usually:|Triangular|Circular|Rectangular|Octagonal|0|Road Signs",
  "Informatory signs are usually:|Triangular|Circular|Rectangular|Octagonal|2|Road Signs",
  "A stop sign is shaped like an:|Octagon|Triangle|Circle|Square|0|Road Signs",
  "Give Way sign is an:|Inverted triangle|Upright triangle|Circle|Hexagon|0|Road Signs",
  "Hand signal for stopping:|Right arm raised upward|Right arm extended horizontally|Left arm extended|Waving hand|0|Hand Signals",
  "Hand signal for turning right:|Right arm extended horizontally|Right arm raised|Left arm extended|Waving hand|0|Hand Signals",
  "Hand signal for turning left:|Right arm extended horizontally|Right arm rotated anti-clockwise|Left arm raised|Both arms raised|1|Hand Signals",
  "Hand signal to allow overtaking:|Right arm swung forwards and backwards|Right arm raised|Left arm extended|Flash headlights|0|Hand Signals",
  "Using indicators instead of hand signals is:|Illegal|Allowed and preferred|Only for cars|Only at night|1|Signals",

  "Speed limit near a school zone is usually:|25 km/h|50 km/h|80 km/h|No limit|0|Speed Limits",
  "Driving above the speed limit is:|Allowed if road is empty|An offence|Allowed in emergencies|Encouraged|1|Speed Limits",
  "When driving in heavy rain, you should:|Increase speed|Maintain speed|Reduce speed and increase following distance|Turn on hazard lights|2|Safe Driving",
  "What is the two-second rule?|Time to start engine|Safe following distance|Time to stop at red light|Time to overtake|1|Safe Distance",
  "Parking is prohibited:|In a parking lot|On a footpath|In your garage|On a side street|1|Parking",
  "You should not park:|Near a fire hydrant|In an open field|In a designated zone|In your driveway|0|Parking",
  "Parking near a road intersection is:|Allowed|Prohibited|Allowed at night|Allowed for 5 mins|1|Parking",
  "Parking on a bridge is:|Allowed|Prohibited|Allowed if bridge is long|Allowed for two-wheelers|1|Parking",
  "When parking uphill with a curb, turn wheels:|Towards the curb|Away from the curb|Straight|Doesn't matter|1|Parking",
  "When parking downhill, turn wheels:|Towards the curb|Away from the curb|Straight|Parallel|0|Parking",
  "Leaving a vehicle in a dangerous position is:|A minor mistake|A punishable offence|Allowed if hazards are on|Allowed for 10 mins|1|Parking",
  "Before opening your car door on the road:|Check mirrors and blind spots|Open it quickly|Honk|Turn on interior light|0|Safety",
  "Using a mobile phone while driving is:|Allowed if using speaker|Allowed for texting|Strictly prohibited|Allowed in slow traffic|2|Safety",
  "Drinking and driving is:|Allowed up to 3 pegs|Strictly prohibited|Allowed at night|Allowed if eating|1|Safety",
  "The permissible blood alcohol limit in India is:|30mg per 100ml|50mg per 100ml|80mg per 100ml|Zero|0|Laws",
  "If dazzled by oncoming headlights at night:|Look to the left side of the road|Look directly at the lights|Turn on high beam|Close your eyes|0|Night Driving",
  "When driving in fog, use:|High beam headlights|Low beam headlights or fog lights|Parking lights only|No lights|1|Fog Driving",
  "Hazard warning lights should be used when:|Parked illegally|Vehicle is stationary/broken down in a hazardous place|Driving fast|Towing|1|Safety",
  "Free-wheeling (driving with clutch down or in neutral) is:|Good for fuel|Dangerous as engine braking is lost|Required on hills|Recommended|1|Safe Driving",
  "When a tyre bursts while driving:|Brake hard immediately|Hold steering firmly and let vehicle slow down|Accelerate|Turn sharply|1|Emergencies",

  "Which document is NOT mandatory to carry while driving?|Driving License|Registration Certificate|Passport|Insurance Certificate|2|Documents",
  "A learner's license is valid for:|1 month|6 months|1 year|Lifetime|1|Licenses",
  "You can apply for a permanent license after:|10 days of Learner's License|30 days of Learner's License|3 months of Learner's License|Immediately|1|Licenses",
  "Validity of PUC (Pollution Under Control) certificate for a new car is usually:|6 months|1 year|3 years|5 years|1|Documents",
  "Minimum age to drive a transport (commercial) vehicle is:|18 years|20 years|21 years|25 years|1|Licenses",
  "Minimum age to ride a 50cc gearless motorcycle is:|16 years|18 years|21 years|14 years|0|Licenses",
  "Third-party insurance covers:|Damage to your own car|Damage to the other person's property/life|Theft of your car|Engine failure|1|Insurance",
  "Driving without insurance is:|Allowed for 1 month|A punishable offence|Allowed for two-wheelers|Legal|1|Laws",
  "If involved in an accident causing injury, you must:|Flee the scene|Take the victim to a hospital and report to police|Call insurance only|Move the vehicles immediately|1|Accidents",
  "Hit and run accidents involve:|Crashing into a tree|Causing an accident and fleeing the scene|Hitting an animal|A small scratch|1|Accidents",
  "Number plates must be:|Written in any language|Written in English/Arabic numerals|Written in local language only|Hand painted|1|Rules",
  "Using a vehicle without a registration mark is:|Illegal|Allowed for 7 days|Allowed if new|Allowed for politicians|0|Rules",
  "Tinted glass on vehicles:|Must allow 100% visibility|Must comply with visual transmission standards|Is completely banned|Is fully allowed|1|Rules",
  "Seatbelts are mandatory for:|Driver only|Front passengers only|Driver and all passengers|Children only|2|Safety",
  "Wearing a helmet is mandatory for:|Rider only|Pillion rider only|Both rider and pillion|Women are exempted everywhere|2|Safety",
  "A police officer in uniform asks for your documents:|You must produce them|You can refuse|You can show them later|You must run|0|Laws",
  "If your license is suspended:|You can drive in another state|You cannot drive any vehicle|You can drive two-wheelers|You can drive with an 'L' board|1|Laws",
  "An 'L' board must be displayed:|By all drivers|By learner license holders|By heavy vehicles|By ladies|1|Rules",
  "The color of an 'L' board is:|Red letter on white background|Black letter on yellow background|White letter on red background|Red letter on yellow background|0|Rules",
  "Carrying more passengers than the permitted seating capacity is:|Allowed in rural areas|An offence|Allowed for short distances|Allowed if they are children|1|Rules",

  "When an ambulance is approaching:|Do not yield|Yield right of way by moving left|Follow it closely|Race it|1|Emergency",
  "You should not sound your horn:|To warn of danger|At a blind corner|Near a hospital|During the day|2|Rules",
  "If a blind person with a white cane is crossing:|Honk to warn them|Bypass them quickly|Stop and wait for them to cross|Shout at them|2|Pedestrians",
  "When you see a 'Stop' sign, you must:|Slow down|Stop completely before the line|Stop only if traffic is coming|Honk and go|1|Signs",
  "If you meet a procession on the road:|Drive through it|Sound horn continuously|Wait for it to pass or take another route|Overtake them quickly|2|Rules",
  "Overtaking is prohibited on:|A straight road|A bridge or narrow road|A multi-lane highway|A one-way street|1|Overtaking",
  "The term 'Blind Spot' refers to:|Areas not visible in the mirrors|Driving at night|Foggy weather|Tinted windows|0|Safety",
  "To check blind spots, you must:|Look in the rearview mirror|Look in the side mirrors|Turn your head and look over your shoulder|Use a reverse camera|2|Safety",
  "Before starting a vehicle, you should:|Rev the engine|Check mirrors, seat, and seatbelt|Turn on the radio|Sound the horn|1|Safety",
  "Aquaplaning or hydroplaning occurs when:|Tyres lose contact with the road due to water|Driving in snow|Engine overheats|Brakes fail|0|Driving Conditions",
  "When driving down a steep hill, you should:|Put the car in neutral|Turn off the engine|Use a lower gear|Use only the handbrake|2|Hills",
  "What is engine braking?|Using brakes to stop engine|Using lower gears to slow the vehicle|Engine failure|Braking suddenly|1|Driving Tech",
  "If your brakes fail, you should NOT:|Pump the brake pedal|Use the handbrake carefully|Turn off the ignition immediately|Shift to a lower gear|2|Emergencies",
  "When towing another vehicle, the maximum speed is usually:|25 km/h|50 km/h|80 km/h|No limit|0|Towing",
  "The distance between the towing vehicle and towed vehicle should not exceed:|5 meters|10 meters|15 meters|20 meters|0|Towing",
  "A vehicle with a red flashing beacon indicates:|A VIP|An emergency/police/fire vehicle|A slow moving vehicle|A broken down vehicle|1|Vehicles",
  "A yellow flashing beacon indicates:|Police|Ambulance|A construction or maintenance vehicle|Fire engine|2|Vehicles",
  "If you feel drowsy while driving:|Drink coffee and continue|Open windows|Stop safely and take a rest|Turn up the radio|2|Safety",
  "Driver's reaction time is affected by:|Good weather|Alcohol, drugs, and fatigue|Wearing seatbelts|Listening to music|1|Safety",
  "Exhaust noise should be controlled by:|Using a loud horn|A proper silencer|Driving slowly|Turning off engine at signals|1|Pollution",

  "When approaching a railway crossing without barriers:|Cross quickly|Stop, look both ways, and cross if safe|Sound horn and cross|Follow the car ahead closely|1|Railways",
  "If a vehicle stalls on a railway crossing:|Leave it and run|Try to push it clear or warn trains|Sit inside and call police|Lock it|1|Emergencies",
  "You should dim your headlights at night when:|Driving in a city with streetlights|Following a vehicle or facing oncoming traffic|It rains|Driving on a highway|1|Night Driving",
  "High beam headlights should be used:|In fog|On unlit roads with no oncoming traffic|In heavy traffic|During the day|1|Night Driving",
  "A 'No Entry' sign means:|You can enter if empty|All vehicles are prohibited from entering|Only heavy vehicles prohibited|Entry allowed for locals|1|Signs",
  "A 'One Way' sign means:|Traffic flows in both directions|You must not reverse|Traffic flows in one direction only|Only one car at a time|2|Signs",
  "A 'No Parking' sign means:|You can stop to drop passengers|You cannot stop at all|You can park for 5 minutes|You can park two-wheelers|0|Signs",
  "A 'No Stopping or Standing' sign means:|You can drop passengers|You cannot halt your vehicle at all|You can wait inside the car|You can park|1|Signs",
  "A 'Compulsory Turn Left' sign means:|You may go straight|You must turn left|Left turn is prohibited|Left turn is optional|1|Signs",
  "A 'Yield' or 'Give Way' sign means:|You have right of way|Stop completely|Give way to traffic on the intersecting road|Speed up|2|Signs",
  "A rectangular blue sign with a 'P' and a car indicates:|No parking for cars|Parking for cars only|Petrol pump|Police station|1|Signs",
  "A blue circular sign with a white bicycle means:|No bicycles|Compulsory cycle track|Bicycle shop|Beware of bicycles|1|Signs",
  "If you hit an unattended parked car, you must:|Drive away|Leave a note with your contact details|Wait 5 minutes then leave|Sound horn|1|Accidents",
  "What should you do if your accelerator pedal gets stuck?|Turn off ignition immediately|Shift to neutral and brake safely|Pull the handbrake hard|Jump out|1|Emergencies",
  "What is the safe way to negotiate a curve?|Brake hard inside the curve|Slow down before the curve, accelerate smoothly out|Coast in neutral|Overtake in the curve|1|Driving Tech",
  "To stop a skidding vehicle without ABS:|Slam the brakes|Pump the brakes and steer in direction of skid|Accelerate|Turn the steering sharply|1|Emergencies",
  "When approaching a roundabout, you should:|Indicate left to enter|Indicate right to enter|Give way to traffic already on it|Drive straight through|2|Roundabouts",
  "A driver approaching a T-intersection must:|Give way to through traffic|Have right of way|Honk and proceed|Stop and turn off engine|0|Intersections",
  "If you miss your exit on a highway:|Reverse on the highway|Make a U-turn in the median|Continue to the next exit|Stop and wait|2|Highways",
  "When driving behind a heavy truck, you should:|Stay very close to avoid wind resistance|Stay far back to have a clear view ahead|Overtake from the left|Honk continuously|1|Safe Distance",
  "The recommended grip on the steering wheel is:|10 and 2 o'clock or 9 and 3 o'clock|One hand at 12 o'clock|Underhand grip|One hand out the window|0|Safety",
  "In a manual car, riding the clutch means:|Keeping foot lightly on the clutch pedal while driving|Fully pressing the clutch|Changing gears smoothly|Using clutch to brake|0|Driving Tech",
  "Riding the clutch causes:|Better fuel economy|Premature wear of the clutch plates|Smoother ride|Engine overheating|1|Maintenance",
  "What should be checked regularly for tyre safety?|Air pressure and tread depth|Color of the tyre|Brand of the tyre|Wheel covers|0|Maintenance",
  "Low tyre pressure causes:|Better handling|Poor fuel economy and unstable handling|Higher top speed|Nothing|1|Maintenance",
  "What does a flashing pedestrian crossing light indicate?|Pedestrians must run|Drivers must stop and yield if a pedestrian is crossing|Drivers can speed up|Traffic signal is broken|1|Pedestrians",
  "Which lane is generally used for overtaking on a multi-lane highway?|The left-most lane|The extreme right lane|The center lane|The shoulder|1|Highways",
  "Zig-zag lines on the road mean:|Parking is allowed|Overtaking and parking are strictly prohibited|Pedestrian crossing ahead|Bus stop|1|Road Markings",
  "A yellow box junction indicates:|You can park inside|You must not enter unless your exit is clear|You have right of way|You must stop inside it|1|Intersections",
  "When a police officer signals you to stop at a green light:|Follow the traffic light|Obey the police officer|Honk at the officer|Ignore both|1|Signals",
  "What is the validity of a transport vehicle driving license?|20 years|5 years|1 year|3 years|1|Licenses",
  "Grace period for renewing an expired driving license without penalty is:|30 days|15 days|6 months|1 year|0|Licenses",
  "If you modify your vehicle's engine or chassis:|No action is needed|You must get it approved by the RTO|You must inform the police|You must paint it red|1|Rules",
  "A private vehicle's registration plate has:|Yellow background, black letters|White background, black letters|Black background, yellow letters|Green background, white letters|1|Rules",
  "A commercial vehicle's registration plate has:|White background, black letters|Yellow background, black letters|Black background, yellow letters|Red background, white letters|1|Rules",
  "An electric vehicle's registration plate has:|Green background|White background|Yellow background|Blue background|0|Rules",
  "Foreign diplomatic vehicles have plates with:|Red background|Light blue background|White background|Green background|1|Rules",
  "If your vehicle is stolen, the first step is:|Inform insurance company|File an FIR with the police|Buy a new car|Inform RTO|1|Emergencies",
  "PUC stands for:|Public Under Control|Pollution Under Control|Passenger Utility Car|Private Utility Certificate|1|Documents",
  "Using a mobile phone for navigation is:|Illegal|Allowed if securely mounted and doesn't distract|Allowed holding in one hand|Allowed only for trucks|1|Safety",
  "Loud music inside the car is:|Recommended|Dangerous as it masks outside warning sounds|Allowed on highways|A requirement|1|Safety",
  "During a traffic jam, you should:|Switch off the engine to reduce pollution|Honk continuously|Try to squeeze between lanes|Drive on the footpath|0|Environment",
  "To save fuel, you should:|Drive in lower gears|Accelerate and brake abruptly|Maintain steady speed in highest possible gear|Keep engine idling|2|Environment",
  "A catalytic converter is used to:|Reduce noise|Increase speed|Reduce toxic emissions|Cool the engine|2|Environment",
  "The term 'Engine Braking' is most useful:|On flat roads|When driving downhill|When parking|When starting|1|Driving Tech",
  "Airbags are designed to work in conjunction with:|Anti-lock brakes|Seatbelts|Power steering|Headrests|1|Safety",
  "When driving past parked cars, beware of:|People opening doors|Cars pulling out|Children stepping out|All of the above|3|Safety",
  "A 'School Zone' sign indicates:|Children playing on road|School ahead, drive slowly|School bus stop|No entry for cars|1|Signs",
  "If a school bus is stopped with flashing lights:|Overtake quickly|Stop and wait for children to board/alight|Sound horn|Drive on the opposite side|1|Safety",
  "The minimum age for obtaining a permanent license for a car is:|16 years|18 years|20 years|21 years|1|Licenses"
];

let questionsOutput = "export interface QuizQuestionItem {\n" +
  "  id: string;\n" +
  "  question: string;\n" +
  "  options: string[];\n" +
  "  correctIndex: number;\n" +
  "  explanation: string;\n" +
  "  topic: string;\n" +
  "}\n\n" +
  "export interface RoadSignItem {\n" +
  "  name: string;\n" +
  "  category: string;\n" +
  "  meaning: string;\n" +
  "  rule: string;\n" +
  "  imagePath: string;\n" +
  "  signKey: string;\n" +
  "}\n\n" +
  "export const ROAD_SIGNS_DATA: RoadSignItem[] = [\n" +
  "  { name: 'Stop', category: 'Signs', meaning: 'You must come to a complete halt.', rule: 'Mandatory stop before the line.', imagePath: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Stop_sign_light_red.svg', signKey: 'stop' },\n" +
  "  { name: 'Give Way', category: 'Signs', meaning: 'Yield to traffic on the main road.', rule: 'Give right of way.', imagePath: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Give_way_sign.svg', signKey: 'give_way' },\n" +
  "  { name: 'No Entry', category: 'Signs', meaning: 'Vehicles are prohibited from entering.', rule: 'Do not enter.', imagePath: 'https://upload.wikimedia.org/wikipedia/commons/5/52/No_Entry_sign.svg', signKey: 'no_entry' },\n" +
  "  { name: 'One Way', category: 'Signs', meaning: 'Traffic flows only in one direction.', rule: 'Do not reverse or drive wrong way.', imagePath: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/One_way_traffic_sign.svg', signKey: 'one_way' },\n" +
  "  { name: 'No Parking', category: 'Parking', meaning: 'Do not park your vehicle here.', rule: 'Parking is strictly prohibited.', imagePath: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/No_parking_sign.svg', signKey: 'no_parking' },\n" +
  "  { name: 'Speed Limit 50', category: 'Laws', meaning: 'Maximum speed is 50 km/h.', rule: 'Do not exceed 50 km/h.', imagePath: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Speed_limit_50_sign.svg', signKey: 'speed_50' }\n" +
  "];\n\n" +
  "export const QUIZ_QUESTIONS: QuizQuestionItem[] = [\n";

rawQuestions.forEach((row, idx) => {
  if(!row.trim()) return;
  const parts = row.split('|');
  const q = parts[0].replace(/"/g, '\\"');
  const opts = [parts[1].replace(/"/g, '\\"'), parts[2].replace(/"/g, '\\"'), parts[3].replace(/"/g, '\\"'), parts[4].replace(/"/g, '\\"')];
  const correct = parseInt(parts[5], 10);
  const topic = parts[6];
  
  // Create a dynamic, contextual explanation WITH SINGLE QUOTES to avoid string escaping syntax errors
  const correctOptText = opts[correct];
  const explanation = `The correct answer is '${correctOptText}'. This is mandated by official RTO regulations for safety and compliance.`;

  questionsOutput += '  {\n' +
    '    id: "q' + (idx + 1) + '",\n' +
    '    question: "' + q + '",\n' +
    '    options: ["' + opts[0] + '", "' + opts[1] + '", "' + opts[2] + '", "' + opts[3] + '"],\n' +
    '    correctIndex: ' + correct + ',\n' +
    '    explanation: "' + explanation + '",\n' +
    '    topic: "' + topic + '"\n' +
    '  },\n';
});

questionsOutput += '];\n';
fs.writeFileSync(path, questionsOutput, 'utf8');
console.log('Successfully wrote 150 questions to ' + path + ' with fixed syntax');
