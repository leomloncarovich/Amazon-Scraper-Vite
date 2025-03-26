// Add an event listener to the search button
document.getElementById('searchButton').addEventListener('click', async () => {

    // Gets the value entered in the search field.(.trim() is used to remove extra spaces)
    const keyword = document.getElementById('keywordInput').value.trim();

    // If the search field is empty, display an alert and stop execution
    if (!keyword) {
        alert('Please enter a keyword!');
        return;
  }
    // Displays a loading message while fetching results
    document.getElementById('results').innerHTML = `
        <div class="fixed inset-0 flex justify-center items-center">
            <div class="flex flex-col items-center">
                <svg class="animate-spin h-10 w-10 text-gray-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <p class="text-lg font-semibold text-blue-600 animate-pulse">Loading...</p>
            </div>
        </div>
    `;

  
    try {
        // Make an HTTP request to the API that will scrape the products
        const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);

        // Converts the request response to JSON
        const data = await response.json();

        // Checks if the response contains no products or if the product list is empty
        if (!data.products || data.products.length === 0) {
            document.getElementById('results').innerHTML = '<p>No products found!</p>';
            return;
      }
        // Gets the element where the results will be displayed
        const resultsContainer = document.getElementById('results');

        // Clears previous results
        resultsContainer.innerHTML = '';
      
        // Iterates over the products returned by the API and creates a card for each one
        data.products.forEach(product => {
            // Create a new 'div' element for the product card and add the style classes
            const productCard = document.createElement('div');
            productCard.classList.add(
                'product', 
                'border', 
                'rounded-lg', 
                'shadow-md', 
                'p-4', 
                'mb-4', 
                'hover:shadow-lg', 
                'transition', 
                'duration-200', 
                'ease-in-out',
                'flex',
                'flex-col',
                'sm:flex-row',
                'items-center',
                'sm:items-start'
              );
            
            const ratingMatch = product.rating ? product.rating.match(/([\d.]+) out of 5 stars/) : null;
            const ratingValue = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

            console.log(`Product Rating: ${ratingValue}`);

            // Function to generate stars according to the rating
            function generateStars(rating) {
                const maxStars = 5;
                let starsHTML = '';

                // Calculate the number of full, medium and empty stars
                for (let i = 1; i <= maxStars; i++) {
                    if (rating >= i) {
                        // full star
                        starsHTML += `
                          <svg class="w-6 h-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.83 6.21L22 9.27l-5 4.73L18.7 22 12 18.26 5.3 22l1.7-8-5-4.73 7.17-1.06L12 2z"/>
                          </svg>
                        `;
                    } else if (rating >= (i - 1) + 0.3 && rating < (i - 1) + 0.8) {
                        // Half full star (for values ​​from 0.3 to 0.8)
                        starsHTML += `
                            <svg class="w-6 h-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <!-- Estrela de fundo (vazia) -->
                                <path d="M12 2l2.83 6.21L22 9.27l-5 4.73L18.7 22 12 18.26 5.3 22l1.7-8-5-4.73 7.17-1.06L12 2z" class="text-gray-300" />
                                
                                <!-- Estrela de sobreposição (metade preenchida) -->
                                <path d="M12 2l2.83 6.21L22 9.27l-5 4.73L18.7 22 12 18.26 5.3 22l1.7-8-5-4.73 7.17-1.06L12 2z" fill="currentColor" clip-path="inset(0 50% 0 0)" />
                            </svg>
                        `;
                    } else if (rating >= (i - 1) + 0.8) {
                        // Full star (for values ​​of 0.8 or greater)
                        starsHTML += `
                          <svg class="w-6 h-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.83 6.21L22 9.27l-5 4.73L18.7 22 12 18.26 5.3 22l1.7-8-5-4.73 7.17-1.06L12 2z"/>
                          </svg>
                        `;
                    } else {
                        // empty star
                        starsHTML += `
                          <svg class="w-6 h-6 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.83 6.21L22 9.27l-5 4.73L18.7 22 12 18.26 5.3 22l1.7-8-5-4.73 7.17-1.06L12 2z"/>
                          </svg>
                        `;
                    }
                }
                return starsHTML;
            }
            // Sets the title size and renders only 50 letters
            const truncatedTitle = product.title.length > 50 ? product.title.slice(0, 50) + '...' : product.title;
            // Defines the HTML content of the product card, including title, image, information, and link
            productCard.innerHTML = `
                    <img 
                        class="w-32 h-32 object-contain mb-4 sm:mb-0 sm:mr-4" 
                        src="${product.image}" 
                        alt="${product.title}"
                    />
                    <div class="flex flex-col sm:flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2 break-words">${truncatedTitle}</h3>
                        <div class="flex mb-2">${generateStars(ratingValue)}</div>
                        <p class="text-gray-600 text-sm mb-2">${product.rating || 'N/A'}</p>
                        <p class="text-gray-600 text-sm mb-2">Reviews: ${product.reviews || 'N/A'}</p>
                        <a
                            href="https://www.amazon.com${product.link}" 
                            class="text-blue-600 hover:text-blue-800 text-sm font-medium" 
                            target="_blank"
                        >
                        View on Amazon
                        </a>
                    </div>
            `;
            // Add the product card to the results container
            resultsContainer.appendChild(productCard);
      });
  } catch (error) {
        // If an error occurs during the request, display an error message
        console.error('Error fetching products:', error);
        document.getElementById('results').innerHTML = '<p>An error occurred. Please try again later.</p>';
  }
});