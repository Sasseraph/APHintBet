const sheetID = "1qPWEuap-FP_FuWgEI9JYOUGmWaXwxVHlQ0rZN8oBGdQ";
const cheeseID = "HB3ombsSS66dmrLmc7SD6w";
var slotName, bet;
var checksDone, checksTotal, hintPoints;
var chance;

function calcOdds() {
  // Store input data
  slotName = document.getElementById("inputName").value;
  bet = +document.getElementById("inputBet").value;

  // Show loading message, reset randomise section
  document.getElementById("results").innerHTML = "Loading...";
  document.getElementById("randBtn").style.visibility = "hidden";
  document.getElementById("randResult").innerHTML = "";

  // Get data
  Promise.all([
    // Cheese
    getField(slotName, "checks_done"),
    getField(slotName, "checks_total"),
    // getHintPoints(slotName),
  ])
    .then(([checksDone, checksTotal]) => {
      // Calculate success
      chance = ((bet / checksTotal) * 6 * 100).toFixed(2);

      // Insert results
      var result = `<h2>Results</h2> \
      <p><b>${slotName}</b> has completed <b>${checksDone} of ${checksTotal}</b> checks.</p>`;

      result += `<p>A bet of <b>${bet}</b> has a <b>${chance}% chance</b> to succeed.</p>`;
      if (bet > checksDone) {
        result += `<p style="color: Tomato">This slot does not currently have enough checks for this bet.</p>`;
      }

      // Insert results
      document.getElementById("results").innerHTML = result;

      // Show randomise button
      document.getElementById("randBtn").style.visibility = "visible";
    })
    .catch(() => {
      console.log("Invalid slot name.");
      document.getElementById("results").innerHTML =
        `<p style="color: Tomato">Slot <b>"${slotName}"</b> not found.</p>`;
    });
}

function randomise() {
  // Random number to 2 decimal points, 0–100
  var rand = (Math.random() * 100).toFixed(2);
  document.getElementById("randResult").innerHTML =
    `Result: <span id="num">${rand}</span>`;

  if (rand <= chance) {
    document.getElementById("num").style.color = "DarkSeaGreen";
  } else {
    document.getElementById("num").style.color = "Tomato";
  }
}

function getField(slot, field) {
  return fetch(
    `https://script.google.com/macros/s/AKfycbz4GTokd-n_hENEv5x3f04jauGVTgv29Fvll_voKPhLnxr83_lgdl5-Rynv8DrxTRpv/exec?id=${cheeseID}&slot=${slot}&field=${field}`,
  ).then((r) => r.json());
}

// async function getHintPoints(slot) {
//   const response = await fetch(
//     `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`,
//   );

//   const text = await response.text();
//   const json = JSON.parse(text.substring(47, text.length - 2));

//   for (const row of json.table.rows) {
//     const colC = row.c[2]?.v;
//     if (colC === slotName) {
//       const colG = row.c[6]?.v;
//       return colG;
//     }
//   }
// }
