//Status keys and the labels shown on screen

const STATUS = {
  'assigned': 'Assigned',
  'picked-up': 'Picked Up',
  'out-for-delivery': 'Out for Delivery',
  'delivered': 'Delivered',
  'failed': 'Failed Delivery'
};

//Allowed status changes

const NEXT_STATUS = {
  'assigned': ['picked-up'],
  'picked-up': ['out-for-delivery'],
  'out-for-delivery': ['delivered', 'failed'],
  'delivered': [],
  'failed': []
};

const DELIVERY_PARTNER = { name: 'Razeen' };

//Sample orders 

const ago = (days, minutes = 0) =>
  new Date(Date.now() - days * 86400000 - minutes * 60000).toISOString();

function makeOrder(id, customer, phone, address, instructions, cod, status, days, minutes, failReason = '') {
  const times = {};
  const reachedOut = ['out-for-delivery', 'delivered', 'failed'].includes(status);
  if (status !== 'assigned') times['picked-up'] = ago(days, minutes + 20);
  if (reachedOut) times['out-for-delivery'] = ago(days, minutes + 10);
  if (status === 'delivered' || status === 'failed') times[status] = ago(days, minutes);
  return {
    id, customer, phone, address, instructions, cod, status,
    assignedAt: ago(days, minutes + 40),
    times, failReason
  };
}


const SAMPLE_ORDERS = [
  makeOrder('ORD-1047', 'Ayesha Rahman', '01711-000001', 'House 12, Road 5, Dhanmondi', 'Call before arrival', 1250, 'out-for-delivery', 0, 5),
  makeOrder('ORD-1048', 'Fahim Hasan', '01711-000002', 'Block C, Bashundhara', 'Leave at reception', 0, 'picked-up', 0, 5),
  makeOrder('ORD-1049', 'Muntaha Islam', '01711-000003', 'Flat 4B, Gulshan-1', 'Ring the bell', 2400, 'delivered', 0, 15),
  makeOrder('ORD-1050', 'Rafiq Ahmed', '01711-000004', 'Road 8, Uttara', 'Handle with care', 980, 'failed', 0, 20, 'Customer not available'),
  makeOrder('ORD-1043', 'Nabila Karim', '01711-000005', 'House 3, Mirpur-10', 'Ring twice', 0, 'delivered', 0, 25),
  makeOrder('ORD-1044', 'Sohan Mia', '01711-000006', 'Road 2, Banani', 'Leave with guard', 560, 'delivered', 0, 30),
  makeOrder('ORD-1045', 'Tania Akter', '01711-000007', 'Flat 6C, Mohammadpur', 'Call on arrival', 0, 'delivered', 0, 35),
  makeOrder('ORD-1046', 'Jamil Uddin', '01711-000008', 'Lane 4, Motijheel', 'Office hours only', 1800, 'delivered', 0, 40),
  makeOrder('ORD-1039', 'Sara Khan', '01711-000009', 'House 9, Lalmatia', 'None', 0, 'delivered', 1, 0),
  makeOrder('ORD-1038', 'Tariq Hossain', '01711-000010', 'Road 11, Baridhara', 'Call before arrival', 750, 'delivered', 2, 0),
  makeOrder('ORD-1037', 'Nusrat Jahan', '01711-000011', 'Sector 7, Uttara', 'Leave at door', 0, 'delivered', 3, 0),
  makeOrder('ORD-1036', 'Imran Ahmed', '01711-000012', 'Block B, Banasree', 'Ring the bell', 1100, 'delivered', 4, 0)
];

const SAMPLE_ISSUES = [
  { id: 'ISS-1', orderId: 'ORD-1050', type: 'Customer unavailable', description: 'Customer did not answer the phone or the door.', reportedAt: ago(0, 18) }
];
let nextIssueNumber = 2;

