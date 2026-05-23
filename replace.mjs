import fs from 'fs';
const path = './lib/data/rto-data.ts';
let content = fs.readFileSync(path, 'utf8');

const regex = /export const QUIZ_QUESTIONS: QuizQuestionItem\[\] = \[[\s\S]*?\];/;

const newQuiz = `export const QUIZ_QUESTIONS: QuizQuestionItem[] = [
  {
    id: "q1",
    question: "What is the primary meaning of a green traffic light?",
    options: ["Stop your vehicle", "Proceed if the intersection is clear", "Slow down and prepare to stop", "Yield to pedestrians immediately"],
    correctIndex: 1,
    explanation: "A green light means you may proceed if it is safe to do so and the intersection is clear.",
    topic: "Traffic Lights"
  },
  {
    id: "q2",
    question: "When should you use your vehicle's high beam headlights?",
    options: ["When driving in heavy fog", "When closely following another vehicle", "When driving on unlit roads with no oncoming traffic", "During heavy rain in the daytime"],
    correctIndex: 2,
    explanation: "High beams are designed for unlit roads where there is no oncoming traffic to avoid blinding other drivers.",
    topic: "Driving Rules"
  },
  {
    id: "q3",
    question: "What does a solid double yellow line in the center of the road indicate?",
    options: ["Passing is allowed from both sides", "Passing is strictly prohibited from both sides", "Only the left lane can pass", "You can park your vehicle here"],
    correctIndex: 1,
    explanation: "A solid double yellow line indicates a strict no-passing zone for traffic in both directions.",
    topic: "Road Markings"
  },
  {
    id: "q4",
    question: "What is the correct action when you hear the siren of an emergency vehicle approaching?",
    options: ["Speed up to stay ahead of it", "Stop immediately wherever you are", "Pull over to the left side of the road and yield the right of way", "Continue driving at the same speed"],
    correctIndex: 2,
    explanation: "You must always yield the right of way to emergency vehicles by pulling over to the left and stopping.",
    topic: "Emergency Situations"
  },
  {
    id: "q5",
    question: "What does 'Tailgating' mean?",
    options: ["Driving too close behind another vehicle", "Opening the tailgate while driving", "Parking too close to another car", "Driving slowly in the fast lane"],
    correctIndex: 0,
    explanation: "Tailgating is the dangerous practice of driving too close behind another vehicle, not leaving enough stopping distance.",
    topic: "Safe Driving Practices"
  }
];`;

content = content.replace(regex, newQuiz);
fs.writeFileSync(path, content, 'utf8');
console.log("Updated QUIZ_QUESTIONS successfully");
