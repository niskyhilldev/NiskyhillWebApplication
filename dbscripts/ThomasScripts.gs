function formatDates() {
  // Get the active sheet
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Get column F data (column index 6)
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange(1, 6, lastRow, 1); // Column F from row 1 to last row
  const values = range.getValues();
  
  // Process each cell in column F
  for (let row = 0; row < values.length; row++) {
    const cellValue = values[row][0]; // Only one column, so index 0
    
    // Skip empty cells
    if (!cellValue || cellValue === '') continue;
    
    // Convert to string and format
    const originalValue = cellValue.toString().trim();
    const formattedDate = formatDateString(originalValue);
    
    // Update the cell if formatting was successful
    if (formattedDate && formattedDate !== originalValue) {
      sheet.getRange(row + 1, 6).setValue(formattedDate); // Column 6 is F
    }
  }
}

function formatDateString(dateStr) {
  // Remove any trailing periods
  dateStr = dateStr.replace(/\.$/, '');
  
  // Month name mappings
  const monthNames = {
    'january': 1, 'jan': 1,
    'february': 2, 'feb': 2,
    'march': 3, 'mar': 3,
    'april': 4, 'apr': 4,
    'may': 5,
    'june': 6, 'jun': 6,
    'july': 7, 'jul': 7,
    'august': 8, 'aug': 8,
    'september': 9, 'sep': 9, 'sept': 9,
    'october': 10, 'oct': 10,
    'november': 11, 'nov': 11,
    'december': 12, 'dec': 12
  };
  
  let month, day, year;
  
  try {
    // Pattern 1: M/D/YYYY or MM/DD/YYYY (like 5/24/1939, 12/30/1937)
    let match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (match) {
      month = parseInt(match[1]);
      day = parseInt(match[2]);
      year = parseInt(match[3]);
      
      // Handle 2-digit years (assume 1900s for years < 50, 2000s for years >= 50)
      if (year < 100) {
        year = year < 50 ? 2000 + year : 1900 + year;
      }
      
      return formatOutput(month, day, year);
    }
    
    // Pattern 2: Month Name DD YYYY (like "July 5 1943", "December 5 1949")
    match = dateStr.match(/^([a-zA-Z]+)\s+(\d{1,2})\s+(\d{4})$/);
    if (match) {
      const monthName = match[1].toLowerCase();
      month = monthNames[monthName];
      day = parseInt(match[2]);
      year = parseInt(match[3]);
      
      if (month) {
        return formatOutput(month, day, year);
      }
    }
    
    // Pattern 3: Mon.DD YYYY (like "Apr.9 1872")
    match = dateStr.match(/^([a-zA-Z]+)\.(\d{1,2})\s+(\d{4})$/);
    if (match) {
      const monthName = match[1].toLowerCase();
      month = monthNames[monthName];
      day = parseInt(match[2]);
      year = parseInt(match[3]);
      
      if (month) {
        return formatOutput(month, day, year);
      }
    }
    
    // Pattern 4: Mon. DD YYYY (like "Jan. 25 2010")
    match = dateStr.match(/^([a-zA-Z]+)\.\s+(\d{1,2})\s+(\d{4})$/);
    if (match) {
      const monthName = match[1].toLowerCase();
      month = monthNames[monthName];
      day = parseInt(match[2]);
      year = parseInt(match[3]);
      
      if (month) {
        return formatOutput(month, day, year);
      }
    }
    
    // If no pattern matches, try to parse as a regular date
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      month = parsedDate.getMonth() + 1;
      day = parsedDate.getDate();
      year = parsedDate.getFullYear();
      
      return formatOutput(month, day, year);
    }
    
  } catch (error) {
    console.log(`Error processing date: ${dateStr}`, error);
  }
  
  // If all parsing fails, return the original string
  return dateStr;
}

function formatOutput(month, day, year) {
  // Validate the date
  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1000) {
    return null;
  }
  
  // Additional validation for days per month
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day > daysInMonth[month - 1]) {
    return null;
  }
  
  // Format as month-DD-YYYY
  const formattedDay = day.toString().padStart(2, '0');
  return `${month}-${formattedDay}-${year}`;
}