//validation
function validateIssue({ orderId, type, description }) {
  const errors = {};
  const text = description.trim();

  if (orderId === '') errors.orderId = 'Select the order this issue is about.';
  if (type === '') errors.type = 'Select an issue type.';

  if (text === '') {
    errors.description = 'Describe the problem.';
  } else if (text.length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  } else if (text.length > 300) {
    errors.description = 'Description must be 300 characters or fewer.';
  }

  return errors;
}


//Returns an error message, or an empty string when valid
function validateFailReason(reason) {
  return reason === '' ? 'Select a reason for the failed delivery.' : '';
}

//An order is "active" while it can still move to another status
const isActive = order => NEXT_STATUS[order.status].length > 0;

const isToday = iso => new Date(iso).toDateString() === new Date().toDateString();

//Moves an order to a new status if the change is allowed
function updateStatus(orders, id, newStatus, failReason = '') {
  let order = null;
  for (const item of orders) {
    if (item.id === id) {
      order = item;
      break;
    }
  }
  if (!order) return { ok: false, message: 'Order not found.' };

  if (!NEXT_STATUS[order.status].includes(newStatus)) {
    return {
      ok: false,
      message: 'An order that is "' + STATUS[order.status] + '" cannot be changed to "' + STATUS[newStatus] + '".'
    };
  }
  if (newStatus === 'failed' && failReason === '') {
    return { ok: false, message: 'A reason is required for a failed delivery.' };
  }

  order.status = newStatus;
  order.times[newStatus] = new Date().toISOString();
  if (newStatus === 'failed') order.failReason = failReason;

  return { ok: true, message: 'Order #' + order.id + ' marked as ' + STATUS[newStatus] + '.' };
}

function addIssue(issues, { orderId, type, description }) {
  const issue = {
    id: 'ISS-' + nextIssueNumber,
    orderId,
    type,
    description: description.trim(),
    reportedAt: new Date().toISOString()
  };
  nextIssueNumber++;
  issues.push(issue);
  return issue;
}

function getStats(orders, issues) {
  let today = 0;
  let completed = 0;
  let inProgress = 0;

  for (const order of orders) {
    if (isToday(order.assignedAt)) {
      today++;
      if (order.status === 'delivered') completed++;
      if (order.status === 'picked-up' || order.status === 'out-for-delivery') inProgress++;
    }
  }

  return {
    today: today,
    completed: completed,
    inProgress: inProgress,
    issues: issues.length
  };
}


//Search by order ID, customer or address, and filter by status
function filterOrders(orders, search, status) {
  const term = search.trim().toLowerCase();
  const results = [];
  for (const order of orders) {
    const matchesStatus = status === 'all' || order.status === status;
    const matchesText = term === '' ||
      (order.id + ' ' + order.customer + ' ' + order.address).toLowerCase().includes(term);
    if (matchesStatus && matchesText) results.push(order);
  }
  return results;
}

//Delivered orders from the last N days, newest first
function getHistory(orders, days) {
  const cutoff = Date.now() - days * 86400000;
  const history = [];

  for (const order of orders) {
    if (order.status === 'delivered' && new Date(order.times.delivered).getTime() >= cutoff) {
      history.push(order);
    }
  }

  for (let i = 0; i < history.length; i++) {
    for (let j = i + 1; j < history.length; j++) {
      const firstTime = new Date(history[i].times.delivered).getTime();
      const secondTime = new Date(history[j].times.delivered).getTime();
      if (secondTime > firstTime) {
        const temporary = history[i];
        history[i] = history[j];
        history[j] = temporary;
      }
    }
  }

  return history;
}


//Stops data from being read as HTML
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
));

const statusBadge = status => '<span class="status status-' + status + '">' + STATUS[status] + '</span>';

const formatDateTime = iso => new Date(iso).toLocaleString('en-GB', {
  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
});
const formatDate = iso => new Date(iso).toLocaleDateString('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric'
});

