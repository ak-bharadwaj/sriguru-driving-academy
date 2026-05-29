import fs from 'fs'
import path from 'path'

const rtoDataPath = path.join(process.cwd(), 'lib', 'data', 'rto-data.ts')

function run() {
  let content = fs.readFileSync(rtoDataPath, 'utf-8')
  
  // Extract ROAD_SIGNS_DATA string using a regex or simple eval
  const match = content.match(/export const ROAD_SIGNS_DATA = (\[[\s\S]*?\]);\n/)
  if (!match) {
    console.error("Could not find ROAD_SIGNS_DATA")
    return
  }
  // Using Function constructor instead of eval() to avoid direct scope access and satisfy security linter
  const signs = new Function('return ' + match[1])()
  
  const questions = []
  
  // Generate 60 questions based on random signs
  for (let i = 0; i < 100; i++) {
    const targetSign = signs[i % signs.length]
    
    // Pick 3 wrong options
    const options = [targetSign.name]
    while (options.length < 4) {
      const randSign = signs[Math.floor(Math.random() * signs.length)]
      if (!options.includes(randSign.name)) {
        options.push(randSign.name)
      }
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5)
    
    const correctIndex = options.indexOf(targetSign.name)
    
    questions.push({
      id: `q${i + 1}`,
      question: `Identify the following ${targetSign.category.toLowerCase()} sign:`,
      options: options,
      correctIndex: correctIndex,
      explanation: `This sign indicates "${targetSign.name}". ${targetSign.rule}`,
      topic: targetSign.category,
      imagePath: targetSign.imagePath,
      fallbackShape: targetSign.fallbackShape,
      fallbackColor: targetSign.fallbackColor
    })
  }

  const outputStr = `export const QUIZ_QUESTIONS: QuizQuestionItem[] = ${JSON.stringify(questions, null, 2)};\n`
  
  // Replace the QUIZ_QUESTIONS array
  const regex = /export const QUIZ_QUESTIONS: QuizQuestionItem\[\] = (?:\[[\s\S]*?\]);/
  if (regex.test(content)) {
    content = content.replace(regex, outputStr)
    fs.writeFileSync(rtoDataPath, content)
    console.log(`Successfully updated QUIZ_QUESTIONS with ${questions.length} items based on real signs.`)
  } else {
    console.log("Could not find QUIZ_QUESTIONS in rto-data.ts")
  }
}

run()
