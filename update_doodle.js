const fs = require('fs');
const file = '/Users/sanjeevn/Downloads/The Nigerian story/src/pages/Home.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `/* ── Doodle Canvas: 16 animated SVG shapes scattered across screen ── */
const DOODLES = [
    { viewBox: "0 0 60 60", top: '7%', left: '5%', w: 'clamp(40px,5vw,65px)', dDelay: '0s', dDur: '7s', path: "M30 4 L35 20 L52 20 L39 31 L44 49 L30 39 L16 49 L21 31 L8 20 L25 20 Z" },
    { viewBox: "0 0 90 30", top: '16%', left: '13%', w: 'clamp(55px,7vw,90px)', dDelay: '1.5s', dDur: '6s', path: "M5 15 Q30 2 65 15 M55 4 L68 15 L55 26" },
    { viewBox: "0 0 55 40", top: '4%', left: '37%', w: 'clamp(38px,4.5vw,60px)', dDelay: '3.5s', dDur: '7s', path: "M5 35 L5 12 L16 23 L27 4 L38 23 L49 12 L49 35" },
    { viewBox: "0 0 60 60", top: '6%', right: '19%', w: 'clamp(45px,5.5vw,70px)', dDelay: '0.8s', dDur: '8s', path: "M55 30 A25 25 0 1 0 54.99 30 M20 23 A3 3 0 1 0 19.99 23 M40 23 A3 3 0 1 0 39.99 23 M18 37 Q30 47 42 37" },
    { viewBox: "0 0 60 60", top: '11%', right: '6%', w: 'clamp(26px,3vw,40px)', dDelay: '2.5s', dDur: '5.5s', path: "M30 4 L35 20 L52 20 L39 31 L44 49 L30 39 L16 49 L21 31 L8 20 L25 20 Z" },
    
    { viewBox: "0 0 50 50", top: '30%', left: '2%', w: 'clamp(32px,4vw,52px)', dDelay: '4s', dDur: '8s', path: "M47 25 A22 22 0 1 0 46.98 25" },
    { viewBox: "0 0 100 30", top: '48%', left: '3%', w: 'clamp(65px,9vw,110px)', dDelay: '1s', dDur: '7.5s', path: "M4 15 L82 15 M68 4 L84 15 L68 26" },
    { viewBox: "0 0 130 35", top: '65%', left: '2%', w: 'clamp(70px,10vw,130px)', dDelay: '5s', dDur: '6.5s', path: "M5 18 Q22 4 38 18 Q55 32 72 18 Q88 4 105 18 Q122 32 128 18" },
    
    { viewBox: "0 0 35 85", top: '25%', right: '7%', w: 'clamp(28px,3.5vw,48px)', dDelay: '0.5s', dDur: '9s', path: "M17 5 Q27 20 12 36 Q4 52 21 67 M21 67 L30 58 M21 67 L10 58" },
    { viewBox: "0 0 100 30", top: '45%', right: '3%', w: 'clamp(65px,9vw,110px)', dDelay: '2s', dDur: '6s', path: "M96 15 L14 15 M28 4 L12 15 L28 26" },
    { viewBox: "0 0 62 62", top: '62%', right: '6%', w: 'clamp(50px,6vw,80px)', dDelay: '3.2s', dDur: '7s', path: "M31 4 L31 12 M31 50 L31 58 M4 31 L12 31 M50 31 L58 31 M11 11 L17 17 M45 45 L51 51 M51 11 L45 17 M17 45 L11 51 M31 18 A13 13 0 1 0 31 44 A13 13 0 1 0 31 18" },
    
    { viewBox: "0 0 60 60", bottom: '22%', left: '6%', w: 'clamp(48px,6vw,78px)', dDelay: '2.8s', dDur: '7s', path: "M30 4 L35 20 L52 20 L39 31 L44 49 L30 39 L16 49 L21 31 L8 20 L25 20 Z" },
    { viewBox: "0 0 120 35", bottom: '10%', left: '18%', w: 'clamp(70px,9vw,120px)', dDelay: '4.5s', dDur: '6.5s', path: "M5 18 Q22 4 38 18 Q55 32 72 18 Q88 4 105 18 Q118 30 118 18" },
    { viewBox: "0 0 60 60", bottom: '7%', left: '46%', w: 'clamp(40px,5vw,60px)', dDelay: '5.5s', dDur: '7.5s', path: "M55 30 A25 25 0 1 0 54.99 30 M20 23 A3 3 0 1 0 19.99 23 M40 23 A3 3 0 1 0 39.99 23 M18 37 Q30 47 42 37" },
    { viewBox: "0 0 60 60", bottom: '24%', right: '17%', w: 'clamp(35px,4vw,55px)', dDelay: '3.8s', dDur: '6.8s', path: "M30 4 L35 20 L52 20 L39 31 L44 49 L30 39 L16 49 L21 31 L8 20 L25 20 Z" },
    { viewBox: "0 0 62 62", bottom: '11%', right: '7%', w: 'clamp(48px,6vw,78px)', dDelay: '1.2s', dDur: '8.5s', path: "M31 5 L31 57 M5 31 L57 31 M11 11 L51 51 M51 11 L11 51" }
];

function DoodleCanvas() {
    return (
        <div className="doodle-canvas" aria-hidden="true">
            {DOODLES.map((d, i) => (
                <motion.div
                    key={i}
                    style={{ position: 'absolute', top: d.top, bottom: d.bottom, left: d.left, right: d.right, width: d.w, overflow: 'visible' }}
                    animate={{ y: [0, -15, 0], rotate: [0, i % 2 === 0 ? 5 : -5, 0] }}
                    transition={{ duration: 6 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                >
                    <svg viewBox={d.viewBox} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        <path className="doodle-path" style={{ animationDelay: d.dDelay, animationDuration: d.dDur }} pathLength="300" d={d.path} />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}`;

const start = content.indexOf('/* ── Doodle Canvas:');
const end = content.indexOf('export default function Home() {') - 1;

content = content.substring(0, start) + replacement + '\n\n' + content.substring(end);

fs.writeFileSync(file, content);
console.log('Successfully updated DoodleCanvas');