//Top bar and stats 
function renderProfile(name) {
  document.getElementById('partnerName').textContent = name;
  document.getElementById('profileName').textContent = name;
  document.getElementById('avatar').textContent = name.charAt(0).toUpperCase();
}

function renderStats(stats, activeCount) {
  document.getElementById('statToday').textContent = stats.today;
  document.getElementById('statCompleted').textContent = stats.completed;
  document.getElementById('statProgress').textContent = stats.inProgress;
  document.getElementById('statIssues').textContent = stats.issues;
  document.getElementById('notifCount').textContent = activeCount;
}

//Deliveries table 
function renderDeliveries(list, selectedId) {
  if (list.length === 0) {
    document.getElementById('deliveriesBody').innerHTML = '<tr><td colspan="6" class="empty-row">No deliveries match your search.</td></tr>';
    return;
  }
  let rows = '';
  for (const order of list) {
    rows += '<tr id="deliveryRow-' + escapeHtml(order.id) + '" class="' + (order.id === selectedId ? 'selected' : '') + '">' +
      '<td>#' + escapeHtml(order.id) + '</td>' +
      '<td>' + escapeHtml(order.customer) + '</td>' +
      '<td>' + escapeHtml(order.address) + '</td>' +
      '<td>' + escapeHtml(order.instructions) + '</td>' +
      '<td>' + statusBadge(order.status) + '</td>' +
      '<td>' + (isActive(order)
        ? '<button type="button" class="btn btn-primary btn-small update-action">Update Status</button>'
        : '<button type="button" class="btn btn-outline btn-small view-action">View Details</button>') +
      ' <button type="button" class="btn btn-outline btn-small edit-delivery-action">Edit</button>' +
      ' <button type="button" class="btn btn-danger btn-small delete-delivery-action">Delete</button>' +
      '</td></tr>';
  }
  document.getElementById('deliveriesBody').innerHTML = rows;
}

function renderTableInfo(total, from, to) {
  document.getElementById('tableInfo').textContent = total === 0
    ? 'Showing 0 deliveries'
    : 'Showing ' + (from + 1) + '\u2013' + to + ' of ' + total + ' deliveries';
}

function renderPagination(pages, current) {
  let html = '<li><button type="button" class="page-btn" value="prev" aria-label="Previous page" ' + (current === 1 ? 'disabled' : '') + '>&laquo;</button></li>';
  for (let p = 1; p <= pages; p++) {
    html += '<li><button type="button" class="page-btn ' + (p === current ? 'active' : '') + '" value="' + p + '">' + p + '</button></li>';
  }
  html += '<li><button type="button" class="page-btn" value="next" aria-label="Next page" ' + (current === pages ? 'disabled' : '') + '>&raquo;</button></li>';
  document.getElementById('pagination').innerHTML = html;
}

//Update status panel 
const TIMELINE_STEPS = ['picked-up', 'out-for-delivery', 'delivered', 'failed'];

function detailsHtml(order) {
  const cash = order.cod ? 'Tk ' + order.cod.toLocaleString('en-US') : 'Paid online';
  return '<dl class="details-list">' +
    '<dt>Customer</dt><dd>' + escapeHtml(order.customer) + '</dd>' +
    '<dt>Phone</dt><dd>' + escapeHtml(order.phone) + '</dd>' +
    '<dt>Address</dt><dd>' + escapeHtml(order.address) + '</dd>' +
    '<dt>Instructions</dt><dd>' + escapeHtml(order.instructions) + '</dd>' +
    '<dt>Cash to collect</dt><dd>' + cash + '</dd>' +
    '<dt>Status</dt><dd>' + statusBadge(order.status) + '</dd>' +
    (order.failReason ? '<dt>Failure reason</dt><dd>' + escapeHtml(order.failReason) + '</dd>' : '') +
    '</dl>';
}

