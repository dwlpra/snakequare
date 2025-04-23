const contractAddress = "0x196F284CF2907E1fB2EafD5B93A6E95063A87bb1";

const abi = [
  "function submitScore(string username, uint256 score) public",
  "function getTopScores() public view returns (tuple(address player, string username, uint256 score, uint256 timestamp)[])",
  "function getTopScoresDaily() public view returns (tuple(address player, string username, uint256 score, uint256 timestamp)[])",
  "function getTopScoresWeekly() public view returns (tuple(address player, string username, uint256 score, uint256 timestamp)[])"
];

document.getElementById("submitButton").onclick = async function() {
  const username = localStorage.getItem("snakeUsername") || "Anonymous";

  if (score <= 0) {
    alert("You must get a score greater than 0 before submitting!");
    return;
  }

  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const button = document.getElementById("submitButton");
    button.disabled = true;
    button.innerText = "Submitting...";

    try {
      const tx = await contract.submitScore(username, score);
      await tx.wait();

      // ✅ Simpan address terbaru ke localStorage
      const userAddress = (await signer.getAddress()).toLowerCase();
      localStorage.setItem("lastSubmittedPlayer", userAddress);
      
      Toastify({
        text: `🎉 Score submitted!\nPlayer: ${username}`,
        duration: 4000,
        gravity: "top", // 'top' or 'bottom'
        position: "center", // 'left', 'center', or 'right'
        backgroundColor: "#10b981",
        stopOnFocus: true,
      }).showToast();
      loadLeaderboard();
      modal.style.display = "block";
      
    } catch (error) {
      if (error.code === 4001) {
        Toastify({
            text: "Transaction cancelled by user.",
            duration: 4000,
            gravity: "top",
            position: "center",
            backgroundColor: "#f97316", // Orange
            stopOnFocus: true,
          }).showToast();
      } else {
        Toastify({
            text: `Error: ${error.message}`,
            duration: 5000,
            gravity: "top",
            position: "center",
            backgroundColor: "#ef4444",
            stopOnFocus: true,
          }).showToast();
      }
    } finally {
      button.disabled = false;
      button.innerText = "Submit Score to Blockchain";
    }
  } else {
    Toastify({
        text: "Please install MetaMask!",
        duration: 4000,
        gravity: "top",
        position: "center",
        backgroundColor: "#ef4444",
        stopOnFocus: true,
      }).showToast();
  }
};