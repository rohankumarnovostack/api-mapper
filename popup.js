// Load and display API calls
function loadApiCalls() {
  chrome.runtime.sendMessage({ action: 'getApiCalls' }, (response) => {
    const apiCalls = response.apiCalls || [];
    displayApiCalls(apiCalls);
  });
}

// Display API calls in the table
function displayApiCalls(apiCalls) {
  const tableBody = document.getElementById('apiTableBody');
  const totalCalls = document.getElementById('totalCalls');

  totalCalls.textContent = apiCalls.length;

  if (apiCalls.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" class="no-data">No API calls tracked yet</td></tr>';
    return;
  }

  tableBody.innerHTML = '';
  apiCalls.forEach((call) => {
    const row = document.createElement('tr');

    const locationCell = document.createElement('td');
    locationCell.textContent = call.location;
    locationCell.className = 'location-cell';

    const apiNameCell = document.createElement('td');
    apiNameCell.textContent = call.apiName || 'N/A';
    apiNameCell.className = 'api-name-cell';

    const apiCell = document.createElement('td');
    apiCell.textContent = call.api;
    apiCell.className = 'api-cell';

    const methodCell = document.createElement('td');
    methodCell.textContent = call.method || 'GET';
    methodCell.className = 'method-cell';

    const timeCell = document.createElement('td');
    timeCell.textContent = new Date(call.timestamp).toLocaleString();
    timeCell.className = 'time-cell';

    row.appendChild(locationCell);
    row.appendChild(apiNameCell);
    row.appendChild(apiCell);
    row.appendChild(methodCell);
    row.appendChild(timeCell);

    tableBody.appendChild(row);
  });
}

// Export to Excel (CSV format)
function exportToExcel() {
  chrome.runtime.sendMessage({ action: 'getApiCalls' }, (response) => {
    const apiCalls = response.apiCalls || [];

    if (apiCalls.length === 0) {
      alert('No API calls to export!');
      return;
    }

    // Prepare CSV data with headers
    const csvRows = [];
    csvRows.push(['Location', 'API Name', 'API', 'Method', 'Timestamp']);

    apiCalls.forEach((call) => {
      csvRows.push([
        call.location || '',
        call.apiName || 'N/A',
        call.api || '',
        call.method || 'GET',
        call.timestamp || ''
      ]);
    });

    // Convert to CSV format
    const csvContent = csvRows.map(row =>
      row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return '"' + cellStr.replace(/"/g, '""') + '"';
        }
        return cellStr;
      }).join(',')
    ).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Generate filename with timestamp
    const filename = `API_Mapping_${new Date().toISOString().split('T')[0]}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    const exportBtn = document.getElementById('exportBtn');
    const originalText = exportBtn.textContent;
    exportBtn.textContent = 'Exported!';
    exportBtn.classList.add('success');

    setTimeout(() => {
      exportBtn.textContent = originalText;
      exportBtn.classList.remove('success');
    }, 2000);
  });
}

// Clear all data
function clearData() {
  if (confirm('Are you sure you want to clear all tracked API calls?')) {
    chrome.runtime.sendMessage({ action: 'clearApiCalls' }, (response) => {
      if (response.success) {
        loadApiCalls();
      }
    });
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadApiCalls();

  document.getElementById('exportBtn').addEventListener('click', exportToExcel);
  document.getElementById('clearBtn').addEventListener('click', clearData);
  document.getElementById('refreshBtn').addEventListener('click', loadApiCalls);
});
