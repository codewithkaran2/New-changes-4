// survivalMode.js // ============================ // CHAOS KEYBOARD BATTLE - SURVIVAL MODE (with Leaderboard integration) // ============================

let canvas, ctx; let paused = false; let gameOverState = false; let startTime = 0; let pauseStartTime = 0; let totalPausedTime = 0; let enemySpawnInterval, powerUpSpawnInterval; const enemySpawnRate = 2000; const powerUpSpawnRate = 10000; let animationFrameId;

// Audio elements (from index.html) let bgMusic, shootSound, hitSound, shieldBreakSound;

// Player name let playerName = 'Player 1';

// Entity arrays const enemies = []; const enemyBullets = []; const powerUps = [];

// Player setup const player = { x: 0, y: 0, width: 50, height: 50, speed: 5, baseSpeed: 5, health: 100, score: 0, bullets: [], shieldActive: false, dashCooldown: 0, lastShot: 0, };

// Input state const keys = {};

// ... existing game functions ...

function showLoseScreen() { gameOverState = true; clearInterval(enemySpawnInterval); clearInterval(powerUpSpawnInterval); if (bgMusic) bgMusic.pause(); const title = document.getElementById('gameOverTitle'); title && (title.innerText = ${playerName} 👎🏻!); document.getElementById('gameOverScreen')?.classList.remove('hidden'); submitScoreAndShow(); // submit & show leaderboard }

function showWinScreen() { gameOverState = true; clearInterval(enemySpawnInterval); clearInterval(powerUpSpawnInterval); if (bgMusic) bgMusic.pause(); const title = document.getElementById('gameOverTitle'); title && (title.innerText = ${playerName} 🏆!); document.getElementById('gameOverScreen')?.classList.remove('hidden'); submitScoreAndShow(); // submit & show leaderboard }

// 1) Send end‑of‑game data to the server, then show leaderboard function submitScoreAndShow() { const elapsed = Math.floor((Date.now() - startTime - totalPausedTime) / 1000); fetch('insert_score.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ player_name: playerName, health_remaining: player.health, score: player.score, waves_survived: getWave(), time_survived: elapsed }) }) .then(res => res.json()) .then(() => fetchLeaderboard()); }

// 2) Fetch the Top 10 and render the table function fetchLeaderboard() { fetch('leaderboard.php') .then(res => res.json()) .then(data => { const tbody = document.querySelector('#leaderboardTable tbody'); tbody.innerHTML = ''; data.forEach((row, i) => { const tr = document.createElement('tr'); // Highlight if this is the current player’s entry if ( row.player_name === playerName && row.score === player.score && row.waves_survived === getWave() ) { tr.classList.add('highlight'); } tr.innerHTML = <td>${i+1}</td> <td>${row.player_name}</td> <td>${row.health_remaining}</td> <td>${row.score}</td> <td>${row.waves_survived}</td> <td>${row.time_survived}</td>; tbody.appendChild(tr); }); document.getElementById('leaderboardScreen').classList.remove('hidden'); }); }

// 3) Open the overlay (used by both main menu & Game Over buttons) function openLeaderboard() { // If we just finished a game, submit first; otherwise just fetch if (gameOverState) { submitScoreAndShow(); } else { fetchLeaderboard(); } }

// 4) Close the overlay function closeLeaderboard() { document.getElementById('leaderboardScreen').classList.add('hidden'); }

// Expose to HTML window.survivalStartGame = survivalStartGame; window.togglePause       = togglePause; window.restartGame       = restartGame; window.playAgain         = playAgain; window.openLeaderboard   = openLeaderboard; window.closeLeaderboard  = closeLeaderboard;