function renderSelectedDetails(order) {
  document.getElementById('selectedOrder').textContent = 'Order #' + order.id;

  let timeline = '';
  for (const step of TIMELINE_STEPS) {
    const time = order.times[step];
    let cls = 'timeline-step';
    if (order.status === step) cls += step === 'failed' ? ' current failed' : ' current';
    else if (time) cls += ' done';
    timeline += '<li class="' + cls + '"><strong>' + STATUS[step] + '</strong>' + (time ? '<small>' + formatDateTime(time) + '</small>' : '') + '</li>';
  }
  document.getElementById('timeline').innerHTML = timeline;

  document.getElementById('deliveryInfo').innerHTML = '<h3 class="card-heading">Delivery Details</h3>' + detailsHtml(order);

  
  // Only the allowed next statuses stay enabled
  const statusButtons = [
    { id: 'statusPickedUp', status: 'picked-up' },
    { id: 'statusOutForDelivery', status: 'out-for-delivery' },
    { id: 'statusDelivered', status: 'delivered' },
    { id: 'statusFailed', status: 'failed' }
  ];
  for (const item of statusButtons) {
    document.getElementById(item.id).disabled = !NEXT_STATUS[order.status].includes(item.status);
  }
  toggleFailBox(false);
}

function toggleFailBox(show) {
  document.getElementById('failBox').hidden = !show;
  if (!show) {
    document.getElementById('failReason').value = '';
    setError('failReason', '');
  }
}

//History and report form 
function renderHistory(list) {
  if (list.length === 0) {
    document.getElementById('historyBody').innerHTML = '<tr><td colspan="5" class="empty-row">No deliveries in this period.</td></tr>';
    return;
  }
  let rows = '';
  for (const order of list) {
    rows += '<tr id="historyRow-' + escapeHtml(order.id) + '">' +
      '<td>#' + escapeHtml(order.id) + '</td>' +
      '<td>' + escapeHtml(order.customer) + '</td>' +
      '<td>' + statusBadge(order.status) + '</td>' +
      '<td>' + formatDate(order.times.delivered) + '</td>' +
      '<td><button type="button" class="btn btn-outline btn-small view-action">View</button></td>' +
      '</tr>';
  }
  document.getElementById('historyBody').innerHTML = rows;
}

function fillOrderSelect(orders) {
  const select = document.getElementById('issueOrder');
  const current = select.value;
  let options = '<option value="">Select an order</option>';
  for (const order of orders) {
    options += '<option value="' + escapeHtml(order.id) + '">#' + escapeHtml(order.id) + ' - ' + escapeHtml(order.customer) + '</option>';
  }
  select.innerHTML = options;
  select.value = current;
}

function showTab(name) {
  document.querySelectorAll('.tab').forEach(tab => {
    const on = tab.id === (name === 'history' ? 'historyTab' : 'reportTab');
    tab.classList.toggle('active', on);
    tab.setAttribute('aria-selected', String(on));
  });
  document.getElementById('historyPanel').hidden = name !== 'history';
  document.getElementById('reportPanel').hidden = name !== 'report';
}

//Messages, errors, dialog 
function setError(fieldId, message = '') {
  document.getElementById(fieldId + 'Error').textContent = message;
  document.getElementById(fieldId).classList.toggle('invalid', message !== '');
}

let toastTimer;
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast ' + (type === 'error' ? 'toast-error' : '');
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
}

function openDetails(order) {
  document.getElementById('detailsTitle').textContent = 'Order #' + order.id;
  document.getElementById('detailsContent').innerHTML = detailsHtml(order);
  document.getElementById('detailsDialog').showModal();
}


//dashboard and status
const PER_PAGE = 4;

const state = {
  orders: [],
  issues: [],
  selectedId: null,
  search: '',
  status: 'all',
  page: 1,
  historyDays: 30
};
let editingDeliveryId = null;
let editingIssueId = null;
let nextDeliveryNumber = 1051;


