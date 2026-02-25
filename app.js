import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    orderBy, 
    updateDoc, 
    deleteDoc, 
    doc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const ticketInput = document.getElementById('ticketInput');
const addBtn = document.getElementById('addBtn');
const ticketList = document.getElementById('ticketList');
const ticketCounter = document.getElementById('ticketCounter');
const ticketsCol = collection(db, "tickets");

// Create Ticket
addBtn.addEventListener('click', async () => {
    const text = ticketInput.value.trim();
    if (text) {
        try {
            await addDoc(ticketsCol, {
                text: text,
                isCompleted: false,
                createdAt: Date.now()
            });
            ticketInput.value = '';
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error adding ticket. Check console for details.");
        }
    }
});

ticketInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBtn.click();
});

// Real-time listener
const q = query(ticketsCol, orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
    renderTickets(snapshot);
});

// Render all tickets and attach logic
function renderTickets(snapshot) {
    const ticketCount = snapshot.size;
    ticketCounter.innerHTML = `Total Tickets: <span class="font-bold text-yellow-400">${ticketCount}</span>`;

    if (snapshot.empty) {
        ticketList.innerHTML = '<tr id="no-tickets-row"><td colspan="2">No tickets found. Add one above!</td></tr>';
        return;
    }
    
    ticketList.innerHTML = '';
    snapshot.forEach((docSnap) => {
        const ticket = docSnap.data();
        const id = docSnap.id;
        
        const tr = document.createElement('tr');
        tr.className = `border-b border-gray-200 transition-all ${ticket.isCompleted ? 'completed' : ''}`;
        
        tr.innerHTML = `
            <td class="px-4 py-3">
                <span class="font-medium">${ticket.text}</span>
            </td>
            <td class="px-4 py-3">
                <div class="flex gap-3">
                    <button class="action-btn check-btn" title="${ticket.isCompleted ? 'Undo' : 'Complete'}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                    <button class="action-btn delete-btn" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </td>
        `;

        // Check/Toggle Logic
        tr.querySelector('.check-btn').addEventListener('click', async () => {
            try {
                const ticketRef = doc(db, "tickets", id);
                await updateDoc(ticketRef, {
                    isCompleted: !ticket.isCompleted
                });
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        });

        // Delete Logic
        tr.querySelector('.delete-btn').addEventListener('click', async () => {
            if (confirm("Are you sure you want to delete this ticket?")) {
                try {
                    const ticketRef = doc(db, "tickets", id);
                    await deleteDoc(ticketRef);
                } catch (error) {
                    console.error("Error deleting document: ", error);
                }
            }
        });

        ticketList.appendChild(tr);
    });
}