const form = document.querySelector("#warikan-form");
const totalAmountInput = document.querySelector("#totalAmount");
const peopleCountInput = document.querySelector("#peopleCount");
const errorMessageEl = document.querySelector("#errorMessage");
const rawPerPersonEl = document.querySelector("#rawPerPerson");
const perPersonEl = document.querySelector("#perPerson");
const collectedTotalEl = document.querySelector("#collectedTotal");
const remainderEl = document.querySelector("#remainder");

if (
  !form ||
  !totalAmountInput ||
  !peopleCountInput ||
  !errorMessageEl ||
  !rawPerPersonEl ||
  !perPersonEl ||
  !collectedTotalEl ||
  !remainderEl
) {
  throw new Error("必要な要素が見つかりません。index.html を開いてください。");
}

const formatter = new Intl.NumberFormat("ja-JP");

function applyRounding(value, mode) {
  if (mode === "ceil1") {
    return Math.ceil(value);
  }
  return value;
}

function formatYen(value) {
  return `${formatter.format(value)}円`;
}

function formatRawYen(value) {
  return `${value.toLocaleString("ja-JP", { maximumFractionDigits: 2 })}円`;
}

function resetResult() {
  rawPerPersonEl.textContent = "-";
  perPersonEl.textContent = "-";
  collectedTotalEl.textContent = "-";
  remainderEl.textContent = "-";
}

function setError(message) {
  errorMessageEl.textContent = message;
}

function validateInput(totalAmount, peopleCount) {
  if (!Number.isFinite(totalAmount) || !Number.isFinite(peopleCount)) {
    return "数値を入力してください。";
  }
  if (!Number.isInteger(totalAmount) || !Number.isInteger(peopleCount)) {
    return "小数ではなく整数で入力してください。";
  }
  if (totalAmount < 1 || totalAmount > 99999999) {
    return "合計金額は1〜99,999,999円で入力してください。";
  }
  if (peopleCount < 1 || peopleCount > 1000) {
    return "人数は1〜1,000人で入力してください。";
  }
  return "";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const totalAmount = Number(formData.get("totalAmount"));
  const peopleCount = Number(formData.get("peopleCount"));
  const rounding = String(formData.get("rounding") || "ceil1");

  const validationMessage = validateInput(totalAmount, peopleCount);
  if (validationMessage) {
    setError(validationMessage);
    resetResult();
    return;
  }
  setError("");

  const rawPerPerson = totalAmount / peopleCount;
  const perPerson = applyRounding(rawPerPerson, rounding);
  const collectedTotal = perPerson * peopleCount;
  const remainder = collectedTotal - totalAmount;

  rawPerPersonEl.textContent = formatRawYen(rawPerPerson);
  perPersonEl.textContent = formatYen(perPerson);
  collectedTotalEl.textContent = formatYen(collectedTotal);
  remainderEl.textContent = formatYen(remainder);
});

[totalAmountInput, peopleCountInput].forEach((inputEl) => {
  inputEl.addEventListener("input", () => {
    setError("");
  });
});
