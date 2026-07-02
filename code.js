$(document).ready(function () {
    $("input").on("input", function () {
        let value = $(this).val();
        let sanitizedValue = value.replace(/[^0-9.]/g, '');
        let parts = sanitizedValue.split('.');
        if (parts.length > 2) { // If more than one dot
            sanitizedValue = parts[0] + '.' + parts.slice(1).join(''); // Reconstruct with only one dot
        }

        $(this).val(sanitizedValue);
    })
    // --- THEME SWITCHER LOGIC ---
    const themeToggle = $('#theme-toggle');
    const themeIcon = $('#theme-icon');
    const htmlEl = $('html');

    // Function to set the theme
    const setTheme = (theme) => {
        if (theme === 'dark') {
            htmlEl.attr('data-bs-theme', 'dark');
            themeIcon.removeClass('bi-moon-stars-fill').addClass('bi-sun-fill');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlEl.attr('data-bs-theme', 'light');
            themeIcon.removeClass('bi-sun-fill').addClass('bi-moon-stars-fill');
            localStorage.setItem('theme', 'light');
        }
    };

    // Check for saved theme in localStorage or use system preference
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);

    // Event listener for the theme toggle button
    themeToggle.on('click', function () {
        const currentTheme = htmlEl.attr('data-bs-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });


    // --- CALCULATOR LOGIC ---
    function calculateBill() {
        // Previous amount
        const prev_electric_usage = parseFloat($('#previous_electric_usage').val()) || 0;
        const prev_water_usage = parseFloat($('#previous_water_usage').val()) || 0;

        // Current amount
        const current_electric_usage = parseFloat($('#current_electric_usage').val()) || 0;
        const current_water_usage = parseFloat($('#current_water_usage').val()) || 0;

        const electricityUsage = current_electric_usage - prev_electric_usage;
        const waterUsage = current_water_usage - prev_water_usage;

        $("#total_electric_usage").val(parseFloat(electricityUsage).toFixed(2));
        $("#total_water_usage").val(parseFloat(waterUsage).toFixed(2));

        const electricityRate = parseFloat($("#electric-reading").val());
        const waterRate1 = parseFloat($("#water-reading").val());
        const waterRate2 = parseFloat($("#water-borne-tax").val());
        const waterMultiplier = parseFloat($("#water-conservation-tax").val()); // 50%
        const gstRate = 0.09; // 9%

        const electricityCost = electricityUsage * electricityRate;
        const electric_gst = electricityCost * gstRate;

        const water_reading_cost = (waterUsage * waterRate1);
        const water_borneTax = (waterUsage * waterRate2);
        const water_conservationTax = water_reading_cost * waterMultiplier;
        const waterTotal = water_reading_cost + water_borneTax + water_conservationTax;
        const waterTotal_GST = waterTotal * gstRate;

        const finalTotal = (electricityCost + waterTotal) * (1 + gstRate);

        $('#electricity-cost').text('$' + electricityCost.toFixed(2));
        $('#water-cost').text('$' + waterTotal.toFixed(2));
        $('#electricity-total-gst').text('$' + electric_gst.toFixed(2));
        $('#water-total-gst').text('$' + waterTotal_GST.toFixed(2));
        $('#final-total').text('$' + finalTotal.toFixed(2));
    }

    // Recalculate when the input fields change
    $('input').on('input', calculateBill);

    // Initial calculation on page load
    calculateBill();
});