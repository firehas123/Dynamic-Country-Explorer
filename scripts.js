$(document).ready(function() {
    // Fetch and populate regions in the selection element
    $.ajax({
        url: 'https://www.cs.kent.ac.uk/people/staff/yh/api/country-data/countries/regions',
        method: 'GET',
        success: function(data) {
            // Parse the response data into an object
            let countryData = JSON.parse(data);
            
            // Check if the parsed data is an array and populate the region options
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

    // Event listener for selecting a region
    $('#regionSelect').change(function() {
        let selectedRegion = $('#regionSelect').val();
        if (selectedRegion !== 'none') {
            // Fetch data for the selected region
            $.ajax({
                url: `https://www.cs.kent.ac.uk/people/staff/yh/api/country-data/countries/region/${selectedRegion}`,
                method: 'GET',
                success: function(data) {
                    console.log("Data from the API:", data);
                    console.log("Type of data:", typeof data); // Logging data type

                    // Clear the table before displaying data
                    $('#countryTable').find('tr:gt(0)').remove(); // Clear table

                    // Parse the data retrieved from the API
                    let countryData = JSON.parse(data);

                    if (Array.isArray(countryData)) {
                        let totalCountries = countryData.length;
                        let largestCountry = "";
                        let mostPopulatedCountry = "";
                        let maxArea = 0;
                        let maxPopulation = 0;

                        countryData.forEach(function(country) {
                            // Calculate population density
                            let populationDensity = (country.population / country.area).toFixed(1);

                            // Append to table
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

                            // Region details
                            if (country.area > maxArea) {
                                maxArea = country.area;
                                largestCountry = country.name;
                            }
                            if (country.population > maxPopulation) {
                                maxPopulation = country.population;
                                mostPopulatedCountry = country.name;
                            }
                        });

                        // Display region information
                        $('#totalCountries').text(totalCountries);
                        $('#largestCountry').text(largestCountry);
                        $('#mostPopulatedCountry').text(mostPopulatedCountry);
                    } else {
                        console.error("Data retrieved is not in the expected format");
                    }
                },
                error: function(xhr, status, error) {
                    console.error("Error fetching country data:", error);
                }
            });
        } else {
            // Clear the table when "None" is selected
            $('#countryTable').find('tr:gt(0)').remove();
            $('#totalCountries').text('');
            $('#largestCountry').text('');
            $('#mostPopulatedCountry').text('');
            console.log("No region selected. Table cleared.");
        }
    });

    // Search button click event
    $('#searchButton').click(function() {
        let searchInput = $('#searchInput').val().toLowerCase(); // Retrieve the search input, convert to lowercase

        if (searchInput) {
            // If a search string is provided, filter the displayed countries
            $('#countryTable tr').each(function() {
                // For each row in the table, check country and capital names (case insensitive)
                let countryName = $(this).find('td:nth-child(3)').text().toLowerCase();
                let capitalName = $(this).find('td:nth-child(4)').text().toLowerCase();

                // Show/hide rows based on search input match
                if (countryName.includes(searchInput) || capitalName.includes(searchInput)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        } else {
            // If search string is empty, display all rows
            $('#countryTable tr').show();
        }
    });
});
