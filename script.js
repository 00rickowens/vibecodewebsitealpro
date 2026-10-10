"use strict";

const STORAGE_KEYS = {
  expenses: "spendingPost.expenses",
  budget: "spendingPost.monthlyBudget",
  currency: "spendingPost.currency",
  theme: "spendingPost.theme"
};

const CATEGORIES = ["Food and drink", "Transport", "Study", "Shopping", "Bills", "Other"];

const expenseForm = document.querySelector("#expense-form");
const descriptionInput = document.querySelector("#description-input");
const amountInput = document.querySelector("#amount-input");
const dateInput = document.querySelector("#date-input");
const categoryInput = document.querySelector("#category-input");
const categoryFilter = document.querySelector("#category-filter");
const searchInput = document.querySelector("#search-input");
const monthSelect = document.querySelector("#month-select");
const budgetInput = document.querySelector("#budget-input");
const currencySelect = document.querySelector("#currency-select");
const themeSelect = document.querySelector("#theme-select");
const transactionList = document.querySelector("#transaction-list");
const emptyState = document.querySelector("#empty-state");
const resultsLabel = document.querySelector("#results-label");
const formMessage = document.querySelector("#form-message");
const budgetMessage = document.querySelector("#budget-message");
const budgetStatus = document.querySelector("#budget-status");
const budgetMeter = document.querySelector("#budget-meter");
const budgetMeterFill = document.querySelector("#budget-meter-fill");

let expenses = loadExpenses();
let monthlyBudget = loadBudget();
let displayCurrency = loadCurrency();
let currentTheme = loadTheme();
let selectedMonth = getLocalDate().slice(0, 7);
let navigationFlashTimeout;

function getLocalDate() {
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localTime.toISOString().slice(0, 10);
}

function loadExpenses() {
  const savedExpenses = localStorage.getItem(STORAGE_KEYS.expenses);
  if (savedExpenses === null) {
    return [];
  }

  try {
    const parsedExpenses = JSON.parse(savedExpenses);
    if (Array.isArray(parsedExpenses)) {
      return parsedExpenses;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}

function loadBudget() {
  const savedBudget = Number(localStorage.getItem(STORAGE_KEYS.budget));
  if (Number.isFinite(savedBudget) && savedBudget > 0) {
    return savedBudget;
  } else {
    return 0;
  }
}

function loadCurrency() {
  const savedCurrency = localStorage.getItem(STORAGE_KEYS.currency);
  const supportedCurrencies = ["IDR", "USD", "EUR", "GBP"];
  if (supportedCurrencies.includes(savedCurrency)) {
    return savedCurrency;
  } else {
    return "IDR";
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  if (savedTheme === "dark") {
    return "dark";
  } else {
    return "light";
  }
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
}

function saveBudget() {
  localStorage.setItem(STORAGE_KEYS.budget, String(monthlyBudget));
}

function formatMoney(amount) {
  const decimalPlaces = displayCurrency === "IDR" ? 0 : 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: displayCurrency,
    maximumFractionDigits: decimalPlaces
  }).format(amount);
}

function formatDate(dateString) {
  const dateParts = dateString.split("-");
  if (dateParts.length !== 3) {
    return dateString;
  }

  const date = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function escapeHTML(value) {
  const safeText = document.createElement("span");
  safeText.textContent = String(value);
  return safeText.innerHTML;
}

function populateCategories() {
  for (const category of CATEGORIES) {
    const formOption = document.createElement("option");
    formOption.value = category;
    formOption.textContent = category;
    categoryInput.appendChild(formOption);

    const filterOption = document.createElement("option");
    filterOption.value = category;
    filterOption.textContent = category;
    categoryFilter.appendChild(filterOption);
  }
}

function getMonthTransactions() {
  const monthTransactions = [];
  for (const expense of expenses) {
    if (expense.date.slice(0, 7) === selectedMonth) {
      monthTransactions.push(expense);
    }
  }
  return monthTransactions;
}

function calculateMonthTotal(monthTransactions) {
  let total = 0;
  for (const expense of monthTransactions) {
    total = total + Number(expense.amount);
  }
  return total;
}

function updateOverview() {
  const monthTransactions = getMonthTransactions();
  const total = calculateMonthTotal(monthTransactions);
  const remaining = monthlyBudget - total;

  document.querySelector("#monthly-total").textContent = formatMoney(total);
  document.querySelector("#monthly-budget").textContent = formatMoney(monthlyBudget);
  document.querySelector("#remaining-budget").textContent = formatMoney(remaining);
  document.querySelector("#entry-count").textContent = String(monthTransactions.length);
  budgetInput.value = monthlyBudget > 0 ? String(monthlyBudget) : "";

  if (monthlyBudget <= 0) {
    budgetStatus.textContent = "SET A BUDGET";
    budgetMessage.textContent = "Set a budget to see how much you have left.";
    budgetMeterFill.style.width = "0%";
    budgetMeter.setAttribute("aria-valuenow", "0");
  } else if (total > monthlyBudget) {
    const overBy = total - monthlyBudget;
    budgetStatus.textContent = "OVER BUDGET";
    budgetMessage.textContent = "You are over budget by " + formatMoney(overBy) + ".";
    budgetMeterFill.style.width = "100%";
    budgetMeterFill.classList.add("over-budget");
    budgetMeter.setAttribute("aria-valuenow", "100");
  } else {
    const percentUsed = Math.round((total / monthlyBudget) * 100);
    budgetStatus.textContent = "ON YOUR PLAN";
    budgetMessage.textContent = formatMoney(remaining) + " left in your budget.";
    budgetMeterFill.style.width = String(percentUsed) + "%";
    budgetMeterFill.classList.remove("over-budget");
    budgetMeter.setAttribute("aria-valuenow", String(percentUsed));
  }
}

function renderTransactions() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const visibleTransactions = [];

  for (const expense of expenses) {
    const matchesMonth = expense.date.slice(0, 7) === selectedMonth;
    const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory;
    const searchableText = (expense.description + " " + expense.category).toLowerCase();
    const matchesSearch = searchableText.includes(searchTerm);

    if (matchesMonth && matchesCategory && matchesSearch) {
      visibleTransactions.push(expense);
    }
  }

  visibleTransactions.sort(function (first, second) {
    if (first.date < second.date) {
      return 1;
    } else if (first.date > second.date) {
      return -1;
    } else {
      return 0;
    }
  });

  if (visibleTransactions.length === 0) {
    transactionList.innerHTML = "";
    emptyState.hidden = false;
    resultsLabel.textContent = "0 entries shown";
    return;
  } else {
    emptyState.hidden = true;
  }

  let tableRows = "";
  for (const expense of visibleTransactions) {
    tableRows += "<tr>" +
      "<td class=\"date-cell\">" + escapeHTML(formatDate(expense.date)) + "</td>" +
      "<td>" + escapeHTML(expense.description) + "</td>" +
      "<td>" + escapeHTML(expense.category) + "</td>" +
      "<td class=\"amount-cell\">" + escapeHTML(formatMoney(Number(expense.amount))) + "</td>" +
      "<td><button class=\"delete-button\" type=\"button\" data-delete-id=\"" + escapeHTML(expense.id) + "\">Remove</button></td>" +
      "</tr>";
  }

  transactionList.innerHTML = tableRows;
  resultsLabel.textContent = String(visibleTransactions.length) + " entr" + (visibleTransactions.length === 1 ? "y" : "ies") + " shown";
}

function renderPage() {
  updateOverview();
  renderTransactions();
}

function showFormMessage(message) {
  formMessage.textContent = message;
}

function handleExpenseSubmit(event) {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);
  const date = dateInput.value;
  const category = categoryInput.value;

  if (description.length === 0) {
    showFormMessage("Add a short description before saving.");
    return;
  } else if (!Number.isFinite(amount) || amount <= 0) {
    showFormMessage("Enter an amount greater than zero.");
    return;
  } else if (date.length === 0) {
    showFormMessage("Choose the date of this spending.");
    return;
  } else {
    const transactionId = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now());

    expenses.push({
      id: transactionId,
      description: description,
      amount: amount,
      date: date,
      category: category
    });
    saveExpenses();
    expenseForm.reset();
    dateInput.value = getLocalDate();
    showFormMessage("Entry saved to your spending log.");
    renderPage();
  }
}