function selectedOrder() {
  for (const order of state.orders) {
    if (order.id === state.selectedId) return order;
  }
  return null;
}

function findOrder(id) {
  for (const order of state.orders) {
    if (order.id === id) return order;
  }
  return null;
}

function findIssue(id) {
  for (const issue of state.issues) {
    if (issue.id === id) return issue;
  }
  return null;
}

function init() {
  renderProfile(DELIVERY_PARTNER.name);
  loadData();
  bindEvents();
}

function loadData() {
  state.orders = SAMPLE_ORDERS;
  state.issues = SAMPLE_ISSUES;
  if (!selectedOrder()) selectFirstDelivery();
  renderAll();
}

function selectFirstDelivery() {
  let first = null;
  for (const order of state.orders) {
    if (isActive(order)) {
      first = order;
      break;
    }
  }
  if (!first) first = state.orders[0];
  state.selectedId = first ? first.id : null;
}

function openDeliveryForm(id) {
  const form = document.getElementById('deliveryForm');
  form.reset();
  editingDeliveryId = id || null;

  setError('deliveryCustomer', '');
  setError('deliveryPhone', '');
  setError('deliveryAddress', '');
  setError('deliveryCod', '');

  if (editingDeliveryId) {
    const order = findOrder(editingDeliveryId);
    if (!order) return;

    document.getElementById('deliveryFormTitle').textContent = 'Edit Delivery';
    document.getElementById('deliveryCustomer').value = order.customer;
    document.getElementById('deliveryPhone').value = order.phone;
    document.getElementById('deliveryAddress').value = order.address;
    document.getElementById('deliveryInstructions').value = order.instructions;
    document.getElementById('deliveryCod').value = order.cod;
    document.getElementById('saveDeliveryBtn').textContent = 'Save Changes';
  } else {
    document.getElementById('deliveryFormTitle').textContent = 'Add Delivery';
    document.getElementById('deliveryCod').value = '0';
    document.getElementById('saveDeliveryBtn').textContent = 'Save Delivery';
  }

  document.getElementById('deliveryFormDialog').showModal();
}

function saveDelivery(event) {
  event.preventDefault();

  const customer = document.getElementById('deliveryCustomer').value.trim();
  const phone = document.getElementById('deliveryPhone').value.trim();
  const address = document.getElementById('deliveryAddress').value.trim();
  const instructions = document.getElementById('deliveryInstructions').value.trim() || 'None';
  const codText = document.getElementById('deliveryCod').value.trim();
  const cod = Number(codText);

  setError('deliveryCustomer', customer === '' ? 'Enter the customer name.' : '');
  setError('deliveryPhone', phone === '' ? 'Enter a phone number.' : '');
  setError('deliveryAddress', address === '' ? 'Enter the delivery address.' : '');
  setError('deliveryCod', codText === '' || !Number.isFinite(cod) || cod < 0 ? 'Enter a valid amount of 0 or more.' : '');

  if (customer === '' || phone === '' || address === '' || codText === '' || !Number.isFinite(cod) || cod < 0) return;

  if (editingDeliveryId) {
    const order = findOrder(editingDeliveryId);
    if (!order) return;
    order.customer = customer;
    order.phone = phone;
    order.address = address;
    order.instructions = instructions;
    order.cod = cod;
    showToast('Delivery #' + order.id + ' updated.');
  } else {
    const order = {
      id: 'ORD-' + nextDeliveryNumber,
      customer: customer,
      phone: phone,
      address: address,
      instructions: instructions,
      cod: cod,
      status: 'assigned',
      assignedAt: new Date().toISOString(),
      times: {},
      failReason: ''
    };
    nextDeliveryNumber++;
    state.orders.unshift(order);
    state.selectedId = order.id;
    state.search = '';
    state.status = 'all';
    state.page = 1;
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = 'all';
    showToast('Delivery #' + order.id + ' added.');
  }

  editingDeliveryId = null;
  document.getElementById('deliveryFormDialog').close();
  document.getElementById('deliveryForm').reset();
  renderAll();
}

