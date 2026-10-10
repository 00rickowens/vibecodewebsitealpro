"use strict";

const STORAGE_KEYS = {
  expenses: "spendingPost.expenses",
  budget: "spendingPost.monthlyBudget",
  currency: "spendingPost.currency",
  theme: "spendingPost.theme",
  language: "spendingPost.language"
};

const CATEGORIES = ["Food and drink", "Transport", "Study", "Shopping", "Bills", "Other"];

const TRANSLATIONS = {
  en: {
    documentTitle:"The Spending Post",metaDescription:"A simple personal spending tracker.",
    personalFinancePage:"PERSONAL FINANCE PAGE",memberYou:"MEMBER: YOU",statusOnline:"STATUS: ONLINE",yourMoneyBusiness:"YOUR MONEY, YOUR BUSINESS",mainNavigation:"Main navigation",
    overviewNav:"Overview",addSpendingNav:"Add spending",spendingLogNav:"Spending log",welcomeKicker:"WELCOME TO YOUR MONEY PAGE",welcomeTitle:"Small purchases add up. Keep track as you go.",
    displayCurrency:"DISPLAY CURRENCY",theme:"THEME",colorTheme:"Color theme",themeLight:"Light",themeDark:"Dark",language:"LANGUAGE",languageLabel:"Language",viewMonth:"VIEW MONTH",
    monthOverview:"YOUR MONTH AT A GLANCE",spentThisMonth:"SPENT THIS MONTH",monthlyBudgetLabel:"MONTHLY BUDGET",leftToSpend:"LEFT TO SPEND",entriesThisMonth:"ENTRIES THIS MONTH",
    monthlyBudgetPlan:"MONTHLY BUDGET PLAN",setABudget:"SET A BUDGET",overBudget:"OVER BUDGET",onYourPlan:"ON YOUR PLAN",checkAmount:"CHECK AMOUNT",
    yourMonthlyLimit:"Your monthly limit",enterAnAmount:"Enter an amount",saveBudget:"Save budget",monthlyBudgetUsed:"Monthly budget used",setBudgetHint:"Set a budget to see how much you have left.",
    budgetOverBy:"You are over budget by {amount}.",budgetLeft:"{amount} left in your budget.",invalidMonthlyBudget:"Enter a monthly budget greater than zero.",
    addSpendingEntry:"ADD A SPENDING ENTRY",newPost:"NEW POST",descriptionLabel:"What did you spend on?",descriptionPlaceholder:"For example, lunch",amount:"Amount",date:"Date",category:"Category",recordSpending:"Record spending",
    descriptionRequired:"Add a short description before saving.",amountRequired:"Enter an amount greater than zero.",dateRequired:"Choose the date of this spending.",entrySaved:"Entry saved to your spending log.",
    latestEntriesFirst:"LATEST ENTRIES FIRST",allCategories:"All categories",search:"SEARCH",searchPlaceholder:"Find an entry",dateColumn:"DATE",whatColumn:"WHAT",action:"ACTION",
    emptyEntries:"No entries match this view. Add a spending entry to get started.",noEntriesShown:"0 entries shown",oneEntryShown:"1 entry shown",manyEntriesShown:"{count} entries shown",remove:"Remove",
    footerLine:"THE SPENDING POST / KEEP IT SIMPLE / CHECK IN OFTEN",footerLocalStorage:"Your entries stay in this browser on this device.",
    categories:["Food and drink","Transport","Study","Shopping","Bills","Other"]
  },
  id: {
    documentTitle:"Catatan Pengeluaran",metaDescription:"Pencatat pengeluaran pribadi yang sederhana.",
    personalFinancePage:"HALAMAN KEUANGAN PRIBADI",memberYou:"ANGGOTA: ANDA",statusOnline:"STATUS: AKTIF",yourMoneyBusiness:"UANG ANDA, URUSAN ANDA",mainNavigation:"Navigasi utama",
    overviewNav:"Ringkasan",addSpendingNav:"Tambah pengeluaran",spendingLogNav:"Daftar pengeluaran",welcomeKicker:"SELAMAT DATANG DI HALAMAN KEUANGAN ANDA",welcomeTitle:"Pengeluaran kecil bisa menumpuk. Catat saat terjadi.",
    displayCurrency:"MATA UANG",theme:"TEMA",colorTheme:"Tema warna",themeLight:"Terang",themeDark:"Gelap",language:"BAHASA",languageLabel:"Bahasa",viewMonth:"LIHAT BULAN",
    monthOverview:"RINGKASAN BULAN INI",spentThisMonth:"PENGELUARAN BULAN INI",monthlyBudgetLabel:"ANGGARAN BULANAN",leftToSpend:"SISA ANGGARAN",entriesThisMonth:"CATATAN BULAN INI",
    monthlyBudgetPlan:"RENCANA ANGGARAN BULANAN",setABudget:"ATUR ANGGARAN",overBudget:"ANGGARAN TERLAMPAUI",onYourPlan:"SESUAI ANGGARAN",checkAmount:"PERIKSA JUMLAH",
    yourMonthlyLimit:"Batas bulanan Anda",enterAnAmount:"Masukkan jumlah",saveBudget:"Simpan anggaran",monthlyBudgetUsed:"Anggaran bulanan yang digunakan",setBudgetHint:"Atur anggaran untuk melihat sisa uang Anda.",
    budgetOverBy:"Pengeluaran melebihi anggaran sebesar {amount}.",budgetLeft:"Sisa anggaran Anda {amount}.",invalidMonthlyBudget:"Masukkan anggaran bulanan lebih dari nol.",
    addSpendingEntry:"TAMBAH CATATAN PENGELUARAN",newPost:"CATATAN BARU",descriptionLabel:"Apa yang Anda beli?",descriptionPlaceholder:"Contoh: makan siang",amount:"Jumlah",date:"Tanggal",category:"Kategori",recordSpending:"Simpan pengeluaran",
    descriptionRequired:"Tambahkan keterangan singkat sebelum menyimpan.",amountRequired:"Masukkan jumlah lebih dari nol.",dateRequired:"Pilih tanggal pengeluaran ini.",entrySaved:"Catatan tersimpan di daftar pengeluaran.",
    latestEntriesFirst:"CATATAN TERBARU DI ATAS",allCategories:"Semua kategori",search:"CARI",searchPlaceholder:"Cari catatan",dateColumn:"TANGGAL",whatColumn:"KETERANGAN",action:"TINDAKAN",
    emptyEntries:"Tidak ada catatan yang cocok. Tambahkan pengeluaran untuk memulai.",noEntriesShown:"0 catatan ditampilkan",oneEntryShown:"1 catatan ditampilkan",manyEntriesShown:"{count} catatan ditampilkan",remove:"Hapus",
    footerLine:"CATATAN PENGELUARAN / TETAP SEDERHANA / PERIKSA SECARA RUTIN",footerLocalStorage:"Catatan tersimpan di browser pada perangkat ini.",
    categories:["Makanan dan minuman","Transportasi","Pendidikan","Belanja","Tagihan","Lainnya"]
  }
};

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
const languageSelect = document.querySelector("#language-select");
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
let currentLanguage = loadLanguage();
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

