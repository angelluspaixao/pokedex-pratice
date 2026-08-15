const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
const pokemonData = document.querySelector('.pokemon__data');
const title = document.querySelector('.title');
const MAXPOKEMON = 649;
const initialPokemon = Math.floor(Math.random() * (MAXPOKEMON)) + 1;
const pokeballStyles = ['pokeball', 'masterball', 'greatball', 'ultraball'];
let searchPokemonId = initialPokemon;
let currentSprite = 0;
let lastRenderedData = null;

const applyRandomTitlePalette = () => {
    if (!title) return;

    const randomStyle = pokeballStyles[Math.floor(Math.random() * pokeballStyles.length)];
    title.classList.remove('pokeball', 'masterball', 'greatball', 'ultraball');
    title.classList.add(randomStyle);
};

const fetchPokemon = async (pokemon) => {
    if (typeof pokemon === 'string') pokemon = pokemon.toLowerCase();
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

    if (APIResponse.status === 200) {
        const data = await APIResponse.json();
        return data
    }
}

const fitPokemonData = () => {
    if (!pokemonData) return;

    let fontSize = 24;
    pokemonData.style.fontSize = `${fontSize}px`;

    while (pokemonData.scrollWidth > pokemonData.clientWidth && fontSize > 10) {
        fontSize -= 1;
        pokemonData.style.fontSize = `${fontSize}px`;
    }
};

const renderPokemon = async (pokemon) => {
    renderLoading();

    data = await fetchPokemon(pokemon);

    if (data && data.id <= MAXPOKEMON) {
        lastRenderedData = data;
        currentSprite = 0;
        searchPokemonId = data.id;
        input.value = '';
        renderPokemonData(data.sprites.versions['generation-v']['black-white'].animated.front_default);
    } else {
        renderNotFound()
    }
}

const renderLoading = () => {
    pokemonName.innerHTML = 'Loading...';
    pokemonNumber.innerHTML = '';
    pokemonImage.src = `https://i.imgur.com/sRqDtqD.gif`;
    fitPokemonData();
}

const renderNotFound = () => {
    pokemonName.innerHTML = 'Pokémon not found';
    pokemonNumber.innerHTML = '';
    pokemonImage.style.display = 'none';
    fitPokemonData();
}

const renderPokemonData = (imageSrc) => {
    pokemonNumber.innerHTML = data.id + ' -';
    pokemonName.innerHTML = data.name;
    pokemonImage.style.display = 'block';
    pokemonImage.src = imageSrc || data.sprites.versions['generation-v']['black-white'].animated.front_default;
    fitPokemonData();
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value);
})

buttonPrev.addEventListener('click', () => {
    if (searchPokemonId > 1) searchPokemonId--;
    renderPokemon(searchPokemonId);
});

buttonNext.addEventListener('click', () => {
    if (searchPokemonId < MAXPOKEMON) searchPokemonId++
    renderPokemon(searchPokemonId)
});

pokemonImage.addEventListener('click', () => {
    renderLoading();
    if (!lastRenderedData) return;
    if (currentSprite === 0) {
        currentSprite = 1;
        renderPokemonData(lastRenderedData.sprites.versions['generation-v']['black-white'].animated.back_default);
    } else {
        currentSprite = 0;
        renderPokemonData(lastRenderedData.sprites.versions['generation-v']['black-white'].animated.front_default);
    }
});

applyRandomTitlePalette();
renderPokemon(searchPokemonId);