const token = localStorage.getItem('crm_token');
if (!token) window.location.href = '/';

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('crm_token');
    window.location.href = '/';
});

async function fetchCustomers() {
    try {
        const res = await fetch('/api/customers', { headers });
        if (res.status === 401) {
            localStorage.removeItem('crm_token');
            window.location.href = '/';
            return;
        }
        const customers = await res.json();
        renderCustomers(customers);
    } catch (err) {
        console.error('Error fetching customers:', err);
    }
}

function renderCustomers(customers) {
    const tbody = document.getElementById('customer-list');
    tbody.innerHTML = '';
    customers.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${c.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${c.email}</div>
                <div class="text-sm text-gray-500">${c.phone || 'N/A'}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${c.company || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.status === 'Active' ? 'bg-green-100 text-green-800' : c.status === 'Lead' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}">
                    ${c.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="deleteCustomer(${c.id})" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('add-customer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        name: document.getElementById('c-name').value,
        email: document.getElementById('c-email').value,
        phone: document.getElementById('c-phone').value,
        company: document.getElementById('c-company').value,
        status: document.getElementById('c-status').value
    };

    try {
        const res = await fetch('/api/customers', {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            document.getElementById('add-modal').classList.add('hidden');
            document.getElementById('add-customer-form').reset();
            fetchCustomers();
        }
    } catch (err) {
        console.error('Error adding customer:', err);
    }
});

async function deleteCustomer(id) {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
        const res = await fetch(`/api/customers/${id}`, { method: 'DELETE', headers });
        if (res.ok) fetchCustomers();
    } catch (err) {
        console.error('Error deleting customer:', err);
    }
}

fetchCustomers();