function deleteDelivery(id) {
  const order = findOrder(id);
  if (!order) return;

  const confirmed = window.confirm('Delete delivery #' + order.id + '? Any issue reports for this delivery will also be removed.');
  if (!confirmed) return;

  for (let i = 0; i < state.orders.length; i++) {
    if (state.orders[i].id === id) {
      state.orders.splice(i, 1);
      break;
    }
  }

  for (let i = state.issues.length - 1; i >= 0; i--) {
    if (state.issues[i].orderId === id) state.issues.splice(i, 1);
  }

  if (state.selectedId === id) selectFirstDelivery();
  state.page = 1;
  showToast('Delivery #' + id + ' deleted.');
  renderAll();
}

//Rendering 
function renderAll() {
  let activeCount = 0;
  for (const order of state.orders) {
    if (isActive(order)) activeCount++;
  }
  renderStats(getStats(state.orders, state.issues), activeCount);
  renderTable();
  renderSelected();
  renderHistory(getHistory(state.orders, state.historyDays));
  fillOrderSelect(state.orders);
  renderIssues(state.issues);
}

function renderIssues(issues) {
  if (issues.length === 0) {
    document.getElementById('issuesBody').innerHTML = '<tr><td colspan="6" class="empty-row">No issues have been reported.</td></tr>';
    return;
  }

  let rows = '';
  for (const issue of issues) {
    rows += '<tr id="issueRow-' + escapeHtml(issue.id) + '">' +
      '<td>' + escapeHtml(issue.id) + '</td>' +
      '<td>#' + escapeHtml(issue.orderId) + '</td>' +
      '<td>' + escapeHtml(issue.type) + '</td>' +
      '<td>' + escapeHtml(issue.description) + '</td>' +
      '<td>' + formatDateTime(issue.reportedAt) + '</td>' +
      '<td><button type="button" class="btn btn-outline btn-small edit-issue-action">Edit</button> ' +
      '<button type="button" class="btn btn-danger btn-small delete-issue-action">Delete</button></td>' +
      '</tr>';
  }
  document.getElementById('issuesBody').innerHTML = rows;
}

function renderTable() {
  const list = filterOrders(state.orders, state.search, state.status);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  state.page = Math.min(Math.max(state.page, 1), pages);

  const start = (state.page - 1) * PER_PAGE;
  const end = Math.min(start + PER_PAGE, list.length);

  const pageOrders = [];
  for (let i = start; i < end; i++) {
    pageOrders.push(list[i]);
  }
  renderDeliveries(pageOrders, state.selectedId);
  renderTableInfo(list.length, start, end);
  renderPagination(pages, state.page);
}

function renderSelected() {
  const order = selectedOrder();
  if (order) {
    renderSelectedDetails(order);
    return;
  }

  document.getElementById('selectedOrder').textContent = 'No delivery selected';
  document.getElementById('timeline').innerHTML = '';
  document.getElementById('deliveryInfo').innerHTML = '';
  document.getElementById('statusPickedUp').disabled = true;
  document.getElementById('statusOutForDelivery').disabled = true;
  document.getElementById('statusDelivered').disabled = true;
  document.getElementById('statusFailed').disabled = true;
  toggleFailBox(false);
}

//Actions 
function showResult(result) {
  showToast(result.message, result.ok ? 'success' : 'error');
  if (result.ok) renderAll();
}

function changeStatus(newStatus) {
  if (newStatus === 'failed') {
    toggleFailBox(true); //ask for a reason first
    return;
  }
  showResult(updateStatus(state.orders, state.selectedId, newStatus));
}

function confirmFailed() {
  const reason = document.getElementById('failReason').value;
  const message = validateFailReason(reason);
  setError('failReason', message);
  if (message) return;
  showResult(updateStatus(state.orders, state.selectedId, 'failed', reason));
}