function handleBudgetSave() {
  const nextBudget = Number(budgetInput.value);

  if (!Number.isFinite(nextBudget) || nextBudget <= 0) {
    budgetStatus.textContent = "CHECK AMOUNT";
    budgetMessage.textContent = "Enter a monthly budget greater than zero.";
  } else {
    monthlyBudget = nextBudget;
    saveBudget();
    renderPage();
  }
}

function handleTransactionClick(event) {
  const removeButton = event.target.closest("[data-delete-id]");
  if (removeButton === null) {
    return;
  }

  const transactionId = removeButton.getAttribute("data-delete-id");
  expenses = expenses.filter(function (expense) {
    return expense.id !== transactionId;
  });
  saveExpenses();
  renderPage();
}

function flashNavigationDestination(event) {
  const navigationLink = event.currentTarget;
  const targetId = navigationLink.getAttribute("href").slice(1);
  const destination = document.getElementById(targetId);

  if (destination === null) {
    return;
  }

  document.querySelectorAll(".destination-flash").forEach(function (element) {
    element.classList.remove("destination-flash");
  });
  document.querySelectorAll(".nav-flash").forEach(function (element) {
    element.classList.remove("nav-flash");
  });

  if (navigationFlashTimeout) {
    window.clearTimeout(navigationFlashTimeout);
  }

  void destination.offsetWidth;
  void navigationLink.offsetWidth;
  destination.classList.add("destination-flash");
  navigationLink.classList.add("nav-flash");

  navigationFlashTimeout = window.setTimeout(function () {
    destination.classList.remove("destination-flash");
    navigationLink.classList.remove("nav-flash");
  }, 1000);
}

function initializePage() {
  populateCategories();
  currencySelect.value = displayCurrency;
  themeSelect.value = currentTheme;
  document.documentElement.dataset.theme = currentTheme;
  monthSelect.value = selectedMonth;
  dateInput.value = getLocalDate();
  document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("en", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date());

  expenseForm.addEventListener("submit", handleExpenseSubmit);
  document.querySelector("#save-budget").addEventListener("click", handleBudgetSave);
  transactionList.addEventListener("click", handleTransactionClick);
  document.querySelectorAll(".main-nav a").forEach(function (navigationLink) {
    navigationLink.addEventListener("click", flashNavigationDestination);
  });
  monthSelect.addEventListener("change", function () {
    selectedMonth = monthSelect.value || getLocalDate().slice(0, 7);
    renderPage();
  });
  categoryFilter.addEventListener("change", renderTransactions);
  searchInput.addEventListener("input", renderTransactions);
  currencySelect.addEventListener("change", function () {
    displayCurrency = currencySelect.value;
    localStorage.setItem(STORAGE_KEYS.currency, displayCurrency);
    renderPage();
  });
  themeSelect.addEventListener("change", function () {
    currentTheme = themeSelect.value === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = currentTheme;
    localStorage.setItem(STORAGE_KEYS.theme, currentTheme);
  });

  renderPage();
}

initializePage();