// Alternative function to format a specific range
function formatDateRange(startCell, endCell) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getRange(startCell + ':' + endCell);
  const values = range.getValues();
  
  for (let row = 0; row < values.length; row++) {
    for (let col = 0; col < values[row].length; col++) {
      const cellValue = values[row][col];
      
      if (!cellValue || cellValue === '') continue;
      
      const originalValue = cellValue.toString().trim();
      const formattedDate = formatDateString(originalValue);
      
      if (formattedDate && formattedDate !== originalValue) {
        range.getCell(row + 1, col + 1).setValue(formattedDate);
      }
    }
  }
}

// Function to replace & with , in column G
function replaceAmpersandInColumnG() {
  // Get the active sheet
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Get column G data (column index 7)
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange(1, 7, lastRow, 1); // Column G from row 1 to last row
  const values = range.getValues();
  
  // Process each cell in column G
  for (let row = 0; row < values.length; row++) {
    const cellValue = values[row][0]; // Only one column, so index 0
    
    // Skip empty cells
    if (!cellValue || cellValue === '') continue;
    
    // Convert to string and replace & with , (removing extra spaces)
    const originalValue = cellValue.toString();
    const updatedValue = originalValue.replace(/\s*&\s*/g, ',');
    
    // Update the cell if there was a change
    if (updatedValue !== originalValue) {
      sheet.getRange(row + 1, 7).setValue(updatedValue); // Column 7 is G
    }
  }
}

// Function to remove parentheses but keep their contents from column G
function removeParenthesesFromColumnG() {
  // Get the active sheet
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Get column G data (column index 7)
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange(1, 7, lastRow, 1); // Column G from row 1 to last row
  const values = range.getValues();
  
  // Process each cell in column G
  for (let row = 0; row < values.length; row++) {
    const cellValue = values[row][0]; // Only one column, so index 0
    
    // Skip empty cells
    if (!cellValue || cellValue === '') continue;
    
    // Convert to string and remove only the parentheses characters
    const originalValue = cellValue.toString();
    
    // Remove opening and closing parentheses, but keep the content between them
    let updatedValue = originalValue.replace(/[()]/g, '');
    
    // Clean up any extra whitespace that might result from removing parentheses
    updatedValue = updatedValue.replace(/\s+/g, ' ').trim();
    
    // Update the cell if there was a change
    if (updatedValue !== originalValue) {
      sheet.getRange(row + 1, 7).setValue(updatedValue); // Column 7 is G
    }
  }
}


