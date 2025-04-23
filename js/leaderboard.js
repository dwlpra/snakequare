let refreshIntervalId = null;


const modal = document.getElementById("leaderboardModal");
const btn = document.getElementById("leaderboardButton");
const span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    loadLeaderboard();
    modal.style.display = "block";
  
    // ✅ Mulai auto-refresh setiap 10 detik
    if (!refreshIntervalId) { 
      refreshIntervalId = setInterval(() => {
        loadLeaderboard();
      }, 10000); // 10000ms = 10 detik
    }
  };

  span.onclick = function() {
    modal.style.display = "none";
  
    // ✅ Hentikan auto-refresh saat modal ditutup
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      refreshIntervalId = null;
    }
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
  
      // ✅ Hentikan auto-refresh juga
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
        refreshIntervalId = null;
      }
    }
  };
  async function loadLeaderboard(type = "all") {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        const spinner = document.getElementById("loadingSpinner");
        const refreshSpinner = document.getElementById("refreshSpinner");
        const listElement = document.getElementById("leaderboardList");

        try {
            if (listElement.innerHTML === "") {
                // Kalau list kosong (pertama buka), pakai loading spinner besar
                spinner.style.display = "block";
                listElement.style.display = "none";
            } else {
                // Kalau sudah ada data, saat refresh, tampilkan spinner kecil
                refreshSpinner.style.display = "block";
            }

            let leaderboard;
            if (type === "daily") {
                leaderboard = await contract.getTopScoresDaily();
            } else if (type === "weekly") {
                leaderboard = await contract.getTopScoresWeekly();
            } else {
                leaderboard = await contract.getTopScores();
            }

            const leaderboardArray = Array.from(leaderboard);

            listElement.innerHTML = "";

            if (leaderboardArray.length === 0) {
                const item = document.createElement("li");
                item.style.textAlign = "center";
                item.style.padding = "12px";
                item.innerText = "No scores yet.";
                listElement.appendChild(item);
            } else {
                leaderboardArray
                .sort((a, b) => Number(b.score) - Number(a.score))
                .slice(0, 10)
                .forEach((entry, index) => {
                    const item = document.createElement("li");
            
                    const lastSubmittedPlayer = localStorage.getItem("lastSubmittedPlayer") || "";
            
                    if (index === 0) {
                        // ✅ Tambahkan highlight kalau rank 1
                        item.classList.add("top-score");
                    } else if (entry.player.toLowerCase() === lastSubmittedPlayer) {
                        // ✅ Tetap highlight kalau player baru submit
                        item.classList.add("highlight");
                    }
            
                    item.innerText = `${index + 1}. ${entry.username} - ${entry.score} pts`;
                    listElement.appendChild(item);
                });
            }

        } catch (error) {
            console.error("Error loading leaderboard:", error);
        } finally {
            spinner.style.display = "none";
            refreshSpinner.style.display = "none";
            listElement.style.display = "block";
        }
    }
}
const tabs = document.querySelectorAll(".leaderboard-tab");
tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    loadLeaderboard(tab.dataset.type);
  };
});