function submitIssue(event) {
  event.preventDefault();
  const data = {
    orderId: document.getElementById('issueOrder').value,
    type: document.getElementById('issueType').value,
    description: document.getElementById('issueDescription').value
  };

  const errors = validateIssue(data);
  setError('issueOrder', errors.orderId);
  setError('issueType', errors.type);
  setError('issueDescription', errors.description);
  if (Object.keys(errors).length > 0) return;

  if (editingIssueId) {
    const issue = findIssue(editingIssueId);
    if (!issue) return;
    issue.orderId = data.orderId;
    issue.type = data.type;
    issue.description = data.description.trim();
    showToast('Issue ' + issue.id + ' updated.');
  } else {
    addIssue(state.issues, data);
    showToast('Issue reported for order #' + data.orderId + '.');
  }

  resetIssueForm();
  renderAll();
}

function resetIssueForm() {
  editingIssueId = null;
  document.getElementById('reportForm').reset();
  document.getElementById('issueFormTitle').textContent = 'Report an Issue';
  document.getElementById('issueSubmitBtn').textContent = 'Submit Report';
  document.getElementById('cancelIssueEditBtn').hidden = true;
  setError('issueOrder', '');
  setError('issueType', '');
  setError('issueDescription', '');
}

function editIssue(id) {
  const issue = findIssue(id);
  if (!issue) return;

  editingIssueId = issue.id;
  document.getElementById('issueOrder').value = issue.orderId;
  document.getElementById('issueType').value = issue.type;
  document.getElementById('issueDescription').value = issue.description;
  document.getElementById('issueFormTitle').textContent = 'Edit Issue Report';
  document.getElementById('issueSubmitBtn').textContent = 'Save Changes';
  document.getElementById('cancelIssueEditBtn').hidden = false;
  setError('issueOrder', '');
  setError('issueType', '');
  setError('issueDescription', '');
  showTab('report');
}

function deleteIssue(id) {
  const issue = findIssue(id);
  if (!issue) return;
  if (!window.confirm('Delete issue report ' + issue.id + '?')) return;

  for (let i = 0; i < state.issues.length; i++) {
    if (state.issues[i].id === id) {
      state.issues.splice(i, 1);
      break;
    }
  }

  if (editingIssueId === id) resetIssueForm();
  showToast('Issue report ' + id + ' deleted.');
  renderAll();
}

