$(document).ready(function() {
    const sessions = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
    const maxDaysToBook = 7;
    const seatCount = 30;

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function getStoredData() {
        const data = localStorage.getItem('cinemaData');
        return data ? JSON.parse(data) : {};
    }

    function storeData(data) {
        localStorage.setItem('cinemaData', JSON.stringify(data));
    }

    function generateDates() {
        const today = new Date();
        const dates = [];

        for (let i = -maxDaysToBook; i <= maxDaysToBook; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            dates.push(formatDate(date));
        }

        return dates;
    }

    function loadSessions(date) {
        $('#session-list').empty();

        const today = new Date();
        const selectedDate = new Date(date);
        const isPast = selectedDate < today || (selectedDate.toDateString() === today.toDateString() && today.getHours() >= 20);

        sessions.forEach(time => {
            const sessionButton = $('<button>').text(time);
            if (isPast) {
                sessionButton.addClass('archived');
            } else {
                sessionButton.click(() => loadSeats(date, time));
            }
            $('#session-list').append(sessionButton);
        });
    }

    function loadSeats(date, time) {
        $('#seats-list').empty();
        const data = getStoredData();
        const sessionKey = `${date}_${time}`;
        const seats = data[sessionKey] || Array(seatCount).fill(false);

        seats.forEach((isBooked, index) => {
            const seat = $('<div>').addClass('seat').text(index + 1);
            if (isBooked) {
                seat.addClass('booked');
            } else {
                seat.click(() => {
                    seats[index] = !isBooked;
                    data[sessionKey] = seats;
                    storeData(data);
                    loadSeats(date, time);
                });
            }
            $('#seats-list').append(seat);
        });
    }

    $('#date').attr('min', formatDate(new Date(Date.now() - maxDaysToBook * 24 * 60 * 60 * 1000)));
    $('#date').attr('max', formatDate(new Date(Date.now() + maxDaysToBook * 24 * 60 * 60 * 1000)));

    $('#date').change(function() {
        const selectedDate = $(this).val();
        loadSessions(selectedDate);
    });

    // Load default date
    $('#date').val(formatDate(new Date()));
    loadSessions($('#date').val());
});