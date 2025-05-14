// This event listener ensures that the script runs only after the entire HTML document has been fully loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {
    // Log to the console to confirm that the main JavaScript file has been loaded.
    console.log('Budget Planner main.js loaded.');

    // --- DOM Element References ---
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const authMessage = document.getElementById('auth-message');
    const pageTitleElement = document.getElementById('page-title');
    const entriesListDiv = document.getElementById('entries-list');
    const appSidebar = document.getElementById('app-sidebar');
    const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const appContainerElement = document.getElementById('app-container');
    const headerThemeToggleButton = document.getElementById('header-theme-toggle-button');
    const themeIcon = document.getElementById('theme-icon');
    const profilePictureButton = document.getElementById('profile-picture-button');
    const profileDropdownMenu = document.getElementById('profile-dropdown-menu');
    const dropdownUsernameDisplay = document.getElementById('dropdown-username');
    const dropdownSettingsLink = document.getElementById('dropdown-settings-link');
    const dropdownLogoutButton = document.getElementById('dropdown-logout-button');
    const headerPfpImage = document.getElementById('pfp-image-placeholder');
    const addEntryForm = document.getElementById('add-entry-form');
    const entryFormMessage = document.getElementById('entry-form-message');
    const entryFormTitle = document.getElementById('entry-form-title');
    const entryIdHiddenInput = document.getElementById('entry-id-hidden');
    const entryFormSubmitButton = document.getElementById('entry-form-submit-button');
    const entryFormCancelButton = document.getElementById('entry-form-cancel-button');
    const goalsListDiv = document.getElementById('goals-list');
    const addGoalForm = document.getElementById('add-goal-form');
    const goalFormMessage = document.getElementById('goal-form-message');
    const goalFormTitle = document.getElementById('goal-form-title');
    const goalIdHiddenInput = document.getElementById('goal-id-hidden');
    const goalFormSubmitButton = document.getElementById('goal-form-submit-button');
    const goalFormCancelButton = document.getElementById('goal-form-cancel-button');
    const editProfileForm = document.getElementById('edit-profile-form');
    const editProfileFormMessage = document.getElementById('edit-profile-form-message');
    const profileNameDisplay = document.getElementById('profile-name-display');
    const profileJoinedDateDisplay = document.getElementById('profile-joined-date-display');
    const changePasswordLink = document.getElementById('change-password-link');
    const changePasswordFormNew = document.getElementById('change-password-form-new');
    const changePasswordFormMessageNew = document.getElementById('change-password-form-message-new');
    const cancelChangePasswordButton = document.getElementById('cancel-change-password-button');
    const settingsPfpPreviewLarge = document.getElementById('settings-pfp-preview-large');
    const editPfpButton = document.getElementById('edit-pfp-button');
    const pfpFileInput = document.getElementById('pfp-file-input');
    const setPfpFormMessageNew = document.getElementById('set-pfp-form-message-new');
    const spendingByCategoryContainer = document.getElementById('spending-by-category-container');
    const incomeVsExpenseContainer = document.getElementById('income-vs-expense-container');
    const analyticsStartDateInput = document.getElementById('analytics-start-date');
    const analyticsEndDateInput = document.getElementById('analytics-end-date');
    const applyAnalyticsFiltersBtn = document.getElementById('apply-analytics-filters-btn');
    const summaryBudgetedEl = document.getElementById('summary-budgeted');
    const summarySpentEl = document.getElementById('summary-spent');
    const summarySpentDetailEl = document.getElementById('summary-spent-detail');
    const summarySpentProgressEl = document.getElementById('summary-spent-progress');
    const summaryRemainingEl = document.getElementById('summary-remaining');
    const summaryRemainingDetailEl = document.getElementById('summary-remaining-detail');
    const summaryRemainingProgressEl = document.getElementById('summary-remaining-progress');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const pages = document.querySelectorAll('.page');

    // New DOM Elements for Month Navigation and Budget Modal
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const currentMonthDisplay = document.getElementById('current-month-display');
    const budgetForMonthYearDisplay = document.getElementById('budget-for-month-year');
    const monthlyBudgetAmountDisplay = document.getElementById('monthly-budget-amount');
    const setMonthBudgetBtn = document.getElementById('set-month-budget-btn');
    const budgetModal = document.getElementById('budget-modal');
    const budgetModalTitle = document.getElementById('budget-modal-title');
    const modalCloseBudgetBtn = document.getElementById('modal-close-budget-btn');
    const modalBudgetAmountInput = document.getElementById('modal-budget-amount');
    const modalSaveBudgetBtn = document.getElementById('modal-save-budget-btn');
    const modalBudgetMessage = document.getElementById('modal-budget-message');

    // Month Selector Modal Elements
    const openMonthSelectorBtn = document.getElementById('open-month-selector-btn');
    const monthSelectorModal = document.getElementById('month-selector-modal');
    const modalCloseMonthSelectorBtn = document.getElementById('modal-close-month-selector-btn');
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const modalApplyMonthBtn = document.getElementById('modal-apply-month-btn');
    const modalMonthMessage = document.getElementById('modal-month-message');


    // --- State Variables ---
    let currentUser = null;
    let allUserEntries = [];
    let allUserGoals = [];
    let spendingChartInstance = null;
    let incomeExpenseChartInstance = null;
    let spendingOverviewChartInstance = null;

    // Chart display mode (income, expense)
    let dashboardChartMode = 'expense';
    let insightsChartMode = 'expense';

    // Store the original data for charts
    let dashboardChartData = {};
    let insightsChartData = {};

    let currentDisplayYear;
    let currentDisplayMonth; // 1-indexed (1 for Jan, 12 for Dec)

    const defaultPfpHeader = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236c757d' width='40px' height='40px'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
    const defaultPfpSettingsPreview = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236c757d' width='150px' height='150px'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

    // --- Utility Functions ---
    function displayMessage(message, type = 'error', area = authMessage) {
        if(area) {
            area.textContent = message;
            area.className = `message-area ${type}`;
            area.style.display = 'block';
        } else {
            console.warn("displayMessage: Target message area not found for:", message);
        }
    }

    function clearMessage(area = authMessage) {
        if(area) {
            area.textContent = '';
            area.className = 'message-area';
            area.style.display = 'none';
        }
    }

    function initializeMonthNavigation() {
        const today = new Date();
        currentDisplayYear = today.getFullYear();
        currentDisplayMonth = today.getMonth() + 1; // 1-indexed
        updateDashboardForMonthDisplay(currentDisplayYear, currentDisplayMonth);
        loadDataForMonth(currentDisplayYear, currentDisplayMonth);

        // Initialize month selector modal
        populateYearSelect();
        setupMonthSelectorListeners();
    }

    function populateYearSelect() {
        if (!yearSelect) return;

        // Clear existing options
        yearSelect.innerHTML = '';

        // Get current year
        const currentYear = new Date().getFullYear();

        // Add options for current year and 4 years back
        for (let year = currentYear; year >= currentYear - 4; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    }

    function setupMonthSelectorListeners() {
        // Open month selector modal
        if (openMonthSelectorBtn) {
            openMonthSelectorBtn.addEventListener('click', showMonthSelectorModal);
        }

        // Close month selector modal
        if (modalCloseMonthSelectorBtn) {
            modalCloseMonthSelectorBtn.addEventListener('click', hideMonthSelectorModal);
        }

        // Close modal if user clicks outside of it
        window.addEventListener('click', (event) => {
            if (event.target === monthSelectorModal) {
                hideMonthSelectorModal();
            }
        });

        // Apply selected month and year
        if (modalApplyMonthBtn) {
            modalApplyMonthBtn.addEventListener('click', applySelectedMonthYear);
        }

        // Set initial values in the selectors
        if (monthSelect && yearSelect) {
            monthSelect.value = currentDisplayMonth;
            yearSelect.value = currentDisplayYear;
        }
    }

    function showMonthSelectorModal() {
        if (!monthSelectorModal) return;

        // Update selectors to current display month/year
        if (monthSelect) monthSelect.value = currentDisplayMonth;
        if (yearSelect) yearSelect.value = currentDisplayYear;

        // Clear any messages
        if (modalMonthMessage) {
            clearMessage(modalMonthMessage);
        }

        monthSelectorModal.style.display = 'block';
    }

    function hideMonthSelectorModal() {
        if (monthSelectorModal) {
            monthSelectorModal.style.display = 'none';
        }
    }

    function applySelectedMonthYear() {
        if (!monthSelect || !yearSelect) return;

        const selectedMonth = parseInt(monthSelect.value);
        const selectedYear = parseInt(yearSelect.value);

        // Validate selection - don't allow future months
        const today = new Date();
        const currentSystemMonth = today.getMonth() + 1;
        const currentSystemYear = today.getFullYear();

        if (selectedYear > currentSystemYear ||
            (selectedYear === currentSystemYear && selectedMonth > currentSystemMonth)) {
            if (modalMonthMessage) {
                displayMessage("Cannot view or set budget for future months.", "error", modalMonthMessage);
            }
            return;
        }

        // Update current display month and year
        currentDisplayMonth = selectedMonth;
        currentDisplayYear = selectedYear;

        // Update dashboard display
        updateDashboardForMonthDisplay(currentDisplayYear, currentDisplayMonth);
        loadDataForMonth(currentDisplayYear, currentDisplayMonth);

        // Hide modal
        hideMonthSelectorModal();
    }

    function updateDashboardForMonthDisplay(year, month) {
        const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
        const displayString = `${monthName} ${year}`;
        if (currentMonthDisplay) currentMonthDisplay.textContent = displayString;
        if (budgetForMonthYearDisplay) budgetForMonthYearDisplay.textContent = displayString;
        if (budgetModalTitle) budgetModalTitle.textContent = `Set Budget for ${displayString}`;

        // Set the entry date input to the current month
        if (document.getElementById('entry-date')) {
            const today = new Date();
            let defaultDay = 1;

            // If the selected month is the current month, use today's date
            if (year === today.getFullYear() && month === today.getMonth() + 1) {
                defaultDay = today.getDate();
            }

            // Create a date in the selected month
            const defaultDate = new Date(year, month - 1, defaultDay);

            // Format the date as YYYY-MM-DD for the input
            const formattedDate = defaultDate.toISOString().split('T')[0];
            document.getElementById('entry-date').value = formattedDate;

            // Set min and max date to restrict entries to the selected month
            const lastDay = new Date(year, month, 0).getDate();
            const minDate = `${year}-${month.toString().padStart(2, '0')}-01`;
            const maxDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;

            document.getElementById('entry-date').min = minDate;
            document.getElementById('entry-date').max = maxDate;
        }
    }

    async function loadDataForMonth(year, month) {
        console.log(`Loading data for ${year}-${month}`);
        await loadMonthlyBudget(year, month);
        await loadEntriesForMonth(year, month);
        await loadDashboardSummaryForMonth(year, month);
        await loadSpendingByCategoryForMonth(year, month);
    }

    async function loadMonthlyBudget(year, month) {
        if (!currentUser) return;
        if (monthlyBudgetAmountDisplay) monthlyBudgetAmountDisplay.textContent = 'Loading...';
        try {
            const data = await apiCall(`/api/users/budget/monthly?year=${year}&month=${month}`);
            if (data.isSet && data.budget !== null) {
                if (monthlyBudgetAmountDisplay) monthlyBudgetAmountDisplay.textContent = `₹${parseFloat(data.budget).toFixed(2)}`;
                if (summaryBudgetedEl) summaryBudgetedEl.textContent = `₹${parseFloat(data.budget).toFixed(2)}`;
                // Update currentUser if it stores monthlyBudgets directly
                if (currentUser.monthlyBudgets) {
                    currentUser.monthlyBudgets[`${year}-${month.toString().padStart(2, '0')}`] = parseFloat(data.budget);
                } else {
                    currentUser.monthlyBudgets = { [`${year}-${month.toString().padStart(2, '0')}`]: parseFloat(data.budget) };
                }
                storeUserSession(currentUser); // Save updated user session
            } else {
                if (monthlyBudgetAmountDisplay) monthlyBudgetAmountDisplay.textContent = 'Not Set';
                if (summaryBudgetedEl) summaryBudgetedEl.textContent = `₹0.00`;
                const today = new Date();
                if (year === today.getFullYear() && month === (today.getMonth() + 1)) {
                    showBudgetModal(); // Prompt for current month's budget if not set
                }
            }
        } catch (error) {
            console.error('Failed to load monthly budget:', error);
            if (monthlyBudgetAmountDisplay) monthlyBudgetAmountDisplay.textContent = 'Error';
            if (summaryBudgetedEl) summaryBudgetedEl.textContent = `₹?`;
        }
    }

    // --- Budget Modal Functions ---
    function showBudgetModal() {
        if (!budgetModal || !budgetModalTitle || !modalBudgetAmountInput || !modalBudgetMessage) return;

        const monthName = new Date(currentDisplayYear, currentDisplayMonth - 1, 1).toLocaleString('default', { month: 'long' });
        budgetModalTitle.textContent = `Set Budget for ${monthName} ${currentDisplayYear}`;

        // Pre-fill with existing budget if available
        const budgetKey = `${currentDisplayYear}-${currentDisplayMonth.toString().padStart(2, '0')}`;
        const existingBudget = currentUser.monthlyBudgets && currentUser.monthlyBudgets[budgetKey];
        modalBudgetAmountInput.value = existingBudget !== undefined ? existingBudget : '';

        clearMessage(modalBudgetMessage);
        budgetModal.style.display = 'block';
    }

    function hideBudgetModal() {
        if (budgetModal) budgetModal.style.display = 'none';
    }

    if (setMonthBudgetBtn) {
        setMonthBudgetBtn.addEventListener('click', showBudgetModal);
    }
    if (modalCloseBudgetBtn) {
        modalCloseBudgetBtn.addEventListener('click', hideBudgetModal);
    }
    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === budgetModal) {
            hideBudgetModal();
        }
    });

    if (modalSaveBudgetBtn) {
        modalSaveBudgetBtn.addEventListener('click', async () => {
            if (!modalBudgetAmountInput || !modalBudgetMessage) return;
            const budgetAmountStr = modalBudgetAmountInput.value;
            const budgetAmount = parseFloat(budgetAmountStr);

            if (isNaN(budgetAmount) || budgetAmount < 0) {
                displayMessage('Please enter a valid, non-negative budget amount.', 'error', modalBudgetMessage);
                return;
            }
            clearMessage(modalBudgetMessage);

            try {
                const payload = {
                    year: currentDisplayYear,
                    month: currentDisplayMonth,
                    budget: budgetAmount
                };
                const result = await apiCall('/api/users/budget/monthly', 'POST', payload);

                // Update currentUser with the new budget structure from the response
                if (result.monthlyBudgets) {
                    currentUser.monthlyBudgets = result.monthlyBudgets;
                    storeUserSession(currentUser); // Save updated user session
                }

                displayMessage(result.message || 'Budget saved successfully!', 'success', modalBudgetMessage); // Show success in modal
                await loadDataForMonth(currentDisplayYear, currentDisplayMonth); // Refresh dashboard data
                setTimeout(() => { // Hide modal after a short delay to show success message
                    hideBudgetModal();
                }, 1500);

            } catch (error) {
                displayMessage(error.message || 'Failed to save budget.', 'error', modalBudgetMessage);
            }
        });
    }

    async function loadEntriesForMonth(year, month) {
        if (!currentUser) return;
        if (entriesListDiv) entriesListDiv.innerHTML = '<p>Loading entries...</p>';
        try {
            // Ideally, backend filters entries: /api/entries?year=YYYY&month=MM
            // For now, fetching all and filtering client-side
            allUserEntries = await apiCall(`/api/entries`);
            renderEntriesForMonth(allUserEntries, year, month);
        } catch (error) {
            if (entriesListDiv) entriesListDiv.innerHTML = '<p class="error-message">Could not load entries.</p>';
        }
    }

    function renderEntriesForMonth(entries, year, month) {
        if (!entriesListDiv) return;

        const filteredEntries = entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getFullYear() === year && (entryDate.getMonth() + 1) === month;
        });

        if (!filteredEntries || filteredEntries.length === 0) {
            const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
            entriesListDiv.innerHTML = `<p>No entries found for ${monthName} ${year}.</p>`;
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'entries-ul';
        filteredEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        filteredEntries.forEach(entry => {
            const li = document.createElement('li');
            li.className = `entry-item ${entry.type}`;
            const dateFormatted = new Date(entry.date).toLocaleDateString();
            const amountFormatted = parseFloat(entry.amount).toFixed(2);
            li.innerHTML = `
                <div class="entry-details">
                    <span class="entry-date">${dateFormatted}</span>
                    <span class="entry-category">${entry.category}</span>
                    <span class="entry-description">${entry.description || ''}</span>
                </div>
                <div class="entry-amount ${entry.type === 'income' ? 'amount-income' : 'amount-expense'}">
                    ${entry.type === 'income' ? '+' : '-'}₹${amountFormatted}
                </div>
                <div class="entry-actions">
                    <button class="edit-entry-btn" data-id="${entry.id}">Edit</button>
                    <button class="delete-entry-btn" data-id="${entry.id}">Delete</button>
                </div>`;
            ul.appendChild(li);
        });
        ul.querySelectorAll('.delete-entry-btn').forEach(button => button.addEventListener('click', handleDeleteEntry));
        ul.querySelectorAll('.edit-entry-btn').forEach(button => button.addEventListener('click', handleEditEntry));
        entriesListDiv.innerHTML = '';
        entriesListDiv.appendChild(ul);
    }

    async function loadDashboardSummaryForMonth(year, month) {
        if (!currentUser) return;

        const firstDayOfMonth = new Date(year, month - 1, 1).toISOString().split('T')[0];
        const lastDayOfMonth = new Date(year, month, 0).toISOString().split('T')[0];

        try {
            const monthlyAnalytics = await apiCall(`/api/analytics/income-vs-expense?startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}`);

            let currentMonthBudget = 0;
            const budgetData = currentUser.monthlyBudgets && currentUser.monthlyBudgets[`${year}-${month.toString().padStart(2, '0')}`];
            if (budgetData !== undefined && budgetData !== null) {
                currentMonthBudget = parseFloat(budgetData);
            }

            // Update the main budget display element if it exists and is for the dashboard
            if (summaryBudgetedEl && document.getElementById('dashboard-page').classList.contains('active')) {
                 summaryBudgetedEl.textContent = `₹${currentMonthBudget.toFixed(2)}`;
            }

            const actualExpenses = monthlyAnalytics.totalExpense || 0;
            const actualIncome = monthlyAnalytics.totalIncome || 0;

            // Update income display
            const summaryIncomeEl = document.getElementById('summary-income');
            const summaryIncomeDetailEl = document.getElementById('summary-income-detail');

            if (summaryIncomeEl) summaryIncomeEl.textContent = `₹${actualIncome.toFixed(2)}`;

            // Update expense display
            if (summarySpentEl) summarySpentEl.textContent = `₹${actualExpenses.toFixed(2)}`;

            const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
            if (summarySpentDetailEl) summarySpentDetailEl.textContent = `in ${monthName}`;
            if (summaryIncomeDetailEl) summaryIncomeDetailEl.textContent = `in ${monthName}`;

            // Calculate remaining as Budget + Income - Expense
            const remainingBudget = currentMonthBudget + actualIncome - actualExpenses;
            if (summaryRemainingEl) summaryRemainingEl.textContent = `₹${remainingBudget.toFixed(2)}`;

            if (summaryRemainingDetailEl) {
                if (remainingBudget >= 0) {
                    summaryRemainingDetailEl.textContent = `Available funds`;
                    summaryRemainingDetailEl.style.color = 'var(--success-color, green)'; // Use CSS var if defined
                } else {
                    summaryRemainingDetailEl.textContent = `Deficit`;
                    summaryRemainingDetailEl.style.color = 'var(--error-color, red)'; // Use CSS var if defined
                }
            }

            // Calculate spent percentage relative to budget
            const spentPercentage = currentMonthBudget > 0 ? (actualExpenses / currentMonthBudget) * 100 : (actualExpenses > 0 ? 100 : 0);
            if (summarySpentProgressEl) summarySpentProgressEl.style.width = `${Math.min(100, Math.max(0, spentPercentage))}%`;

            // Calculate remaining percentage relative to total available funds (budget + income)
            const totalAvailable = currentMonthBudget + actualIncome;
            const remainingPercentage = totalAvailable > 0 ? (remainingBudget / totalAvailable) * 100 : 0;

            if (summaryRemainingProgressEl) {
                if (remainingBudget >= 0) {
                    summaryRemainingProgressEl.style.width = `${Math.max(0, Math.min(100, remainingPercentage))}%`;
                    summaryRemainingProgressEl.style.backgroundColor = 'var(--success-color, #2ECC71)';
                } else {
                    // For deficit, progress bar could represent how much over, or just be full red
                    summaryRemainingProgressEl.style.width = `100%`; // Show full bar for deficit
                    summaryRemainingProgressEl.style.backgroundColor = 'var(--error-color, #E74C3C)';
                }
            }

        } catch (error) {
            console.error("Failed to load dashboard summary for month:", error);
            if (summaryBudgetedEl) summaryBudgetedEl.textContent = '₹?';
            if (summaryIncomeEl) summaryIncomeEl.textContent = '₹?';
            if (summarySpentEl) summarySpentEl.textContent = '₹?';
            if (summaryRemainingEl) summaryRemainingEl.textContent = '₹?';
        }
    }

    async function loadSpendingByCategoryForMonth(year, month) {
        let spendingCanvas, targetContainer, chartContainer;
        const dashboardPageActive = document.getElementById('dashboard-page')?.classList.contains('active');

        if (dashboardPageActive) { // Only load for dashboard for now
            targetContainer = document.getElementById('dashboard-expenses-pie-chart-container');
            chartContainer = targetContainer?.querySelector('div[style]'); // Get the div with style attribute (chart container)

            if (targetContainer && chartContainer) {
                if (!document.getElementById('dashboardSpendingByCategoryChart')) {
                    chartContainer.innerHTML = '<canvas id="dashboardSpendingByCategoryChart"></canvas>';
                }
                spendingCanvas = document.getElementById('dashboardSpendingByCategoryChart')?.getContext('2d');
            }
        } else {
            return; // Not on dashboard, or insights page logic will handle its own
        }

        if(!targetContainer || !chartContainer || !spendingCanvas) return;

        chartContainer.innerHTML = '<p>Loading data...</p>';

        const firstDayOfMonth = new Date(year, month - 1, 1).toISOString().split('T')[0];
        const lastDayOfMonth = new Date(year, month, 0).toISOString().split('T')[0];

        try {
            // Get both spending and income data
            const spendingUrl = `/api/analytics/spending-by-category?startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}`;
            const spendingData = await apiCall(spendingUrl);

            // Get income data - use entries API to ensure we get all income data
            let incomeData = {};

            try {
                // Get all entries for the month
                const entriesUrl = `/api/entries?startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}`;
                const entries = await apiCall(entriesUrl);

                // Filter income entries and group by category
                const incomeEntries = entries.filter(entry => entry.type === 'income');

                // Group by category and sum amounts
                incomeEntries.forEach(entry => {
                    const category = entry.category || 'Uncategorized';
                    if (!incomeData[category]) {
                        incomeData[category] = 0;
                    }
                    incomeData[category] += parseFloat(entry.amount);
                });

                console.log('Income data from entries:', incomeData);
            } catch (incomeError) {
                console.warn('Could not load income data, proceeding with expenses only:', incomeError);
                // Continue with just spending data if income data fails
            }

            // Store the original data for filtering
            dashboardChartData = {
                expense: { ...spendingData },
                income: { ...incomeData }
            };

            console.log('Dashboard chart data:', dashboardChartData);

            // Select data based on current mode
            let filteredData = {};

            if (dashboardChartMode === 'expense') {
                // Only include expense data
                filteredData = { ...spendingData };
            } else if (dashboardChartMode === 'income') {
                // Only include income data
                for (const category in incomeData) {
                    filteredData[`Income: ${category}`] = incomeData[category];
                }
            }

            // Recreate canvas before rendering
            chartContainer.innerHTML = '<canvas id="dashboardSpendingByCategoryChart"></canvas>';
            spendingCanvas = document.getElementById('dashboardSpendingByCategoryChart')?.getContext('2d');

            if (spendingCanvas) {
                renderSpendingByCategory(filteredData, spendingCanvas, chartContainer, dashboardChartMode);
            }

            // Set up chart toggle buttons if they don't have event listeners yet
            setupDashboardChartToggleButtons();

        } catch (error) {
            console.error('Failed to load category data:', error);
            if(chartContainer) chartContainer.innerHTML = '<p class="error-message">Could not load data.</p>';
        }
    }

    function setupDashboardChartToggleButtons() {
        const incomeBtn = document.getElementById('dashboard-chart-toggle-income');
        const expenseBtn = document.getElementById('dashboard-chart-toggle-expense');

        if (!incomeBtn || !expenseBtn) return;

        // Remove existing event listeners by cloning and replacing
        const newIncomeBtn = incomeBtn.cloneNode(true);
        const newExpenseBtn = expenseBtn.cloneNode(true);

        incomeBtn.parentNode.replaceChild(newIncomeBtn, incomeBtn);
        expenseBtn.parentNode.replaceChild(newExpenseBtn, expenseBtn);

        // Add event listeners to the new buttons
        newIncomeBtn.addEventListener('click', () => updateDashboardChartMode('income'));
        newExpenseBtn.addEventListener('click', () => updateDashboardChartMode('expense'));

        // Update active state based on current mode
        updateDashboardChartButtonStates();
    }

    function updateDashboardChartMode(mode) {
        if (dashboardChartMode === mode) return; // No change

        dashboardChartMode = mode;
        updateDashboardChartButtonStates();

        // Update the subtitle
        const subtitle = document.getElementById('dashboard-chart-subtitle');
        if (subtitle) {
            subtitle.textContent = mode === 'income' ? 'Income by Category' : 'Expenses by Category';
        }

        // Regenerate chart with filtered data
        let filteredData = {};

        if (mode === 'income') {
            // Only include income data
            for (const category in dashboardChartData.income) {
                filteredData[`Income: ${category}`] = dashboardChartData.income[category];
            }
        } else if (mode === 'expense') {
            // Only include expense data
            filteredData = { ...dashboardChartData.expense };
        }

        // Get the chart container and canvas
        const targetContainer = document.getElementById('dashboard-expenses-pie-chart-container');
        const chartContainer = targetContainer?.querySelector('div[style]');

        if (!targetContainer || !chartContainer) return;

        // Recreate canvas
        chartContainer.innerHTML = '<canvas id="dashboardSpendingByCategoryChart"></canvas>';
        const spendingCanvas = document.getElementById('dashboardSpendingByCategoryChart')?.getContext('2d');

        if (spendingCanvas) {
            renderSpendingByCategory(filteredData, spendingCanvas, chartContainer, mode);

            // Force legend text color after chart is rendered
            setTimeout(() => {
                const legendItems = document.querySelectorAll('#dashboard-expenses-pie-chart-container .chartjs-legend-item-text');
                const textColor = document.body.classList.contains('dark-theme') ? '#FFFFFF' : '#000000';
                legendItems.forEach(item => {
                    item.style.color = textColor;
                });
            }, 100);
        }
    }

    function updateDashboardChartButtonStates() {
        const incomeBtn = document.getElementById('dashboard-chart-toggle-income');
        const expenseBtn = document.getElementById('dashboard-chart-toggle-expense');

        if (!incomeBtn || !expenseBtn) return;

        // Remove active class from all buttons
        incomeBtn.classList.remove('active');
        expenseBtn.classList.remove('active');

        // Add active class to the current mode button
        if (dashboardChartMode === 'income') {
            incomeBtn.classList.add('active');
        } else if (dashboardChartMode === 'expense') {
            expenseBtn.classList.add('active');
        }
    }


    function showView(viewToShow) {
        clearMessage(authMessage);
        if(entryFormMessage) clearMessage(entryFormMessage);

        if (loginView) loginView.style.display = 'none';
        if (registerView) registerView.style.display = 'none';
        if (authContainer) authContainer.style.display = 'none';
        if (appContainer) appContainer.style.display = 'none';

        if (viewToShow === 'login') {
            if (loginView) loginView.style.display = 'block';
            if (authContainer) authContainer.style.display = 'block';
        } else if (viewToShow === 'register') {
            if (registerView) registerView.style.display = 'block';
            if (authContainer) authContainer.style.display = 'block';
        } else if (viewToShow === 'app') {
            if (appContainer) appContainer.style.display = 'flex';
            if (currentUser) {
                initializeMonthNavigation(); // Sets up month and calls loadDataForMonth
                loadGoals();
                // loadUserBudget(); // Deprecated in favor of monthly
                loadUserProfileForSettings();
                // loadAnalyticsData(); // Now handled by loadDataForMonth and insights page logic
            }
        }
    }

    // --- User Session Management ---
    function storeUserSession(userData) {
        localStorage.setItem('budgetPlannerUser', JSON.stringify(userData));
        currentUser = userData;
    }

    function clearUserSession() {
        localStorage.removeItem('budgetPlannerUser');
        localStorage.removeItem('authToken');
        currentUser = null;
    }

    function loadUserSession() {
        const storedUser = localStorage.getItem('budgetPlannerUser');
        const token = localStorage.getItem('authToken');
        if (storedUser && token) {
            currentUser = JSON.parse(storedUser);
            return true;
        }
        clearUserSession();
        return false;
    }

    // --- API Communication ---
    async function apiCall(endpoint, method = 'GET', body = null) {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        const token = localStorage.getItem('authToken');
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(endpoint, options);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    console.warn('Authorization error or token expired, logging out.');
                    clearUserSession();
                    showView('login');
                    displayMessage(data.message || 'Session expired or unauthorized. Please login again.', 'error', authMessage);
                }
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error('API Call Error:', error.message);
            const currentAuthMessageArea = document.getElementById('auth-message');
            if (error.message !== 'Session expired or unauthorized. Please login again.') {
                 displayMessage(error.message || 'An API error occurred.', 'error', currentAuthMessageArea || authMessage);
            }
            throw error;
        }
    }

    // --- Budget Entry Management ---
    if(addEntryForm) addEntryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if(entryFormMessage) clearMessage(entryFormMessage);
        if (!currentUser) { if(entryFormMessage) displayMessage('You must be logged in.', 'error', entryFormMessage); return; }

        const entryId = entryIdHiddenInput.value;
        const type = document.getElementById('entry-type').value;
        const category = document.getElementById('entry-category').value;
        const amount = document.getElementById('entry-amount').value;
        const date = document.getElementById('entry-date').value;
        const descriptionElement = document.getElementById('entry-description');
        const description = descriptionElement ? descriptionElement.value : '';

        // --- Future Date Check ---
        const selectedDate = new Date(date + 'T00:00:00'); // Ensure local timezone interpretation
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

        if (selectedDate > today) {
            displayMessage('Cannot add entries for future dates.', 'error', entryFormMessage);
            return; // Stop submission
        }
        // --- End Future Date Check ---

        const entryData = { type, category, amount, date, description };

        try {
            let result;
            if (entryId) { // Update existing entry
                result = await apiCall(`/api/entries/${entryId}`, 'PUT', entryData);
                if(entryFormMessage) displayMessage(result.message || 'Entry updated successfully!', 'success', entryFormMessage);
            } else { // Add new entry
                result = await apiCall('/api/entries', 'POST', entryData);
                if(entryFormMessage) displayMessage(result.message || 'Entry added successfully!', 'success', entryFormMessage);
            }
            resetEntryForm();

            // Refresh data for the current view
            loadDataForMonth(currentDisplayYear, currentDisplayMonth);

            // If entries page exists, refresh it as well for real-time updates
            if (document.getElementById('entries-page')) {
                // If we're on the entries page, refresh it immediately
                if (document.getElementById('entries-page').classList.contains('active')) {
                    loadAllEntries();
                } else {
                    // Otherwise, just update the data for when user navigates to entries page
                    apiCall('/api/entries').then(entries => {
                        allUserEntries = entries;
                    }).catch(err => console.error('Failed to refresh entries data:', err));
                }
            }
        } catch (error) {
            if(entryFormMessage) displayMessage(error.message || `Failed to ${entryId ? 'update' : 'add'} entry.`, 'error', entryFormMessage);
        }
    });

    function populateEntryForm(entryId) {
        const entryToEdit = allUserEntries.find(entry => entry.id === entryId);
        if (!entryToEdit) {
            if(entryFormMessage) displayMessage('Could not find entry to edit.', 'error', entryFormMessage);
            return;
        }
        if(entryFormTitle) entryFormTitle.textContent = 'Edit Entry';
        if(entryIdHiddenInput) entryIdHiddenInput.value = entryToEdit.id;
        const entryTypeEl = document.getElementById('entry-type');
        if(entryTypeEl) entryTypeEl.value = entryToEdit.type;
        const entryCategoryEl = document.getElementById('entry-category');
        if(entryCategoryEl) entryCategoryEl.value = entryToEdit.category;
        const entryAmountEl = document.getElementById('entry-amount');
        if(entryAmountEl) entryAmountEl.value = entryToEdit.amount;
        const entryDateEl = document.getElementById('entry-date');
        if(entryDateEl) entryDateEl.value = entryToEdit.date; // Flatpickr handles formatting
        const descriptionEl = document.getElementById('entry-description');
        if(descriptionEl) descriptionEl.value = entryToEdit.description || '';
        if(entryFormSubmitButton) entryFormSubmitButton.textContent = 'Update Entry';
        if(entryFormCancelButton) entryFormCancelButton.style.display = 'inline-block';
        if(addEntryForm) addEntryForm.scrollIntoView({ behavior: 'smooth' });
    }

    function resetEntryForm() {
        if(entryFormTitle) entryFormTitle.textContent = 'Add Entry';
        if(addEntryForm) addEntryForm.reset();
        if(entryIdHiddenInput) entryIdHiddenInput.value = '';
        if(entryFormSubmitButton) entryFormSubmitButton.textContent = 'Add Entry';
        if(entryFormCancelButton) entryFormCancelButton.style.display = 'none';
        if(entryFormMessage) clearMessage(entryFormMessage);
    }

    if(entryFormCancelButton) entryFormCancelButton.addEventListener('click', () => { resetEntryForm(); });

    async function handleEditEntry(event) {
        populateEntryForm(event.target.dataset.id);

        // If we're on the entries page, scroll to the form
        if (document.getElementById('entries-page')?.classList.contains('active')) {
            // Find the add entry form on the dashboard and navigate to it
            navigateToPage('dashboard-page');
            setTimeout(() => {
                if (addEntryForm) {
                    addEntryForm.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        }
    }

    async function handleDeleteEntry(event) {
        const entryId = event.target.dataset.id;
        if (!entryId || !confirm('Are you sure you want to delete this entry?')) return;
        if (!currentUser) {
            if(entryFormMessage) displayMessage('Authentication error. Please log in again.', 'error', entryFormMessage);
            return;
        }
        try {
            await apiCall(`/api/entries/${entryId}`, 'DELETE');
            if(entryFormMessage) displayMessage('Entry deleted successfully.', 'success', entryFormMessage);

            // Refresh data for the current view
            loadDataForMonth(currentDisplayYear, currentDisplayMonth);

            // If we're on the entries page, also refresh that view
            if (document.getElementById('entries-page')?.classList.contains('active')) {
                loadAllEntries();
            }
        } catch (error) {
            if(entryFormMessage) displayMessage(error.message || 'Failed to delete entry.', 'error', entryFormMessage);
        }
    }


    // --- Financial Goal Management (largely unchanged) ---
    async function loadGoals() {
        if (!currentUser) return;
        if(goalsListDiv) goalsListDiv.innerHTML = '<p>Loading goals...</p>';
        try {
            allUserGoals = await apiCall(`/api/goals`, 'GET');
            if(goalsListDiv) {
                // Filter goals based on the selected month if we're on the dashboard
                if (document.getElementById('dashboard-page')?.classList.contains('active') &&
                    currentDisplayYear && currentDisplayMonth) {
                    const filteredGoals = filterGoalsByMonth(allUserGoals, currentDisplayYear, currentDisplayMonth);
                    renderGoals(filteredGoals);
                } else {
                    // Show all goals on the goals page
                    renderGoals(allUserGoals);
                }
            }
        } catch (error) {
            if(goalsListDiv) goalsListDiv.innerHTML = '<p class="error-message">Could not load goals.</p>';
        }
    }

    // Filter goals based on the selected month
    function filterGoalsByMonth(goals, year, month) {
        if (!goals || goals.length === 0) return [];

        const firstDayOfMonth = new Date(year, month - 1, 1);
        const lastDayOfMonth = new Date(year, month, 0);

        return goals.filter(goal => {
            // If the goal has no target date, show it in all months
            if (!goal.targetDate) return true;

            const targetDate = new Date(goal.targetDate);

            // If the target date is in the selected month, show it
            if (targetDate.getFullYear() === year && targetDate.getMonth() === month - 1) {
                return true;
            }

            // If the target date is in the future and within 3 months of the selected month, show it
            if (targetDate > firstDayOfMonth) {
                const monthsDifference =
                    (targetDate.getFullYear() - firstDayOfMonth.getFullYear()) * 12 +
                    targetDate.getMonth() - firstDayOfMonth.getMonth();

                if (monthsDifference <= 3) {
                    return true;
                }
            }

            // If the target date is in the past and the goal is not achieved, show it
            if (targetDate < lastDayOfMonth && goal.status !== 'achieved') {
                return true;
            }

            return false;
        });
    }

    function renderGoals(goalsToRender) {
        if(!goalsListDiv) return;
        if (!goalsToRender || goalsToRender.length === 0) {
            goalsListDiv.innerHTML = '<p>No goals found for this period. Add some!</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'goals-ul';

        // Sort goals: first by status (in-progress first), then by target date (closest first)
        goalsToRender.sort((a, b) => {
            // First sort by status - in-progress first
            if ((a.status || 'in-progress') === 'in-progress' && (b.status || 'in-progress') !== 'in-progress') {
                return -1;
            }
            if ((a.status || 'in-progress') !== 'in-progress' && (b.status || 'in-progress') === 'in-progress') {
                return 1;
            }

            // Then sort by target date (if both have target dates)
            if (a.targetDate && b.targetDate) {
                return new Date(a.targetDate) - new Date(b.targetDate);
            }

            // If only one has a target date, put it first
            if (a.targetDate && !b.targetDate) return -1;
            if (!a.targetDate && b.targetDate) return 1;

            // Finally sort by creation date
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

        goalsToRender.forEach(goal => {
            const li = document.createElement('li');
            li.className = `goal-item status-${goal.status || 'in-progress'}`;

            const targetAmountFormatted = parseFloat(goal.targetAmount).toFixed(2);
            const currentAmountFormatted = parseFloat(goal.currentAmount).toFixed(2);
            const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;

            // Format target date with time remaining
            let targetDateDisplay = 'No deadline';
            if (goal.targetDate) {
                const targetDate = new Date(goal.targetDate);
                const today = new Date();
                const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

                if (daysRemaining > 0) {
                    targetDateDisplay = `${targetDate.toLocaleDateString()} (${daysRemaining} days left)`;
                } else if (daysRemaining === 0) {
                    targetDateDisplay = `${targetDate.toLocaleDateString()} (Today!)`;
                } else {
                    targetDateDisplay = `${targetDate.toLocaleDateString()} (${Math.abs(daysRemaining)} days overdue)`;
                }
            }

            li.innerHTML = `
                <div class="goal-info">
                    <strong class="goal-name">${goal.name}</strong>
                    <p class="goal-amounts">₹${currentAmountFormatted} of ₹${targetAmountFormatted}</p>
                    <div class="progress-bar-container goal-progress-bar-container"><div class="progress-bar goal-progress-bar" style="width: ${progress.toFixed(1)}%;"></div></div>
                    <p class="goal-progress-text">${progress.toFixed(1)}% Complete</p>
                    <p class="goal-target-date">Target: ${targetDateDisplay}</p>
                    ${goal.description ? `<p class="goal-description">${goal.description}</p>` : ''}
                </div>
                <div class="goal-status-display">Status: ${goal.status || 'In Progress'}</div>
                <div class="goal-actions">
                    <button class="edit-goal-btn" data-id="${goal.id}">Edit</button>
                    <button class="delete-goal-btn" data-id="${goal.id}">Delete</button>
                </div>`;
            ul.appendChild(li);
        });

        ul.querySelectorAll('.edit-goal-btn').forEach(button => button.addEventListener('click', handleEditGoal));
        ul.querySelectorAll('.delete-goal-btn').forEach(button => button.addEventListener('click', handleDeleteGoal));
        goalsListDiv.innerHTML = '';
        goalsListDiv.appendChild(ul);
    }

    function populateGoalForm(goalId) {
        const goalToEdit = allUserGoals.find(goal => goal.id === goalId);
        if (!goalToEdit) { if(goalFormMessage) displayMessage('Could not find goal to edit.', 'error', goalFormMessage); return; }
        if(goalFormTitle) goalFormTitle.textContent = 'Edit Goal';
        if(goalIdHiddenInput) goalIdHiddenInput.value = goalToEdit.id;
        const goalNameEl = document.getElementById('goal-name');
        if(goalNameEl) goalNameEl.value = goalToEdit.name;
        const goalTargetEl = document.getElementById('goal-target-amount');
        if(goalTargetEl) goalTargetEl.value = goalToEdit.targetAmount;
        const goalCurrentEl = document.getElementById('goal-current-amount');
        if(goalCurrentEl) goalCurrentEl.value = goalToEdit.currentAmount;
        const goalDateEl = document.getElementById('goal-target-date');
        if(goalDateEl) goalDateEl.value = goalToEdit.targetDate ? new Date(goalToEdit.targetDate).toISOString().split('T')[0] : '';
        const goalDescEl = document.getElementById('goal-description');
        if(goalDescEl) goalDescEl.value = goalToEdit.description || '';
        if(goalFormSubmitButton) goalFormSubmitButton.textContent = 'Update Goal';
        if(goalFormCancelButton) goalFormCancelButton.style.display = 'inline-block';
        if(addGoalForm) addGoalForm.scrollIntoView({ behavior: 'smooth' });
    }

    function resetGoalForm() {
        if(goalFormTitle) goalFormTitle.textContent = 'Add New Goal';
        if(addGoalForm) addGoalForm.reset();
        if(goalIdHiddenInput) goalIdHiddenInput.value = '';
        if(goalFormSubmitButton) goalFormSubmitButton.textContent = 'Add Goal';
        if(goalFormCancelButton) goalFormCancelButton.style.display = 'none';
        if(goalFormMessage) clearMessage(goalFormMessage);
    }

    async function handleEditGoal(event) {
        populateGoalForm(event.target.dataset.id);
    }

    async function handleDeleteGoal(event) {
        const goalId = event.target.dataset.id;
        if (!goalId || !confirm('Are you sure you want to delete this goal?')) return;
        if (!currentUser) {
            if(goalFormMessage) displayMessage('Authentication error. Please log in again.', 'error', goalFormMessage);
            return;
        }
        try {
            await apiCall(`/api/goals/${goalId}`, 'DELETE');
            if(goalFormMessage) displayMessage('Goal deleted successfully.', 'success', goalFormMessage);
            loadGoals();
        } catch (error) {
            if(goalFormMessage) displayMessage(error.message || 'Failed to delete goal.', 'error', goalFormMessage);
        }
    }

    if(addGoalForm) addGoalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if(goalFormMessage) clearMessage(goalFormMessage);
        if (!currentUser) {
            if(goalFormMessage) displayMessage('You must be logged in to add/update goals.', 'error', goalFormMessage);
            return;
        }
        const goalId = goalIdHiddenInput.value;
        const name = document.getElementById('goal-name').value;
        const targetAmount = document.getElementById('goal-target-amount').value;
        const currentAmount = document.getElementById('goal-current-amount').value;
        const targetDate = document.getElementById('goal-target-date').value;
        const description = document.getElementById('goal-description').value;
        const goalData = { name, targetAmount, currentAmount, targetDate: targetDate || null, description };
        try {
            let result;
            if (goalId) {
                result = await apiCall(`/api/goals/${goalId}`, 'PUT', goalData);
                if(goalFormMessage) displayMessage(result.message || 'Goal updated successfully!', 'success', goalFormMessage);
            } else {
                result = await apiCall('/api/goals', 'POST', goalData);
                if(goalFormMessage) displayMessage(result.message || 'Goal added successfully!', 'success', goalFormMessage);
            }
            resetGoalForm();
            loadGoals();
        } catch (error) {
            if(goalFormMessage) displayMessage(error.message || `Failed to ${goalId ? 'update' : 'add'} goal.`, 'error', goalFormMessage);
        }
    });

    // --- Analytics and Charting ---
    async function loadAnalyticsData() {
        if (!currentUser) return;
        if (document.getElementById('insights-page')?.classList.contains('active')) {
            await loadIncomeVsExpense();
            await loadSpendingByCategory();
        }
    }

    // Add event listener for analytics filters
    if (applyAnalyticsFiltersBtn) {
        applyAnalyticsFiltersBtn.addEventListener('click', async () => {
            await loadIncomeVsExpense();
            await loadSpendingByCategory();
        });
    }

    async function loadIncomeVsExpense() {
        if (!incomeVsExpenseContainer) return;

        try {
            // Get date range from inputs or use current month
            let startDate, endDate;
            if (analyticsStartDateInput && analyticsEndDateInput &&
                analyticsStartDateInput.value && analyticsEndDateInput.value) {
                startDate = analyticsStartDateInput.value;
                endDate = analyticsEndDateInput.value;
            } else {
                const today = new Date();
                const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
                startDate = firstDayOfMonth;
                endDate = lastDayOfMonth;
            }

            incomeVsExpenseContainer.innerHTML = '<p>Loading income vs expense data...</p>';

            const data = await apiCall(`/api/analytics/income-vs-expense?startDate=${startDate}&endDate=${endDate}`);

            if (!data) {
                incomeVsExpenseContainer.innerHTML = '<p>No income vs expense data available.</p>';
                return;
            }

            incomeVsExpenseContainer.innerHTML = '<canvas id="incomeVsExpenseChart"></canvas>';
            const canvasContext = document.getElementById('incomeVsExpenseChart')?.getContext('2d');
            if (!canvasContext) return;

            renderIncomeVsExpense(data, canvasContext);

        } catch (error) {
            console.error('Failed to load income vs expense data:', error);
            incomeVsExpenseContainer.innerHTML = '<p class="error-message">Could not load income vs expense data.</p>';
        }
    }

    async function loadSpendingByCategory() {
        if (!spendingByCategoryContainer) return;

        try {
            // Get date range from inputs or use current month
            let startDate, endDate;
            if (analyticsStartDateInput && analyticsEndDateInput &&
                analyticsStartDateInput.value && analyticsEndDateInput.value) {
                startDate = analyticsStartDateInput.value;
                endDate = analyticsEndDateInput.value;
            } else {
                const today = new Date();
                const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
                startDate = firstDayOfMonth;
                endDate = lastDayOfMonth;
            }

            spendingByCategoryContainer.innerHTML = '<p>Loading category data...</p>';

            // Get spending data
            const spendingUrl = `/api/analytics/spending-by-category?startDate=${startDate}&endDate=${endDate}`;
            const spendingData = await apiCall(spendingUrl);

            // Get income data - use entries API to ensure we get all income data
            let incomeData = {};

            try {
                // Get all entries for the date range
                const entriesUrl = `/api/entries?startDate=${startDate}&endDate=${endDate}`;
                const entries = await apiCall(entriesUrl);

                // Filter income entries and group by category
                const incomeEntries = entries.filter(entry => entry.type === 'income');

                // Group by category and sum amounts
                incomeEntries.forEach(entry => {
                    const category = entry.category || 'Uncategorized';
                    if (!incomeData[category]) {
                        incomeData[category] = 0;
                    }
                    incomeData[category] += parseFloat(entry.amount);
                });

                console.log('Insights income data from entries:', incomeData);
            } catch (incomeError) {
                console.warn('Could not load income data, proceeding with expenses only:', incomeError);
                // Continue with just spending data if income data fails
            }

            // Check if we have any data to display based on current mode
            if (insightsChartMode === 'expense' && (!spendingData || Object.keys(spendingData).length === 0)) {
                spendingByCategoryContainer.innerHTML = '<p>No expense data available for the selected period.</p>';
                return;
            } else if (insightsChartMode === 'income' && (!incomeData || Object.keys(incomeData).length === 0)) {
                spendingByCategoryContainer.innerHTML = '<p>No income data available for the selected period.</p>';
                return;
            }

            // Store the original data for filtering
            insightsChartData = {
                expense: { ...spendingData },
                income: { ...incomeData }
            };

            console.log('Insights chart data:', insightsChartData);

            // Select data based on current mode
            let filteredData = {};

            if (insightsChartMode === 'expense') {
                // Only include expense data
                filteredData = { ...spendingData };
            } else if (insightsChartMode === 'income') {
                // Only include income data
                for (const category in incomeData) {
                    filteredData[`Income: ${category}`] = incomeData[category];
                }
            }

            spendingByCategoryContainer.innerHTML = '<canvas id="spendingByCategoryChart"></canvas>';
            const canvasContext = document.getElementById('spendingByCategoryChart')?.getContext('2d');
            if (!canvasContext) return;

            renderSpendingByCategory(filteredData, canvasContext, spendingByCategoryContainer, insightsChartMode);

            // Set up chart toggle buttons
            setupInsightsChartToggleButtons();

        } catch (error) {
            console.error('Failed to load category data:', error);
            spendingByCategoryContainer.innerHTML = '<p class="error-message">Could not load category data.</p>';
        }
    }

    function setupInsightsChartToggleButtons() {
        const incomeBtn = document.getElementById('insights-chart-toggle-income');
        const expenseBtn = document.getElementById('insights-chart-toggle-expense');

        if (!incomeBtn || !expenseBtn) return;

        // Remove existing event listeners by cloning and replacing
        const newIncomeBtn = incomeBtn.cloneNode(true);
        const newExpenseBtn = expenseBtn.cloneNode(true);

        incomeBtn.parentNode.replaceChild(newIncomeBtn, incomeBtn);
        expenseBtn.parentNode.replaceChild(newExpenseBtn, expenseBtn);

        // Add event listeners to the new buttons
        newIncomeBtn.addEventListener('click', () => updateInsightsChartMode('income'));
        newExpenseBtn.addEventListener('click', () => updateInsightsChartMode('expense'));

        // Update active state based on current mode
        updateInsightsChartButtonStates();
    }

    function updateInsightsChartMode(mode) {
        if (insightsChartMode === mode) return; // No change

        insightsChartMode = mode;
        updateInsightsChartButtonStates();

        // Update the subtitle
        const subtitle = document.getElementById('insights-chart-subtitle');
        if (subtitle) {
            subtitle.textContent = mode === 'income' ? 'Income by Category' : 'Expenses by Category';
        }

        // Regenerate chart with filtered data
        let filteredData = {};

        if (mode === 'income') {
            // Only include income data
            for (const category in insightsChartData.income) {
                filteredData[`Income: ${category}`] = insightsChartData.income[category];
            }
        } else if (mode === 'expense') {
            // Only include expense data
            filteredData = { ...insightsChartData.expense };
        }

        // Recreate canvas
        spendingByCategoryContainer.innerHTML = '<canvas id="spendingByCategoryChart"></canvas>';
        const canvasContext = document.getElementById('spendingByCategoryChart')?.getContext('2d');

        if (canvasContext) {
            renderSpendingByCategory(filteredData, canvasContext, spendingByCategoryContainer, mode);

            // Force legend text color after chart is rendered
            setTimeout(() => {
                const legendItems = document.querySelectorAll('#spending-by-category-container .chartjs-legend-item-text');
                const textColor = document.body.classList.contains('dark-theme') ? '#FFFFFF' : '#000000';
                legendItems.forEach(item => {
                    item.style.color = textColor;
                });
            }, 100);
        }
    }

    function updateInsightsChartButtonStates() {
        const incomeBtn = document.getElementById('insights-chart-toggle-income');
        const expenseBtn = document.getElementById('insights-chart-toggle-expense');

        if (!incomeBtn || !expenseBtn) return;

        // Remove active class from all buttons
        incomeBtn.classList.remove('active');
        expenseBtn.classList.remove('active');

        // Add active class to the current mode button
        if (insightsChartMode === 'income') {
            incomeBtn.classList.add('active');
        } else if (insightsChartMode === 'expense') {
            expenseBtn.classList.add('active');
        }
    }

    function renderSpendingByCategory(data, canvasContext, containerElement, chartMode) {
        if (!containerElement || !canvasContext) return;

        // Destroy existing chart if it exists
        if (canvasContext.chart) {
            canvasContext.chart.destroy();
        }

        // Check if we have data to display
        if (Object.keys(data).length === 0) {
            containerElement.innerHTML = `<p>No ${chartMode === 'income' ? 'income' : 'expense'} data available for the selected period.</p>`;
            return;
        }

        // Debug log to check data
        console.log("Chart data:", {
            data: data,
            mode: chartMode
        });

        // Prepare chart data
        const labels = Object.keys(data);
        const values = Object.values(data);

        // Define a fixed set of vibrant colors that match the image
        const chartColors = [
            '#FF4D8F', // Bright Pink
            '#40E0D0', // Turquoise
            '#FF8C00', // Dark Orange
            '#6A5ACD', // Slate Blue
            '#32CD32', // Lime Green
            '#FF69B4', // Hot Pink
            '#1E90FF', // Dodger Blue
            '#FFD700', // Gold
            '#8A2BE2', // Blue Violet
            '#00CED1', // Dark Turquoise
            '#FF6347', // Tomato
            '#7B68EE'  // Medium Slate Blue
        ];

        // Assign colors to categories
        const backgroundColors = labels.map((label, index) => {
            // Use modulo to cycle through colors if there are more categories than colors
            return chartColors[index % chartColors.length];
        });

        // If canvas was removed, recreate it
        if (!document.getElementById(canvasContext.canvas.id)) {
            const chartContainer = containerElement.querySelector('div') || containerElement;
            chartContainer.innerHTML = `<canvas id="${canvasContext.canvas.id}"></canvas>`;
            canvasContext = document.getElementById(canvasContext.canvas.id)?.getContext('2d');
            if (!canvasContext) return;
        }

        // Format labels based on chart mode
        const formattedLabels = labels.map(label => {
            if (chartMode === 'income') {
                return label.startsWith('Income:') ? label.replace('Income:', '').trim() : label;
            } else {
                return label;
            }
        });

        // Add consistent icons based on chart mode
        const emojiLabels = formattedLabels.map(label => {
            if (chartMode === 'income') {
                // Use 🪙 (coin) for all income categories
                return '🪙 ' + label;
            } else {
                // Use category-specific icons for expenses
                const lowerLabel = label.toLowerCase();
                if (lowerLabel.includes('shopping') || lowerLabel.includes('cloth')) {
                    return '🛍️ ' + label; // Shopping bag for shopping
                } else if (lowerLabel.includes('dinner') || lowerLabel.includes('food') || lowerLabel.includes('grocery')) {
                    return '🍽️ ' + label; // Plate with utensils for food/dinner
                } else if (lowerLabel.includes('transport') || lowerLabel.includes('travel')) {
                    return '🚗 ' + label; // Car for transport
                } else if (lowerLabel.includes('bill') || lowerLabel.includes('utility')) {
                    return '📄 ' + label; // Document for bills
                } else if (lowerLabel.includes('entertainment') || lowerLabel.includes('movie')) {
                    return '🎬 ' + label; // Movie clapper for entertainment
                } else if (lowerLabel.includes('health') || lowerLabel.includes('medical')) {
                    return '💊 ' + label; // Pill for health
                } else if (lowerLabel.includes('education') || lowerLabel.includes('school')) {
                    return '📚 ' + label; // Books for education
                } else if (lowerLabel.includes('home') || lowerLabel.includes('rent')) {
                    return '🏠 ' + label; // House for home expenses
                } else {
                    return '💸 ' + label; // Money with wings for other expenses
                }
            }
        });

        // Create the chart
        const chartInstance = new Chart(canvasContext, {
            type: 'doughnut',
            data: {
                labels: emojiLabels,
                datasets: [{
                    label: chartMode === 'income' ? 'Income by Category' : 'Expenses by Category',
                    data: values,
                    backgroundColor: backgroundColors,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // Hide the default legend, we'll create our own
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed);
                                }
                                return label;
                            }
                        },
                        titleFont: {
                            family: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                            size: 13,
                            weight: '400'
                        },
                        bodyFont: {
                            family: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                            size: 13,
                            weight: '400'
                        },
                        titleColor: 'var(--text-color)',
                        bodyColor: 'var(--text-color)',
                        backgroundColor: 'var(--card-bg)'
                    },
                    title: {
                        display: false  // We're using our own title in the HTML now
                    }
                }
            }
        });

        // Store the chart instance
        canvasContext.chart = chartInstance;

        // Create custom legend
        createCustomLegend(chartInstance, containerElement, emojiLabels, backgroundColors, chartMode);

        // Fix chart legend text color
        setTimeout(fixChartLegendTextColor, 100);
    }

    function renderIncomeVsExpense(data, canvasContext) {
        if (incomeExpenseChartInstance) incomeExpenseChartInstance.destroy();
        incomeExpenseChartInstance = new Chart(canvasContext, {
            type: 'bar',
            data: {
                labels: ['Income', 'Expense', 'Net Balance'],
                datasets: [{
                    label: 'Amount (₹)',
                    data: [data.totalIncome, data.totalExpense, data.netBalance],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        data.netBalance >= 0 ? 'rgba(153, 205, 86, 0.6)' : 'rgba(255, 159, 64, 0.6)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                        data.netBalance >= 0 ? 'rgba(153, 205, 86, 1)' : 'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: function(value) { return '₹' + value; } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) { label += ': '; }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    function renderSpendingOverviewChart(data, canvasContext, containerElement) {
        if (!containerElement || !canvasContext) return;
        if (spendingOverviewChartInstance) { spendingOverviewChartInstance.destroy(); spendingOverviewChartInstance = null; }
        if (!data || !data.labels || data.labels.length === 0) {
            containerElement.innerHTML = '<p>No spending overview data available.</p>';
            return;
        }
        if (!document.getElementById(canvasContext.canvas.id)) {
             containerElement.innerHTML = `<canvas id="${canvasContext.canvas.id}"></canvas>`;
             canvasContext = document.getElementById(canvasContext.canvas.id)?.getContext('2d');
             if(!canvasContext) return;
        }
        spendingOverviewChartInstance = new Chart(canvasContext, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Total Spending',
                    data: data.data,
                    borderColor: 'var(--primary-color)',
                    backgroundColor: 'var(--primary-color-translucent)',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: function(value) { return '₹' + value; } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) { return `Spending: ₹${context.parsed.y.toFixed(2)}`; }
                        }
                    }
                }
            }
        });
    }

    // --- Settings Page Management ---
    async function loadUserProfileForSettings() {
        if (!currentUser) {
            if(editProfileFormMessage) displayMessage('Please login to view your profile.', 'error', editProfileFormMessage);
            return;
        }
        try {
            if(profileNameDisplay) profileNameDisplay.value = currentUser.name || '';
            if(profileJoinedDateDisplay && currentUser.createdAt) {
                profileJoinedDateDisplay.value = new Date(currentUser.createdAt).toISOString().split('T')[0];
            } else if(profileJoinedDateDisplay) {
                profileJoinedDateDisplay.value = 'N/A';
            }
            if(settingsPfpPreviewLarge) settingsPfpPreviewLarge.src = currentUser.pfpUrl || defaultPfpSettingsPreview;
            if(editProfileFormMessage) clearMessage(editProfileFormMessage);
            if(changePasswordFormMessageNew) clearMessage(changePasswordFormMessageNew);
            if(setPfpFormMessageNew) clearMessage(setPfpFormMessageNew);
        } catch (error) {
            if(editProfileFormMessage) displayMessage('Could not load profile data.', 'error', editProfileFormMessage);
            console.error("Error loading profile for settings:", error);
        }
    }

    if(editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if(editProfileFormMessage) clearMessage(editProfileFormMessage);
            if (!currentUser) { if(editProfileFormMessage) displayMessage('You must be logged in.', 'error', editProfileFormMessage); return; }
            const name = profileNameDisplay.value;
            const profileData = { name };
            try {
                const result = await apiCall('/api/users/profile', 'PUT', profileData);
                if(editProfileFormMessage) displayMessage(result.message || 'Profile updated successfully!', 'success', editProfileFormMessage);
                if (result.user) {
                    currentUser.name = result.user.name;
                    storeUserSession(currentUser);
                    if(dropdownUsernameDisplay) dropdownUsernameDisplay.textContent = currentUser.username;
                }
            } catch (error) {
                if(editProfileFormMessage) displayMessage(error.message || 'Failed to update profile.', 'error', editProfileFormMessage);
            }
        });
    }

    if(changePasswordLink && changePasswordFormNew) {
        changePasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            changePasswordFormNew.style.display = changePasswordFormNew.style.display === 'none' ? 'block' : 'none';
            if(changePasswordFormNew.style.display === 'block') {
                if(editProfileFormMessage) clearMessage(editProfileFormMessage);
                changePasswordFormNew.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if(cancelChangePasswordButton && changePasswordFormNew) {
        cancelChangePasswordButton.addEventListener('click', () => {
            changePasswordFormNew.style.display = 'none';
            if(changePasswordFormMessageNew) clearMessage(changePasswordFormMessageNew);
            if(changePasswordFormNew) changePasswordFormNew.reset();
        });
    }

    if(changePasswordFormNew) {
        changePasswordFormNew.addEventListener('submit', async (e) => {
            e.preventDefault();
            if(changePasswordFormMessageNew) clearMessage(changePasswordFormMessageNew);
            if (!currentUser) { if(changePasswordFormMessageNew) displayMessage('You must be logged in.', 'error', changePasswordFormMessageNew); return; }
            const currentPassword = document.getElementById('current-password-new').value;
            const newPassword = document.getElementById('new-password-new').value;
            const confirmNewPassword = document.getElementById('confirm-new-password-new').value;
            if (newPassword !== confirmNewPassword) { if(changePasswordFormMessageNew) displayMessage('New passwords do not match.', 'error', changePasswordFormMessageNew); return; }
            if (newPassword.length < 6) { if(changePasswordFormMessageNew) displayMessage('New password must be at least 6 characters long.', 'error', changePasswordFormMessageNew); return; }
            const passwordData = { currentPassword, newPassword };
            try {
                const result = await apiCall('/api/users/change-password', 'PUT', passwordData);
                if(changePasswordFormMessageNew) displayMessage(result.message || 'Password changed successfully!', 'success', changePasswordFormMessageNew);
                changePasswordFormNew.reset();
                changePasswordFormNew.style.display = 'none';
            } catch (error) {
                if(changePasswordFormMessageNew) displayMessage(error.message || 'Failed to change password.', 'error', changePasswordFormMessageNew);
            }
        });
    }

    if(editPfpButton && pfpFileInput) {
        editPfpButton.addEventListener('click', () => { pfpFileInput.click(); });
        pfpFileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;
            if (!currentUser) { if(setPfpFormMessageNew) displayMessage('You must be logged in.', 'error', setPfpFormMessageNew); return; }
            const reader = new FileReader();
            reader.onload = (e) => { if(settingsPfpPreviewLarge) settingsPfpPreviewLarge.src = e.target.result; }
            reader.readAsDataURL(file);
            const formData = new FormData();
            formData.append('pfp', file);
            try {
                const response = await fetch('/api/users/pfp-upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
                    body: formData
                });
                const result = await response.json();
                if (!response.ok) { throw new Error(result.message || 'PFP upload failed'); }
                if(setPfpFormMessageNew) displayMessage(result.message || 'Profile picture updated!', 'success', setPfpFormMessageNew);
                currentUser.pfpUrl = result.pfpUrl;
                storeUserSession(currentUser);
                updateUserPfpDisplay(currentUser.pfpUrl);
            } catch (error) {
                if(setPfpFormMessageNew) displayMessage(error.message || 'Failed to upload profile picture.', 'error', setPfpFormMessageNew);
                if(settingsPfpPreviewLarge && currentUser) settingsPfpPreviewLarge.src = currentUser.pfpUrl || defaultPfpSettingsPreview;
            }
        });
    }

    // --- Authentication Form Event Listeners ---
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showView('register'); });
    }
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => { e.preventDefault(); showView('login'); });
    }
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearMessage(authMessage);
            const nameInput = document.getElementById('register-name');
            const usernameInput = document.getElementById('register-username');
            const emailInput = document.getElementById('register-email');
            const passwordInput = document.getElementById('register-password');
            const name = nameInput ? nameInput.value : '';
            const username = usernameInput ? usernameInput.value : '';
            const email = emailInput ? emailInput.value : '';
            const password = passwordInput ? passwordInput.value : '';
            try {
                const payload = { name, username, password };
                if (email) { payload.email = email; }
                const data = await apiCall('/api/auth/register', 'POST', payload);
                displayMessage(data.message || 'Registration successful! Please login.', 'success', authMessage);
                registerForm.reset();
                showView('login');
            } catch (error) { console.error('Registration failed:', error); }
        });
    }
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearMessage(authMessage);
            const usernameInput = document.getElementById('login-username');
            const passwordInput = document.getElementById('login-password');
            const username = usernameInput ? usernameInput.value : '';
            const password = passwordInput ? passwordInput.value : '';
            try {
                const data = await apiCall('/api/auth/login', 'POST', { username, password });
                if (data.user && data.token) {
                    storeUserSession(data.user);
                    localStorage.setItem('authToken', data.token);
                    loginForm.reset();
                    showView('app'); // This will now trigger initializeMonthNavigation
                    updateUserPfpDisplay(data.user.pfpUrl);
                } else {
                    displayMessage(data.message || 'Login failed: Invalid response from server.', 'error', authMessage);
                }
            } catch (error) { console.error('Login failed:', error); }
        });
    }

    // --- Month Navigation Listeners ---
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDisplayMonth--;
            if (currentDisplayMonth < 1) {
                currentDisplayMonth = 12;
                currentDisplayYear--;
            }
            updateDashboardForMonthDisplay(currentDisplayYear, currentDisplayMonth);
            loadDataForMonth(currentDisplayYear, currentDisplayMonth);
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            const today = new Date();
            const currentSystemMonth = today.getMonth() + 1;
            const currentSystemYear = today.getFullYear();

            let tempNextMonth = currentDisplayMonth + 1;
            let tempNextYear = currentDisplayYear;

            if (tempNextMonth > 12) {
                tempNextMonth = 1;
                tempNextYear++;
            }

            if (tempNextYear > currentSystemYear || (tempNextYear === currentSystemYear && tempNextMonth > currentSystemMonth)) {
                 displayMessage("Cannot view or set budget for future months.", "error", modalBudgetMessage); // Use modal message area or a general one
                return;
            }

            currentDisplayMonth++;
            if (currentDisplayMonth > 12) {
                currentDisplayMonth = 1;
                currentDisplayYear++;
            }
            updateDashboardForMonthDisplay(currentDisplayYear, currentDisplayMonth);
            loadDataForMonth(currentDisplayYear, currentDisplayMonth);
        });
    }

    // --- Entries Page Functions ---
    const entriesFilterTypeSelect = document.getElementById('entries-filter-type');
    const entriesFilterCategorySelect = document.getElementById('entries-filter-category');
    const entriesFilterDateFrom = document.getElementById('entries-filter-date-from');
    const entriesFilterDateTo = document.getElementById('entries-filter-date-to');
    const applyEntriesFiltersBtn = document.getElementById('apply-entries-filters-btn');
    const resetEntriesFiltersBtn = document.getElementById('reset-entries-filters-btn');
    const entriesListContainer = document.getElementById('entries-list-container');

    async function loadAllEntries() {
        if (!currentUser || !entriesListDiv) return;

        entriesListDiv.innerHTML = '<p>Loading entries...</p>';

        try {
            // Fetch all entries
            allUserEntries = await apiCall('/api/entries');

            // Populate category filter with unique categories
            populateEntriesCategoryFilter(allUserEntries);

            // Set default date range to current month
            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

            if (!entriesFilterDateFrom.value) entriesFilterDateFrom.value = firstDayOfMonth;
            if (!entriesFilterDateTo.value) entriesFilterDateTo.value = lastDayOfMonth;

            // Apply default filters
            filterAndRenderEntries();

        } catch (error) {
            console.error('Failed to load entries:', error);
            entriesListDiv.innerHTML = '<p class="error-message">Could not load entries.</p>';
        }
    }

    function populateEntriesCategoryFilter(entries) {
        if (!entriesFilterCategorySelect) return;

        // Clear existing options except "All Categories"
        while (entriesFilterCategorySelect.options.length > 1) {
            entriesFilterCategorySelect.remove(1);
        }

        // Get unique categories
        const categories = [...new Set(entries.map(entry => entry.category))];

        // Add options
        categories.sort().forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            entriesFilterCategorySelect.appendChild(option);
        });
    }

    function filterAndRenderEntries() {
        if (!allUserEntries || !entriesListDiv) return;

        const typeFilter = entriesFilterTypeSelect ? entriesFilterTypeSelect.value : 'all';
        const categoryFilter = entriesFilterCategorySelect ? entriesFilterCategorySelect.value : 'all';
        const dateFromFilter = entriesFilterDateFrom ? new Date(entriesFilterDateFrom.value) : null;
        const dateToFilter = entriesFilterDateTo ? new Date(entriesFilterDateTo.value) : null;

        // Add one day to dateToFilter to include the end date
        if (dateToFilter) {
            dateToFilter.setDate(dateToFilter.getDate() + 1);
        }

        // Filter entries
        const filteredEntries = allUserEntries.filter(entry => {
            const entryDate = new Date(entry.date);

            // Type filter
            if (typeFilter !== 'all' && entry.type !== typeFilter) return false;

            // Category filter
            if (categoryFilter !== 'all' && entry.category !== categoryFilter) return false;

            // Date range filter
            if (dateFromFilter && entryDate < dateFromFilter) return false;
            if (dateToFilter && entryDate > dateToFilter) return false;

            return true;
        });

        // Render filtered entries
        renderEntries(filteredEntries);
    }

    function renderEntries(entries) {
        if (!entriesListDiv) return;

        if (!entries || entries.length === 0) {
            entriesListDiv.innerHTML = '<p>No entries found matching your filters.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'entries-ul';

        // Sort entries by date (newest first)
        entries.sort((a, b) => new Date(b.date) - new Date(a.date));

        entries.forEach(entry => {
            const li = document.createElement('li');
            li.className = `entry-item ${entry.type}`;
            const dateFormatted = new Date(entry.date).toLocaleDateString();
            const amountFormatted = parseFloat(entry.amount).toFixed(2);

            li.innerHTML = `
                <div class="entry-details">
                    <span class="entry-date">${dateFormatted}</span>
                    <span class="entry-category">${entry.category}</span>
                    <span class="entry-description">${entry.description || ''}</span>
                </div>
                <div class="entry-amount ${entry.type === 'income' ? 'amount-income' : 'amount-expense'}">
                    ${entry.type === 'income' ? '+' : '-'}₹${amountFormatted}
                </div>
                <div class="entry-actions">
                    <button class="edit-entry-btn" data-id="${entry.id}">Edit</button>
                    <button class="delete-entry-btn" data-id="${entry.id}">Delete</button>
                </div>`;

            ul.appendChild(li);
        });

        // Add event listeners
        ul.querySelectorAll('.delete-entry-btn').forEach(button =>
            button.addEventListener('click', handleDeleteEntry));

        ul.querySelectorAll('.edit-entry-btn').forEach(button =>
            button.addEventListener('click', handleEditEntry));

        entriesListDiv.innerHTML = '';
        entriesListDiv.appendChild(ul);
    }

    // Set up event listeners for entries page
    if (applyEntriesFiltersBtn) {
        applyEntriesFiltersBtn.addEventListener('click', filterAndRenderEntries);
    }

    if (resetEntriesFiltersBtn) {
        resetEntriesFiltersBtn.addEventListener('click', () => {
            if (entriesFilterTypeSelect) entriesFilterTypeSelect.value = 'all';
            if (entriesFilterCategorySelect) entriesFilterCategorySelect.value = 'all';

            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

            if (entriesFilterDateFrom) entriesFilterDateFrom.value = firstDayOfMonth;
            if (entriesFilterDateTo) entriesFilterDateTo.value = lastDayOfMonth;

            filterAndRenderEntries();
        });
    }

    // --- Page Navigation & UI Interactions ---
    function navigateToPage(pageId) {
        const targetPage = document.getElementById(pageId);
        if (!targetPage) {
            console.warn(`Page with ID ${pageId} not found. Defaulting to dashboard.`);
            pageId = 'dashboard-page';
        }
        if (!document.getElementById(pageId)) {
             console.error(`Critical error: Default page ${pageId} also not found. Cannot navigate.`);
             return;
        }
        sidebarLinks.forEach(l => l.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        localStorage.setItem('lastActivePage', pageId);
        const activeSidebarLink = document.querySelector(`.sidebar-link[data-page="${pageId}"]`);
        if (activeSidebarLink) {
            activeSidebarLink.classList.add('active');
            const iconSpan = activeSidebarLink.querySelector('.icon');
            let titleText = activeSidebarLink.textContent.trim();
            if (iconSpan) titleText = titleText.replace(iconSpan.textContent.trim(), '').trim();
            if(pageTitleElement) pageTitleElement.textContent = titleText;
        } else if (pageTitleElement) {
            let title = pageId.replace('-page', '').replace(/-/g, ' ');
            pageTitleElement.textContent = title.charAt(0).toUpperCase() + title.slice(1);
        }
        resetEntryForm();
        resetGoalForm();
        if (pageId === 'settings-page') {
            loadUserProfileForSettings();
        } else if (pageId === 'insights-page') {
            // Ensure analytics data reflects current view or selected filters
            const today = new Date();
            analyticsStartDateInput.value = analyticsStartDateInput.value || new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
            analyticsEndDateInput.value = analyticsEndDateInput.value || new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
            loadIncomeVsExpense();
            loadSpendingByCategory();
        } else if (pageId === 'dashboard-page') {
            // Data is loaded by initializeMonthNavigation or month navigation buttons
            if(currentDisplayYear && currentDisplayMonth) { // Ensure these are set
                 loadDataForMonth(currentDisplayYear, currentDisplayMonth);
            }
        } else if (pageId === 'entries-page') {
            // Load all entries for the entries page
            loadAllEntries();
        }
        if (profileDropdownMenu && profileDropdownMenu.classList.contains('active')) {
            profileDropdownMenu.classList.remove('active');
        }
        if (appSidebar && appSidebar.classList.contains('open')) {
            appSidebar.classList.remove('open');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }
    }

    sidebarLinks.forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); navigateToPage(link.dataset.page); }); });

    if (mobileSidebarToggle && appSidebar && appContainerElement) {
        mobileSidebarToggle.addEventListener('click', () => {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                appSidebar.classList.toggle('open');
                if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
            } else {
                appContainerElement.classList.toggle('sidebar-collapsed');
                appSidebar.classList.toggle('collapsed');
            }
        });
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                if (appSidebar.classList.contains('open')) {
                    appSidebar.classList.remove('open');
                    sidebarOverlay.classList.remove('active');
                }
            });
        }
    }

    if (profilePictureButton && profileDropdownMenu && dropdownUsernameDisplay) {
        profilePictureButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentUser && dropdownUsernameDisplay) {
                dropdownUsernameDisplay.textContent = currentUser.username || 'User';
            }
            profileDropdownMenu.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (profileDropdownMenu && !profileDropdownMenu.contains(e.target) && !profilePictureButton.contains(e.target)) {
                profileDropdownMenu.classList.remove('active');
            }
        });
    }

    if (dropdownSettingsLink) {
        dropdownSettingsLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToPage(dropdownSettingsLink.dataset.page);
        });
    }

    if (dropdownLogoutButton) {
        dropdownLogoutButton.addEventListener('click', () => {
            if (profileDropdownMenu) profileDropdownMenu.classList.remove('active');
            clearMessage(authMessage);
            try {
                clearUserSession();
                showView('login');
                displayMessage('Logged out successfully.', 'success', authMessage);
            } catch (error) {
                clearUserSession();
                showView('login');
            }
        });
    }

    function loadUserBudget() {
        // This is now handled by loadMonthlyBudget and loadDashboardSummaryForMonth
    }

    function updateUserPfpDisplay(pfpUrlToDisplay) {
        const effectivePfpUrl = pfpUrlToDisplay || '';
        if (headerPfpImage) {
            headerPfpImage.src = effectivePfpUrl || defaultPfpHeader;
        }
        if (settingsPfpPreviewLarge) {
            settingsPfpPreviewLarge.src = effectivePfpUrl || defaultPfpSettingsPreview;
        }
    }

    if (headerThemeToggleButton && themeIcon) {
        headerThemeToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
                themeIcon.textContent = '☀️';
            } else {
                localStorage.setItem('theme', 'light');
                themeIcon.textContent = '🌙';
            }

            // Immediately fix chart text colors
            fixChartLegendTextColor();

            // Then refresh charts to update text colors
            const activePage = document.querySelector('.page.active');
            if (activePage) {
                if (activePage.id === 'dashboard-page') {
                    // Reload dashboard charts
                    if (dashboardChartMode === 'income') {
                        updateDashboardChartMode('income');
                    } else {
                        updateDashboardChartMode('expense');
                    }
                } else if (activePage.id === 'insights-page') {
                    // Reload insights charts
                    if (insightsChartMode === 'income') {
                        updateInsightsChartMode('income');
                    } else {
                        updateInsightsChartMode('expense');
                    }
                }
            }

            // Apply fix again after charts are reloaded
            setTimeout(fixChartLegendTextColor, 200);
            setTimeout(fixChartLegendTextColor, 500);
            setTimeout(fixChartLegendTextColor, 1000);
        });
    }

    function applySavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
        }

        // Force chart legend text color
        setTimeout(fixChartLegendTextColor, 500);
    }

    // Function to create a custom legend with the same font as Add Entry
    function createCustomLegend(chart, container, labels, colors, chartMode) {
        // Clear any existing legend
        const existingLegend = container.querySelector('.custom-chart-legend');
        if (existingLegend) {
            existingLegend.remove();
        }

        // Create legend container
        const legendContainer = document.createElement('div');
        legendContainer.className = 'custom-chart-legend';

        // Get the data from the chart
        const data = chart.data.datasets[0].data;

        // Create legend items
        labels.forEach((label, index) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';

            const colorBox = document.createElement('div');
            colorBox.className = 'legend-color';
            colorBox.style.backgroundColor = colors[index];

            const textElement = document.createElement('span');
            textElement.className = 'legend-text';

            // Get the emoji from the label
            const parts = labels[index].split(' ');
            const emoji = parts[0];
            const categoryName = parts.slice(1).join(' ');

            // Set the text content with emoji
            textElement.textContent = `${emoji} ${categoryName}`;

            // Add elements to legend item
            legendItem.appendChild(colorBox);
            legendItem.appendChild(textElement);

            // Add legend item to container
            legendContainer.appendChild(legendItem);
        });

        // Add legend to chart container
        container.appendChild(legendContainer);
    }

    // Function to fix chart legend text color
    function fixChartLegendTextColor() {
        console.log("Fixing chart legend text color");
        const textColor = document.body.classList.contains('dark-theme') ? '#FFFFFF' : '#000000';

        // Direct DOM manipulation for all possible chart text elements
        const selectors = [
            '.chartjs-legend-item-text',
            '.chart-legend li span',
            '.chartjs-render-monitor + ul li span',
            '#dashboardSpendingByCategoryChart + ul li span',
            '#spendingByCategoryChart + ul li span',
            '.chart-js-legend text',
            '.chartjs-render-monitor text',
            'li.chartjs-legend-item span',
            '.chart-legend-item span'
        ];

        // Apply to all possible selectors
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.color = textColor + ' !important';
                el.setAttribute('style', `color: ${textColor} !important`);

                // Force override by adding a class
                el.classList.add('force-text-color');
            });
        });

        // Add a style tag with !important rules
        let styleTag = document.getElementById('chart-text-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'chart-text-style';
            document.head.appendChild(styleTag);
        }

        styleTag.textContent = `
            .force-text-color,
            .chartjs-legend-item-text,
            .chart-legend li span,
            .chartjs-render-monitor + ul li span,
            #dashboardSpendingByCategoryChart + ul li span,
            #spendingByCategoryChart + ul li span,
            li.chartjs-legend-item span,
            .chart-legend-item span {
                color: ${textColor} !important;
            }

            /* Target all spans inside chart containers */
            #dashboard-expenses-pie-chart-container span,
            #spending-by-category-container span {
                color: ${textColor} !important;
            }

            /* Target all text elements in SVG */
            .chart-js-legend text,
            .chartjs-render-monitor text {
                fill: ${textColor} !important;
                color: ${textColor} !important;
            }
        `;

        // Direct attribute modification for Chart.js elements
        document.querySelectorAll('.chart-legend span, .chartjs-legend-item span').forEach(el => {
            el.setAttribute('style', `color: ${textColor} !important`);
        });

        // Force redraw by toggling display
        document.querySelectorAll('#dashboard-expenses-pie-chart-container, #spending-by-category-container').forEach(container => {
            const display = container.style.display;
            container.style.display = 'none';
            setTimeout(() => {
                container.style.display = display;
            }, 10);
        });
    }

    function logHeaderAlignmentDetails() {
        // This function can be called after page navigation or layout changes to debug.
    }

    // --- Initial Application Load ---
    applySavedTheme();
    if (loadUserSession()) {
        if (currentUser && currentUser.pfpUrl) {
            updateUserPfpDisplay(currentUser.pfpUrl);
        } else {
            updateUserPfpDisplay('');
        }
        showView('app'); // This now calls initializeMonthNavigation

        const lastActivePage = localStorage.getItem('lastActivePage');
        if (lastActivePage && document.getElementById(lastActivePage)) {
            navigateToPage(lastActivePage);
        } else {
            navigateToPage('dashboard-page');
        }
        logHeaderAlignmentDetails();
    } else {
        showView('login');
    }
});
