$(document).ready(function() {
    // Fetch and populate regions in the selection element
    $.ajax({
        url: 'https://www.cs.kent.ac.uk/people/staff/yh/api/country-data/countries/regions',
        method: 'GET',
        success: function(data) {
            console.log("Data from API (string):", data); // Log the actual data returned from the API

            // Parse the response data into an object
            let countryData = JSON.parse(data);

            if (Array.isArray(countryData)) {
                countryData.forEach(function(region) {
                    $('#regionSelect').append(`<option value="${region}">${region}</option>`);
                });
            } else {
                console.error("Error: Parsed data is not an array");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error fetching regions:", error);
        }
    });

    // Handle search functionality
    $('#searchButton').click(function() {
        let selectedRegion = $('#regionSelect').val();
        let searchInput = $('#searchInput').val().toLowerCase();

        // Fetch data for the selected region
        $.ajax({
            url: `https://www.cs.kent.ac.uk/people/staff/yh/api/country-data/countries/region/${selectedRegion}`,
            method: 'GET',
            success: function(data) {
                console.log("Data for selected region:", data); // Log the retrieved data

                // Clear the table before displaying search results
                $('#countryTable').find('tr:gt(0)').remove();

                let totalCountries = data.length;
                let largestCountry = data.reduce((prev, current) => (prev.area > current.area) ? prev : current).name;
                let mostPopulatedCountry = data.reduce((prev, current) => (prev.population > current.population) ? prev : current).name;

                // Display region information
                $('#totalCountries').text(totalCountries);
                $('#largestCountry').text(largestCountry);
                $('#mostPopulatedCountry').text(mostPopulatedCountry);

                data.forEach(function(country) {
                    // Calculate population density
                    let populationDensity = (country.population / country.area).toFixed(1);
                    $('#countryTable').append(
                        `<tr>
                            <td>${country.code}</td>
                            <td><img src="${country.flag}" width="30" height="20"></td>
                            <td>${country.name}</td>
                            <td>${country.capital}</td>
                            <td>${country.population}</td>
                            <td>${country.area}</td>
                            <td>${populationDensity}</td>
                        </tr>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error("Error fetching country data:", error);
            }
        });
    });
});