// Function to remove all # characters from every column
function removeHashFromAllColumns() {
  // Get the active sheet
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Get all data from the sheet
  const range = sheet.getDataRange();
  const values = range.getValues();
  
  // Process each cell
  for (let row = 0; row < values.length; row++) {
    for (let col = 0; col < values[row].length; col++) {
      const cellValue = values[row][col];
      
      // Skip empty cells
      if (!cellValue || cellValue === '') continue;
      
      // Convert to string and remove # characters
      const originalValue = cellValue.toString();
      const updatedValue = originalValue.replace(/#/g, '');
      
      // Update the cell if there was a change
      if (updatedValue !== originalValue) {
        sheet.getRange(row + 1, col + 1).setValue(updatedValue);
      }
    }
  }
}


// Function to remove all NAME? characters from every column
function removeQuestionFromAllColumns() {
  // Get the active sheet
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Get all data from the sheet
  const range = sheet.getDataRange();
  const values = range.getValues();
  
  // Process each cell
  for (let row = 0; row < values.length; row++) {
    for (let col = 0; col < values[row].length; col++) {
      const cellValue = values[row][col];
      
      // Skip empty cells
      if (!cellValue || cellValue === '') continue;
      
      // Convert to string and remove NAME? characters
      const originalValue = cellValue.toString();
      const updatedValue = originalValue.replace(/NAME\?/g, '');
      
      // Update the cell if there was a change
      if (updatedValue !== originalValue) {
        sheet.getRange(row + 1, col + 1).setValue(updatedValue);
      }
    }
  }
}

/// Function to remove titles (Mrs., Mrs, Miss, Mr., Mr) from column G
function removeTitlesFromColumnG() {
  // Get the active sheet
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Get column G data (column index 7)
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange(1, 7, lastRow, 1); // Column G from row 1 to last row
  const values = range.getValues();
  
  // Process each cell in column G
  for (let row = 0; row < values.length; row++) {
    const cellValue = values[row][0]; // Only one column, so index 0
    
    // Skip empty cells
    if (!cellValue || cellValue === '') continue;
    
    // Convert to string and remove titles
    const originalValue = cellValue.toString();
    
    // Remove all instances of Mrs., Mrs, Miss, Mr., and Mr
    // Using word boundaries (\b) to ensure we don't remove parts of other words
    let updatedValue = originalValue.replace(/\b(Mrs?\.?|Miss\.?)\b/gi, '');
    
    // Remove all dots
    updatedValue = updatedValue.replace(/\./g, '');
    
    // Clean up any extra whitespace that might result from removing titles and dots
    updatedValue = updatedValue.replace(/\s+/g, ' ').trim();
    
    // Update the cell if there was a change
    if (updatedValue !== originalValue) {
      sheet.getRange(row + 1, 7).setValue(updatedValue); // Column 7 is G
    }
  }
}

// Function to remove square brackets [ and ] from any column
function removeBracketsFromAllColumns() {
  // Get the active sheet
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Get all data from the sheet
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  
  if (lastRow === 0 || lastCol === 0) return; // No data to process
  
  const range = sheet.getRange(1, 1, lastRow, lastCol);
  const values = range.getValues();
  
  // Process each cell in the sheet
  for (let row = 0; row < values.length; row++) {
    for (let col = 0; col < values[row].length; col++) {
      const cellValue = values[row][col];
      
      // Skip empty cells
      if (!cellValue || cellValue === '') continue;
      
      // Convert to string and remove square brackets
      const originalValue = cellValue.toString();
      
      // Remove all square brackets [ and ]
      let updatedValue = originalValue.replace(/[\[\]]/g, '');
      
      // Clean up any extra whitespace
      updatedValue = updatedValue.replace(/\s+/g, ' ').trim();
      
      // Update the cell if there was a change
      if (updatedValue !== originalValue) {
        sheet.getRange(row + 1, col + 1).setValue(updatedValue);
      }
    }
  }
}

// Function to remove numbers from column G, but replace 0 with O
function removeNumbersFromColumnG() {
  // Get the active sheet
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Get column G data (column index 7)
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange(1, 7, lastRow, 1); // Column G from row 1 to last row
  const values = range.getValues();
  
  // Process each cell in column G
  for (let row = 0; row < values.length; row++) {
    const cellValue = values[row][0]; // Only one column, so index 0
    
    // Skip empty cells
    if (!cellValue || cellValue === '') continue;
    
    // Convert to string and process numbers
    const originalValue = cellValue.toString();
    
    // First replace all 0s with Os
    let updatedValue = originalValue.replace(/0/g, 'O');
    
    // Then remove all other digits (1-9)
    updatedValue = updatedValue.replace(/[1-9]/g, '');
    
    // Clean up any extra whitespace
    updatedValue = updatedValue.replace(/\s+/g, ' ').trim();
    
    // Update the cell if there was a change
    if (updatedValue !== originalValue) {
      sheet.getRange(row + 1, 7).setValue(updatedValue); // Column 7 is G
    }
  }
}


/// Function to remove dashes from column G
function removeDashesFromColumnG() {
  // Get the active sheet
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Get column G data (column index 7)
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange(1, 7, lastRow, 1); // Column G from row 1 to last row
  const values = range.getValues();
  
  // Process each cell in column G
  for (let row = 0; row < values.length; row++) {
    const cellValue = values[row][0]; // Only one column, so index 0
    
    // Skip empty cells
    if (!cellValue || cellValue === '') continue;
    
    // Convert to string and remove titles
    const originalValue = cellValue.toString();
    
    // Remove all instances of Mrs., Mrs, Miss, Mr., and Mr
    // Using word boundaries (\b) to ensure we don't remove parts of other words
    let updatedValue = originalValue.replace(/-/g, '');

    // Update the cell if there was a change
    if (updatedValue !== originalValue) {
      sheet.getRange(row + 1, 7).setValue(updatedValue); // Column 7 is G
    }
  }
}