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
let isShiny = false;
let lastRenderedData = null;
let data;

const applyRandomTitlePalette = () => {
    if (!title) return;

    const randomStyle = pokeballStyles[Math.floor(Math.random() * pokeballStyles.length)];
    title.classList.remove('pokeball', 'masterball', 'greatball', 'ultraball');
    title.classList.add(randomStyle);
};

const fetchPokemon = async (pokemon) => {
    if (typeof pokemon === 'string') pokemon = pokemon.toLowerCase();

    try {
        const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

        if (!APIResponse.ok) {
            return null;
        }

        return await APIResponse.json();
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        return null;
    }
};

const getSpriteCandidates = (pokemonData, { shiny = false, back = false } = {}) => {
    const sprites = pokemonData?.sprites;
    if (!sprites) return [];

    const options = [
        sprites?.versions?.['generation-v']?.['black-white']?.animated?.[back ? (shiny ? 'back_shiny' : 'back_default') : (shiny ? 'front_shiny' : 'front_default')],
        sprites?.versions?.['generation-v']?.['black-white']?.[back ? (shiny ? 'back_shiny' : 'back_default') : (shiny ? 'front_shiny' : 'front_default')],
        sprites?.[back ? (shiny ? 'back_shiny' : 'back_default') : (shiny ? 'front_shiny' : 'front_default')],
        sprites?.other?.['official-artwork']?.[shiny ? 'front_shiny' : 'front_default'],
        sprites?.other?.dream_world?.[shiny ? 'front_shiny' : 'front_default'],
        sprites?.other?.home?.[shiny ? 'front_shiny' : 'front_default'],
    ];

    const uniqueOptions = [...new Set(options.filter(Boolean))];
    return uniqueOptions;
};

const getCurrentSpriteSource = () => {
    if (!lastRenderedData) return null;

    const spriteOptions = getSpriteCandidates(lastRenderedData, {
        shiny: isShiny,
        back: currentSprite === 1,
    });

    return spriteOptions[0] || null;
};

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

    if (data && Number(data.id) <= MAXPOKEMON) {
        lastRenderedData = data;
        currentSprite = 0;
        isShiny = false;
        searchPokemonId = Number(data.id);
        input.value = '';
        renderPokemonData(getCurrentSpriteSource());
    } else {
        renderNotFound();
    }
};

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
    if (!data) return;

    const pokemonId = Number(data.id) || '';
    const pokemonNameValue = data.name || 'Pokémon';
    const fallbackSprite = getSpriteCandidates(data, { shiny: isShiny, back: currentSprite === 1 })[0];

    pokemonNumber.innerHTML = pokemonId ? `${pokemonId} -` : '';
    pokemonName.innerHTML = pokemonNameValue;
    pokemonImage.style.display = 'block';
    pokemonImage.src = imageSrc || fallbackSprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
    fitPokemonData();
};

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

pokemonImage.addEventListener('click', (event) => {
    if (!lastRenderedData) return;

    if (event.shiftKey) {
        isShiny = !isShiny;
        renderPokemonData(getCurrentSpriteSource());
        return;
    }

    currentSprite = currentSprite === 0 ? 1 : 0;
    renderPokemonData(getCurrentSpriteSource());
});

applyRandomTitlePalette();
renderPokemon(searchPokemonId);