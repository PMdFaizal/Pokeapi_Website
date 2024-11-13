const pokemonContainer = document.getElementById('pokemon-container');
const loadingElement = document.getElementById('loading');

const limit = 20;  // Set a fixed number of Pokémon to fetch
let offset = 0;  // Keeps track of the starting index
let isLoading = false;

// Fetch Pokémon data from PokeAPI
async function fetchPokemons(limit, offset) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        return data.results;  // Returns an array of Pokémon
    } catch (error) {
        console.error('Failed to fetch Pokémon:', error);
    }
}

// Render Pokémon cards
async function renderPokemonCards(limit) {
    if (isLoading) return;
    isLoading = true;
    loadingElement.style.display = 'block';

    const pokemons = await fetchPokemons(limit, offset);
    offset += limit;  // Increment offset for future fetches if needed

    for (let pokemon of pokemons) {
        const pokemonData = await fetch(pokemon.url).then(res => res.json());

        // Create card element
        const card = document.createElement('div');
        card.classList.add('card');

        // Set card content
        card.innerHTML = `
            <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
            <h3>${pokemonData.name.toUpperCase()}</h3>
            <p>Height: ${pokemonData.height}</p>
            <p>Weight: ${pokemonData.weight}</p>
        `;

        // Append card to container
        pokemonContainer.appendChild(card);
    }

    loadingElement.style.display = 'none';
    isLoading = false;
}

// Automatically fetch 20 Pokémon on page load
window.addEventListener('load', () => {
    renderPokemonCards(limit);
});
// Infinite scroll event listener
window.addEventListener('scroll', () => {
    const limit = 20; // Number of Pokémon to fetch each time

    // Check if the user has scrolled near the bottom of the page
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 500 && !isLoading) {
        renderPokemonCards(limit);
    }
});

