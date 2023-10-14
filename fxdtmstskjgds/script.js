const SUPABASE_URL = 'https://kpgtveetxxemulgdwvkj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZ3R2ZWV0eHhlbXVsZ2R3dmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTcyMDU4OTUsImV4cCI6MjAxMjc4MTg5NX0.4icDk-c1rH7SpH2SUpgkDOab5PhyiN0zuqskSzcH-mU';

const EVENT_ID = '7'; // Replace with your static event_id
const staticParticipantCount = 9867;

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

document.addEventListener("DOMContentLoaded", function () {

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

    function getParticipantInfo() {
        try {
            animateValue('participantInfo', participantCount, staticParticipantCount, 1000);
            participantCount = staticParticipantCount;
            console.log(`Participant count (static): ${participantCount}`);
        } catch (error) {
            console.error("Error setting static participant info:", error);
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

    setInterval(fetchData, 1000);
});

function updateTimer() {
    // Convert "YYYY-MM-DD HH:MM:SS AM/PM" to a Date object
    function createDate(y, m, d, hour, min, sec, meridian) {
        if (meridian.toLowerCase() === 'pm' && hour !== 12) {
            hour += 12;
        } else if (meridian.toLowerCase() === 'am' && hour === 12) {
            hour = 0;
        }
        return new Date(y, m - 1, d, hour, min, sec);
    }

    const startTime = createDate(2023, 10, 14, 10, 0, 0, 'AM');
    const endTime = createDate(2023, 10, 15, 7, 0, 0, 'PM');
    let now = new Date();

    let timeDifference;

    if (now < startTime) {
        timeDifference = startTime - now;
        displayTime("REPC Kickoff In:", timeDifference);
    } else if (now >= startTime && now < endTime) {
        timeDifference = endTime - now;
        displayTime("", timeDifference);
    } else {
        // If the event is over
        document.getElementById('liveClock').textContent = "REPC ENDED";
    }
}

function displayTime(prefix, timeDifference) {
    let hours = Math.floor(timeDifference / (1000 * 60 * 60));
    timeDifference -= hours * (1000 * 60 * 60);

    let minutes = Math.floor(timeDifference / (1000 * 60));
    timeDifference -= minutes * (1000 * 60);

    let seconds = Math.floor(timeDifference / 1000);

    document.getElementById('liveClock').textContent = `${prefix} ${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;
}



setInterval(updateTimer, 1000); // Update the timer every second
updateTimer(); // Call immediately to set the time without waiting for the first second