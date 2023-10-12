const SUPABASE_URL = 'https://kpgtveetxxemulgdwvkj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZ3R2ZWV0eHhlbXVsZ2R3dmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMyNTQxMDcsImV4cCI6MjAwODgzMDEwN30.rrjlztQpV6ZM5XYLbcgBN5TjdoUS2JUX7z-EVq6UO_Q';

const EVENT_ID = '6'; // Replace with your static event_id

const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
};
function animateValue(id, start, end, duration) {
    let obj = document.getElementById(id);
    let range = end - start;
    let minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    let startTime = new Date().getTime();
    let endTime = startTime + duration;
    let timer;

    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = Math.round(end - (remaining * range));
        obj.textContent = value;
        if (value == end) {
            clearInterval(timer);
        }
    }

    timer = setInterval(run, stepTime);
    run();
}

document.addEventListener("DOMContentLoaded", function() {

    let participantCount = 0;
    let checkoutCount = 0;

    // Initialize values to 0
    document.getElementById('participantInfo').textContent = '0';
    document.getElementById('levelCount').textContent = '0';

    function fetchData() {
        console.log("Refreshing data...");
        getParticipantInfo();
        getCheckoutCount();
    }

    async function getParticipantInfo() {
        try {
            let response = await fetch(`${SUPABASE_URL}/rest/v1/participant?select=count&event_id=eq.${EVENT_ID}`, { headers: headers });
            let data = await response.json();
            if (data && data[0].count > 0) {
                animateValue('participantInfo', participantCount, data[0].count, 1000);
                participantCount = data[0].count;
                console.log(`Participant count updated to: ${participantCount}`);
            }
        } catch (error) {
            console.error("Error fetching participant info:", error);
        }
    }

    async function getCheckoutCount() {
        try {
            let response = await fetch(`${SUPABASE_URL}/rest/v1/checkout?select=count&event_id=eq.${EVENT_ID}`, { headers: headers });
            let data = await response.json();
            if (data && data[0].count) {
                animateValue('levelCount', checkoutCount, data[0].count, 1000);
                checkoutCount = data[0].count;
                console.log(`Checkout count updated to: ${checkoutCount}`);
            }
        } catch (error) {
            console.error("Error fetching checkout info:", error);
        }
    }

    fetchData();

    setInterval(fetchData, 5000);
});