//Events 
function bindEvents() {
  // Search and filter
  document.getElementById('searchInput').addEventListener('input', e => {
    state.search = e.target.value;
    state.page = 1;
    renderTable();
  });
  document.getElementById('statusFilter').addEventListener('change', e => {
    state.status = e.target.value;
    state.page = 1;
    renderTable();
  });

  //Deliveries table buttons
  document.getElementById('deliveriesBody').addEventListener('click', e => {
    const btn = e.target.closest('button.update-action, button.view-action, button.edit-delivery-action, button.delete-delivery-action');
    if (!btn) return;
    const id = btn.closest('tr').id.replace('deliveryRow-', '');

    if (btn.classList.contains('edit-delivery-action')) {
      openDeliveryForm(id);
    } else if (btn.classList.contains('delete-delivery-action')) {
      deleteDelivery(id);
    } else if (btn.classList.contains('update-action')) {
      state.selectedId = id;
      renderTable();
      renderSelected();
      document.getElementById('updateSection').scrollIntoView({ behavior: 'smooth' });
    } else {
      openDetails(findOrder(id));
    }
  });

  //Pagination
  document.getElementById('pagination').addEventListener('click', e => {
    const btn = e.target.closest('button.page-btn');
    if (!btn) return;
    const value = btn.value;
    state.page = value === 'prev' ? state.page - 1 : value === 'next' ? state.page + 1 : Number(value);
    renderTable();
  });

  //Refresh
  document.getElementById('addDeliveryBtn').addEventListener('click', () => openDeliveryForm(null));
  document.getElementById('refreshBtn').addEventListener('click', () => {
    loadData();
    showToast('Deliveries refreshed.');
  });
  document.getElementById('deliveryForm').addEventListener('submit', saveDelivery);
  document.getElementById('cancelDeliveryBtn').addEventListener('click', () => {
    editingDeliveryId = null;
    document.getElementById('deliveryFormDialog').close();
  });
  for (const fieldId of ['deliveryCustomer', 'deliveryPhone', 'deliveryAddress', 'deliveryCod']) {
    document.getElementById(fieldId).addEventListener('input', () => setError(fieldId, ''));
  }

  //Status buttons
  document.getElementById('statusPickedUp').addEventListener('click', () => changeStatus('picked-up'));
  document.getElementById('statusOutForDelivery').addEventListener('click', () => changeStatus('out-for-delivery'));
  document.getElementById('statusDelivered').addEventListener('click', () => changeStatus('delivered'));
  document.getElementById('statusFailed').addEventListener('click', () => changeStatus('failed'));
  document.getElementById('confirmFailBtn').addEventListener('click', confirmFailed);

  //History
  document.getElementById('historyFilter').addEventListener('change', e => {
    state.historyDays = Number(e.target.value);
    renderHistory(getHistory(state.orders, state.historyDays));
  });
  document.getElementById('historyBody').addEventListener('click', e => {
    const btn = e.target.closest('button.view-action');
    if (btn) openDetails(findOrder(btn.closest('tr').id.replace('historyRow-', '')));
  });
  document.getElementById('issuesBody').addEventListener('click', e => {
    const btn = e.target.closest('button.edit-issue-action, button.delete-issue-action');
    if (!btn) return;
    const id = btn.closest('tr').id.replace('issueRow-', '');
    if (btn.classList.contains('edit-issue-action')) editIssue(id);
    else deleteIssue(id);
  });

  //Tabs and report form
  document.getElementById('historyTab').addEventListener('click', () => showTab('history'));
  document.getElementById('reportTab').addEventListener('click', () => showTab('report'));
  document.getElementById('goReportBtn').addEventListener('click', () => showTab('report'));
  document.getElementById('reportForm').addEventListener('submit', submitIssue);
  document.getElementById('cancelIssueEditBtn').addEventListener('click', resetIssueForm);

  //Clear a field's error as soon as the user fixes it
  ['issueOrder', 'issueType', 'issueDescription', 'failReason'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => setError(id, ''));
  });

  //Sidebar navigation
  const navItems = ['navDeliveries', 'navHistory', 'navReport'];
  function setActiveNav(activeId) {
    for (const id of navItems) {
      document.getElementById(id).classList.toggle('active', id === activeId);
    }
    document.getElementById('sidebar').classList.remove('open');
  }
  document.getElementById('navDeliveries').addEventListener('click', () => setActiveNav('navDeliveries'));
  document.getElementById('navHistory').addEventListener('click', () => {
    setActiveNav('navHistory');
    showTab('history');
  });
  document.getElementById('navReport').addEventListener('click', () => {
    setActiveNav('navReport');
    showTab('report');
  });
  document.getElementById('menuToggle').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));

  //Notifications, dialog, logout
  document.getElementById('notifBtn').addEventListener('click', () => {
    let count = 0;
    for (const order of state.orders) {
      if (isActive(order)) count++;
    }
    showToast('You have ' + count + ' active deliveries.');
  });
  document.getElementById('closeDialog').addEventListener('click', () => document.getElementById('detailsDialog').close());
  document.getElementById('logoutBtn').addEventListener('click', () => {
  alert("You have been logged out.");
    window.location.href = "../LOGIN/HTML/login.html";
  });
}

if (document.getElementById('deliveriesBody')) init();