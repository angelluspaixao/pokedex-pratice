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
let currentSpecies = null;
let currentFormIndex = 0;

const applyRandomTitlePalette = () => {
    if (!title) return;

    const randomStyle = pokeballStyles[Math.floor(Math.random() * pokeballStyles.length)];
    title.classList.remove('pokeball', 'masterball', 'greatball', 'ultraball');
    title.classList.add(randomStyle);
};

const normalizePokemonQuery = (pokemon) => {
    if (pokemon === null || pokemon === undefined) return '';
    return String(pokemon).trim().toLowerCase();
};

const isAllowedPokemonId = (id) => {
    const numericId = Number(id);
    return Number.isFinite(numericId) && numericId >= 1 && numericId <= MAXPOKEMON;
};

const fetchPokemon = async (pokemon) => {
    const query = normalizePokemonQuery(pokemon);
    if (!query) return null;

    try {
        const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);

        if (!APIResponse.ok) {
            return null;
        }

        return await APIResponse.json();
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        return null;
    }
};

const fetchPokemonSpecies = async (pokemon) => {
    const query = normalizePokemonQuery(pokemon);
    if (!query) return null;

    try {
        const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${query}`);

        if (!APIResponse.ok) {
            return null;
        }

        return await APIResponse.json();
    } catch (error) {
        console.error('Error fetching Pokémon species:', error);
        return null;
    }
};

const resolvePokemonByQuery = async (pokemon) => {
    const query = normalizePokemonQuery(pokemon);
    if (!query) return null;

    const directPokemon = await fetchPokemon(query);
    if (directPokemon) {
        return {
            pokemon: directPokemon,
            species: await fetchPokemonSpecies(directPokemon.name),
        };
    }

    const species = await fetchPokemonSpecies(query);
    if (!species) return null;

    const defaultForm = species.varieties?.find((variation) => variation.is_default)?.pokemon?.name;
    const fallbackForm = species.varieties?.[0]?.pokemon?.name;
    const formName = defaultForm || fallbackForm;

    if (!formName) {
        return {
            pokemon: null,
            species,
        };
    }

    const pokemonData = await fetchPokemon(formName);
    return {
        pokemon: pokemonData,
        species,
    };
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

const applyPokemonDetails = (pokemonPayload, speciesPayload = null) => {
    if (!pokemonPayload) {
        renderNotFound();
        return false;
    }

    const baseSpeciesId = Number(speciesPayload?.id) || Number(pokemonPayload.id) || searchPokemonId;
    if (!isAllowedPokemonId(baseSpeciesId)) {
        renderNotFound();
        return false;
    }

    const speciesVarieties = speciesPayload?.varieties || [];
    const forms = speciesVarieties.map((variation) => variation.pokemon?.name).filter(Boolean);

    currentSpecies = speciesPayload || null;
    currentFormIndex = forms.length ? forms.indexOf(pokemonPayload.name) : 0;

    if (currentFormIndex < 0) {
        currentFormIndex = 0;
    }

    data = pokemonPayload;
    lastRenderedData = pokemonPayload;
    currentSprite = 0;
    isShiny = false;
    searchPokemonId = baseSpeciesId;
    input.value = '';
    renderPokemonData(getCurrentSpriteSource());
    return true;
};

const renderPokemon = async (pokemon) => {
    renderLoading();

    const resolvedPokemon = await resolvePokemonByQuery(pokemon);
    if (!resolvedPokemon) {
        renderNotFound();
        return;
    }

    const candidateId = Number(resolvedPokemon.species?.id) || Number(resolvedPokemon.pokemon?.id);
    if (!isAllowedPokemonId(candidateId)) {
        renderNotFound();
        return;
    }

    if (applyPokemonDetails(resolvedPokemon.pokemon, resolvedPokemon.species)) {
        return;
    }

    renderNotFound();
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
    pokemonImage.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
    fitPokemonData();
}

const renderPokemonData = (imageSrc) => {
    if (!data) return;

    const pokemonId = Number(searchPokemonId) || Number(data.id) || '';
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

const renderPokemonForm = async (formIndex) => {
    if (!currentSpecies?.varieties?.length) return;

    const forms = currentSpecies.varieties.map((variation) => variation.pokemon?.name).filter(Boolean);
    if (!forms.length) return;

    const normalizedIndex = (formIndex + forms.length) % forms.length;
    const selectedForm = forms[normalizedIndex];

    if (!selectedForm) return;

    renderLoading();
    const variantData = await fetchPokemon(selectedForm);
    if (!variantData) return;

    applyPokemonDetails(variantData, currentSpecies);
};

pokemonImage.addEventListener('click', async (event) => {
    if (!lastRenderedData) return;

    if (event.altKey) {
        if (!currentSpecies?.varieties?.length || currentSpecies.varieties.length <= 1) return;

        const forms = currentSpecies.varieties.map((variation) => variation.pokemon?.name).filter(Boolean);
        const currentIndex = forms.findIndex((formName) => formName === lastRenderedData?.name);
        const nextIndex = currentIndex >= 0 ? currentIndex + 1 : 0;

        await renderPokemonForm(nextIndex);
        return;
    }

    if (event.shiftKey) {
        renderLoading();
        isShiny = !isShiny;
        renderPokemonData(getCurrentSpriteSource());
        return;
    }

    renderLoading();
    currentSprite = currentSprite === 0 ? 1 : 0;
    renderPokemonData(getCurrentSpriteSource());
});

applyRandomTitlePalette();
renderPokemon(searchPokemonId);