function loadLanguage() {
  const savedLanguage = localStorage.getItem(STORAGE_KEYS.language);
  if (savedLanguage === "id") {
    return "id";
  } else {
    return "en";
  }
}

function translate(key) {
  return TRANSLATIONS[currentLanguage][key];
}

function getLocale() {
  return currentLanguage === "id" ? "id-ID" : "en-US";
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
}

function saveBudget() {
  localStorage.setItem(STORAGE_KEYS.budget, String(monthlyBudget));
}

function formatMoney(amount) {
  const decimalPlaces = displayCurrency === "IDR" ? 0 : 2;
  return new Intl.NumberFormat(getLocale(), {
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
  return new Intl.DateTimeFormat(getLocale(), {
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

function displayCategory(category) {
  const categoryIndex = CATEGORIES.indexOf(category);
  if (categoryIndex < 0) {
    return category;
  } else {
    return TRANSLATIONS[currentLanguage].categories[categoryIndex];
  }
}

function populateCategories() {
  const previousFormCategory = categoryInput.value;
  const previousFilterCategory = categoryFilter.value || "all";
  categoryInput.innerHTML = "";
  categoryFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = translate("allCategories");
  categoryFilter.appendChild(allOption);

  for (const category of CATEGORIES) {
    const formOption = document.createElement("option");
    formOption.value = category;
    formOption.textContent = displayCategory(category);
    categoryInput.appendChild(formOption);
    const filterOption = document.createElement("option");
    filterOption.value = category;
    filterOption.textContent = displayCategory(category);
    categoryFilter.appendChild(filterOption);
  }
  if (CATEGORIES.includes(previousFormCategory)) categoryInput.value = previousFormCategory;
  categoryFilter.value = previousFilterCategory;
}

function applyLanguage() {
  const locale = getLocale();
  document.documentElement.lang = currentLanguage;
  document.title = translate("documentTitle");
  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    element.textContent = translate(element.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
    element.placeholder = translate(element.getAttribute("data-i18n-placeholder"));
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach(function (element) {
    element.setAttribute("aria-label", translate(element.getAttribute("data-i18n-aria-label")));
  });
  document.querySelectorAll("[data-i18n-content]").forEach(function (element) {
    element.setAttribute("content", translate(element.getAttribute("data-i18n-content")));
  });
  document.querySelector("#today-label").textContent = new Intl.DateTimeFormat(locale, {
    weekday: "short",day: "2-digit",month: "short",year: "numeric"
  }).format(new Date());
  populateCategories();
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
    budgetStatus.textContent = translate("setABudget");
    budgetMessage.textContent = translate("setBudgetHint");
    budgetMeterFill.style.width = "0%";
    budgetMeter.setAttribute("aria-valuenow", "0");
  } else if (total > monthlyBudget) {
    const overBy = total - monthlyBudget;
    budgetStatus.textContent = translate("overBudget");
    budgetMessage.textContent = translate("budgetOverBy").replace("{amount}", formatMoney(overBy));
    budgetMeterFill.style.width = "100%";
    budgetMeterFill.classList.add("over-budget");
    budgetMeter.setAttribute("aria-valuenow", "100");
  } else {
    const percentUsed = Math.round((total / monthlyBudget) * 100);
    budgetStatus.textContent = translate("onYourPlan");
    budgetMessage.textContent = translate("budgetLeft").replace("{amount}", formatMoney(remaining));
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
    const searchableText = (expense.description + " " + expense.category + " " + displayCategory(expense.category)).toLowerCase();
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
    resultsLabel.textContent = translate("noEntriesShown");
    return;
  } else {
    emptyState.hidden = true;
  }

  let tableRows = "";
  for (const expense of visibleTransactions) {
    tableRows += "<tr>" +
      "<td class=\"date-cell\">" + escapeHTML(formatDate(expense.date)) + "</td>" +
      "<td>" + escapeHTML(expense.description) + "</td>" +
      "<td>" + escapeHTML(displayCategory(expense.category)) + "</td>" +
      "<td class=\"amount-cell\">" + escapeHTML(formatMoney(Number(expense.amount))) + "</td>" +
      "<td><button class=\"delete-button\" type=\"button\" data-delete-id=\"" + escapeHTML(expense.id) + "\">" + escapeHTML(translate("remove")) + "</button></td>" +
      "</tr>";
  }

  transactionList.innerHTML = tableRows;
  if (visibleTransactions.length === 1) {
    resultsLabel.textContent = translate("oneEntryShown");
  } else {
    resultsLabel.textContent = translate("manyEntriesShown").replace("{count}", String(visibleTransactions.length));
  }
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
    showFormMessage(translate("descriptionRequired"));
    return;
  } else if (!Number.isFinite(amount) || amount <= 0) {
    showFormMessage(translate("amountRequired"));
    return;
  } else if (date.length === 0) {
    showFormMessage(translate("dateRequired"));
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
    showFormMessage(translate("entrySaved"));
    renderPage();
  }
}

function handleBudgetSave() {
  const nextBudget = Number(budgetInput.value);

  if (!Number.isFinite(nextBudget) || nextBudget <= 0) {
    budgetStatus.textContent = translate("checkAmount");
    budgetMessage.textContent = translate("invalidMonthlyBudget");
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
  currencySelect.value = displayCurrency;
  themeSelect.value = currentTheme;
  languageSelect.value = currentLanguage;
  document.documentElement.dataset.theme = currentTheme;
  monthSelect.value = selectedMonth;
  dateInput.value = getLocalDate();
  applyLanguage();

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
  languageSelect.addEventListener("change", function () {
    currentLanguage = languageSelect.value === "id" ? "id" : "en";
    localStorage.setItem(STORAGE_KEYS.language, currentLanguage);
    applyLanguage();
    formMessage.textContent = "";
    renderPage();
  });

  renderPage();
}

initializePage();