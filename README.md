# The Spending Post

A simple personal spending tracker with an old-internet inspired interface.

## Open the site

Open index.html in a modern web browser. No build step or external libraries are required.

Your spending entries, monthly budget, and display currency are saved in your browser on this device with localStorage.

## Features

- Add and remove spending entries with a description, amount, date, and category.
- Review monthly totals, entry counts, and remaining budget.
- Set a monthly budget and see a simple progress bar.
- Filter the log by category or search by description.
- Change the display currency.
- Keep saved data in the browser on this device.

## Assignment concepts in the code

- Variables and data types: JavaScript uses strings, numbers, arrays, objects, and booleans to hold entries and settings.
- Operations: it adds spending amounts, subtracts totals from the budget, and calculates budget percentage.
- Arrays: the entries and category names are stored in arrays.
- Loops: for-of loops build category options, calculate totals, filter entries, and render table rows.
- Functions: named functions load data, format amounts, update the summary, render the log, and handle form actions.
- If and else: conditionals validate form entries, handle an empty log, and show whether spending is within budget.

## Files

- index.html contains the page structure.
- styles.css contains the solid-color, responsive layout.
- script.js contains the spending tracker behavior.
