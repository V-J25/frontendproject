document.addEventListener("DOMContentLoaded", function () {
  const search = document.getElementById("searchbut");
  const usernameInput = document.querySelector("#username");
  const regex = /^[a-zA-Z0-9_-]{1,20}$/;

  const easyProgressCircle = document.querySelector(".progress_easy");
  const mediumProgressCircle = document.querySelector(".progress_medium");
  const hardProgressCircle = document.querySelector(".progress_hard");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");

  function updateProgress(total, solved, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degrees", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function isValid(username) {
    const cleanusername = username.trim();
    if (cleanusername === "") {
      alert("empty hai");
      return false;
    }
    return regex.test(cleanusername);
  }

  async function fetchdetails(username) {
    search.innerText = "searching...";
    search.disabled = true;

    try {
      const url = `https://leetcode-api-pied.vercel.app/user/${username}`;
      const response = await fetch(url); // GET request only

      if (!response.ok) {
        throw new Error("Unable to find user");
      }

      const data = await response.json();
      console.log("data:", data);
      const meraData = data.submitStats.acSubmissionNum;
      // // example display
      const totalSolved = meraData[0].count;
      const totalEasy = meraData[1].count;
      const totalMedium = meraData[2].count;
      const totalHard = meraData[3].count;

      alert(
        `Solved: ${totalSolved}\nEasy: ${totalEasy}\nMedium: ${totalMedium}\nHard: ${totalHard}`,
      );

      updateProgress(totalSolved, totalEasy, easyLabel, easyProgressCircle);
      updateProgress(
        totalSolved,
        totalMedium,
        mediumLabel,
        mediumProgressCircle,
      );
      updateProgress(totalSolved, totalHard, hardLabel, hardProgressCircle);
    } catch (error) {
      console.log(error);
      // alert("Not found or blocked by CORS");
    } finally {
      search.innerText = "search";
      search.disabled = false;
    }
  }

  search.addEventListener("click", () => {
    console.log(usernameInput.value);
    const username = usernameInput.value;
    if (isValid(username)) {
      fetchdetails(username.trim());
    } else {
      alert("Invalid");
    }
  });
});
