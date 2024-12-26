const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

// Les options de la roue et leurs probabilités (%)
const options = [
    { label: "Chef", chance: 0.5 },
    { label: "Chef adjoint", chance: 24 },
    { label: "Aîné", chance: 24 },
    { label: "Membre", chance: 24 },
    { label: "Exclu", chance: 27.5 },
];

const colors = ["#FF5733", "#33FF57", "#3357FF", "#F5B041", "#FFC300"];
const totalChance = options.reduce((sum, opt) => sum + opt.chance, 0);
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = centerX;
let spinAngle = 0;  // Variable pour suivre l'angle de rotation
let spinning = false;  // Contrôler si la roue est en train de tourner
let spinDuration = 15000;  // Durée de l'animation en millisecondes (15 secondes)
let finalAngle = 0;  // Angle de la fin de la rotation

// Fonction pour dessiner la roue
function drawWheel() {
    const sliceAngle = (2 * Math.PI) / options.length; // Chaque segment a un angle égal
    let startAngle = 0;

    options.forEach((option, index) => {
        // Dessiner le segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        ctx.stroke();

        // Ajouter le texte
        const textAngle = startAngle + sliceAngle / 2;
        const textX = centerX + Math.cos(textAngle) * (radius / 1.5);
        const textY = centerY + Math.sin(textAngle) * (radius / 1.5);
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(option.label, textX, textY);

        startAngle += sliceAngle;
    });
}

// Fonction pour faire tourner la roue avec animation
function spinWheel() {
    if (spinning) return; // Empêche de lancer une nouvelle rotation pendant l'animation

    spinning = true;
    const startTime = Date.now();
    const randomSpin = Math.random() * 2 * Math.PI;  // Angle de fin aléatoire
    finalAngle = randomSpin;

    // Animation de rotation
    function animateSpin() {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / spinDuration, 1);  // Progrès de l'animation (0 à 1)

        // Calcul de l'angle de rotation
        spinAngle = (finalAngle * progress) + (Math.PI * 2 * progress);

        // Réappliquer l'animation
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(spinAngle);  // Appliquer la rotation
        ctx.translate(-centerX, -centerY);
        drawWheel();
        ctx.restore();

        // Simuler un effet de suspense : ralentir avant de s'arrêter
        if (progress < 0.8) {
            requestAnimationFrame(animateSpin);  // Continue à tourner vite
        } else {
            // L'effet de ralentissement
            setTimeout(() => {
                // Afficher le résultat après un court délai pour l'effet de suspense
                const winningSegment = pickRandomSegment();
                document.getElementById("result").innerText = `Résultat : ${winningSegment.label}`;
                spinning = false; // Fin de l'animation
            }, 500);
        }
    }

    // Démarrer l'animation
    animateSpin();
}

// Fonction pour déterminer un segment gagnant selon les probabilités
function pickRandomSegment() {
    const random = Math.random() * totalChance;
    let cumulativeChance = 0;

    for (const option of options) {
        cumulativeChance += option.chance;
        if (random <= cumulativeChance) {
            return option;
        }
    }
}

drawWheel();
