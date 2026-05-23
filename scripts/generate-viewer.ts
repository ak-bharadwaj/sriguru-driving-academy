import fs from 'fs';
import path from 'path';
import { ROAD_SIGNS_DATA } from '../lib/data/rto-data';

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Fast Reviewer</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px; overflow-x: hidden; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { margin: 0; font-size: 2.5rem; color: #38bdf8; }
        .header p { color: #94a3b8; font-size: 1.1rem; }
        .controls { display: flex; justify-content: center; gap: 20px; margin-bottom: 40px; flex-wrap: wrap; }
        input, select { padding: 14px 20px; border-radius: 12px; border: 2px solid #334155; background: #1e293b; color: white; font-size: 1rem; width: 100%; max-width: 400px; outline: none; transition: border-color 0.2s; }
        input:focus, select:focus { border-color: #38bdf8; }
        
        .section-title { font-size: 1.5rem; margin-top: 50px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #334155; color: #f1f5f9; }

        /* Lessons Section */
        .lessons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-bottom: 60px; }
        .lesson-card { background: linear-gradient(145deg, #1e293b, #0f172a); padding: 20px; border-radius: 16px; border: 1px solid #334155; display: flex; flex-direction: column; gap: 10px; border-left: 4px solid #38bdf8; }
        .lesson-card h3 { margin: 0; color: #f8fafc; font-size: 1.2rem; }
        .lesson-card p { margin: 0; color: #94a3b8; font-size: 0.9rem; line-height: 1.5; }
        .lesson-tag { display: inline-block; padding: 4px 10px; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border-radius: 20px; font-size: 0.8rem; font-weight: bold; align-self: flex-start; }

        /* Flashcards Grid */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; perspective: 1000px; }
        
        .flashcard-wrapper {
            background: transparent;
            width: 100%;
            height: 380px;
            perspective: 1000px;
        }

        .flashcard-inner {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
            transform-style: preserve-3d;
            cursor: pointer;
        }

        .flashcard-wrapper:hover .flashcard-inner, .flashcard-inner.flipped {
            transform: rotateY(180deg);
        }

        .flashcard-front, .flashcard-back {
            position: absolute;
            width: 100%;
            height: 100%;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            border-radius: 20px;
            border: 1px solid #334155;
            background: #1e293b;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        /* FRONT PAGE */
        .flashcard-front {
            padding: 30px;
            align-items: center;
            justify-content: center;
            background: linear-gradient(to bottom, #1e293b, #0f172a);
        }

        .img-container { width: 140px; height: 140px; display: flex; justify-content: center; align-items: center; margin-bottom: 20px; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.5)); }
        img { max-width: 100%; max-height: 100%; object-fit: contain; }
        
        .title { font-size: 1.25rem; font-weight: 800; margin: 0; margin-top: 10px; color: #f8fafc; }
        .category { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; color: #38bdf8; font-weight: bold; margin-bottom: 10px; }
        
        .flip-hint { position: absolute; bottom: 20px; font-size: 0.7rem; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }

        /* BACK PAGE */
        .flashcard-back {
            background: #0f172a;
            color: #f8fafc;
            transform: rotateY(180deg);
            padding: 30px 25px;
            text-align: left;
            border-color: #38bdf8;
            box-shadow: 0 10px 25px rgba(56, 189, 248, 0.15);
        }

        .back-header { border-bottom: 1px solid #334155; padding-bottom: 15px; margin-bottom: 15px; }
        .back-title { font-size: 1rem; font-weight: bold; color: #38bdf8; margin: 0 0 5px 0; }
        .meaning { font-size: 0.95rem; color: #cbd5e1; line-height: 1.5; margin: 0; }
        
        .steps-title { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: #f59e0b; margin: 0 0 10px 0; font-weight: bold; }
        .steps { margin: 0; padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .steps li { font-size: 0.85rem; color: #94a3b8; display: flex; gap: 10px; align-items: flex-start; padding: 8px; background: rgba(245, 158, 11, 0.05); border-left: 2px solid #f59e0b; border-radius: 0 6px 6px 0; line-height: 1.4; }
        .step-num { font-weight: bold; color: #f59e0b; font-size: 0.75rem; background: rgba(245, 158, 11, 0.2); width: 16px; height: 16px; display: flex; justify-content: center; align-items: center; border-radius: 50%; flex-shrink: 0; margin-top: 2px; }

        .fallback { width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; border-radius: 50%; border: 6px solid white; font-weight: 900; font-size: 14px; text-transform: uppercase; text-align: center; }
        .fallback.red { background: #ef4444; border-color: #991b1b; }
        .fallback.blue { background: #3b82f6; border-color: #1e40af; }
        .fallback.green { background: #10b981; border-color: #065f46; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Interactive Fast Reviewer</h1>
        <p>Hover (or tap) over the cards to instantly test the 3D Flashcard logic and review the safety steps.</p>
    </div>
    
    <div class="controls">
        <input type="text" id="search" placeholder="Search signs by name or meaning..." onkeyup="render()">
        <select id="categoryFilter" onchange="render()">
            <option value="All">All Categories</option>
            <option value="Rules">Rules (Mandatory)</option>
            <option value="Signs">Signs (Warning)</option>
            <option value="Parking">Parking (Information)</option>
        </select>
    </div>

    <!-- MOCK LESSONS SECTION -->
    <h2 class="section-title">🎮 Interactive Lessons (Web App Previews)</h2>
    <div class="lessons-grid">
        <div class="lesson-card">
            <span class="lesson-tag">Simulation</span>
            <h3>Parallel Parking</h3>
            <p>Interactive steering and gear mechanics to guide the vehicle into a tight spot.</p>
        </div>
        <div class="lesson-card">
            <span class="lesson-tag">Simulation</span>
            <h3>Reverse Bay Parking</h3>
            <p>Backing the vehicle into a 90-degree stall using mirrors and turning angles.</p>
        </div>
        <div class="lesson-card">
            <span class="lesson-tag">Simulation</span>
            <h3>Highway Merging</h3>
            <p>Matching speed and checking blind spots before entering high-speed traffic.</p>
        </div>
        <div class="lesson-card">
            <span class="lesson-tag">Simulation</span>
            <h3>Clutch Control</h3>
            <p>Mastering the bite point on a hill start to prevent stalling or rolling back.</p>
        </div>
    </div>

    <!-- FLASHCARDS SECTION -->
    <h2 class="section-title">🎴 Dynamic Flashcards (\x3cspan id="count"\x3e\x3c/span\x3e Signs)</h2>
    <div class="grid" id="grid"></div>

    <script>
        const signs = ${JSON.stringify(ROAD_SIGNS_DATA)};
        
        function render() {
            const q = document.getElementById('search').value.toLowerCase();
            const filter = document.getElementById('categoryFilter').value;
            const grid = document.getElementById('grid');
            grid.innerHTML = '';
            
            const filteredSigns = signs.filter(s => {
                const matchQuery = s.name.toLowerCase().includes(q) || s.meaning.toLowerCase().includes(q);
                const matchCat = filter === 'All' || s.category === filter;
                return matchQuery && matchCat;
            });
            
            document.getElementById('count').innerText = filteredSigns.length;

            filteredSigns.forEach(sign => {
                const card = document.createElement('div');
                card.className = 'flashcard-wrapper';
                
                let imgHtml = '';
                if (sign.imagePath) {
                    const localPath = './public' + sign.imagePath;
                    imgHtml = '<img src="' + localPath + '" alt="' + sign.name + '" onerror="this.style.display=\\'none\\'"/>';
                } else {
                    imgHtml = '<div class="fallback ' + (sign.fallbackColor || 'red') + '">' + sign.name + '</div>';
                }
                
                let stepsHtml = '';
                if (sign.steps && sign.steps.length > 0) {
                    stepsHtml = '<ul class="steps">' + sign.steps.map((s, i) => '<li><span class="step-num">' + (i+1) + '</span><span>' + s + '</span></li>').join('') + '</ul>';
                } else {
                    stepsHtml = '<p style="color:#94a3b8; font-size:0.85rem; font-style:italic;">' + (sign.rule || '') + '</p>';
                }

                card.innerHTML = \`
                    <div class="flashcard-inner" onclick="this.classList.toggle('flipped')">
                        <!-- FRONT -->
                        <div class="flashcard-front">
                            <div class="category">\${sign.category} Signboard</div>
                            <div class="img-container">\${imgHtml}</div>
                            <h3 class="title">\${sign.name}</h3>
                            <div class="flip-hint">Hover / Click to Flip</div>
                        </div>
                        
                        <!-- BACK -->
                        <div class="flashcard-back">
                            <div class="back-header">
                                <h4 class="back-title">Concept Meaning</h4>
                                <p class="meaning">\${sign.meaning}</p>
                            </div>
                            <div>
                                <h4 class="steps-title">Safety Steps</h4>
                                \${stepsHtml}
                            </div>
                        </div>
                    </div>
                \`;
                grid.appendChild(card);
            });
        }
        
        render();
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(process.cwd(), 'sign-reviewer.html'), htmlContent);
console.log('Successfully updated sign-reviewer.html with interactive flashcards and lessons.');
