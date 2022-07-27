//import loading from '../images/loading.gif';

const MAXPOKEMON = 650;
const initialPokemon = Math.floor(Math.random() * (649 - 1 + 1)) + 1;
let searchPokemon = initialPokemon;
let currentSprite = 0;

const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

const fetchPokemon = async (pokemon) => {
    if (typeof pokemon === 'string') pokemon = pokemon.toLowerCase();
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

    if (APIResponse.status === 200) {
        const data = await APIResponse.json();
        return data
    }
}

const renderPokemon = async (pokemon) => {
    renderLoading();

    data = await fetchPokemon(pokemon);

    if (data && data.id < MAXPOKEMON) {
        pokemonNumber.innerHTML = data.id + ' -';
        pokemonName.innerHTML = data.name;
        pokemonImage.style.display = 'block';
        pokemonImage.src = data.sprites.versions['generation-v']['black-white'].animated.front_default;
        currentSprite = 0;

        searchPokemon = data.id;
        input.value = '';
    } else {
        renderNotFound()
    }
}

const renderLoading = () => {
    pokemonName.innerHTML = 'Loading...';
    pokemonNumber.innerHTML = '';
    pokemonImage.src = '../images/loading.gif';
}

const renderNotFound = () => {
    pokemonName.innerHTML = 'Pokémon not found'
    pokemonNumber.innerHTML = '';
    pokemonImage.style.display = 'none'
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value);
})

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) searchPokemon--;
    renderPokemon(searchPokemon);
});

buttonNext.addEventListener('click', () => {
    if (searchPokemon < MAXPOKEMON - 1) searchPokemon++
    renderPokemon(searchPokemon)
});

pokemonImage.addEventListener('click', () => {
    //TO-DO: Mudar sprites usando .includes() para verificar sprite atual
    //if([pokemonImage.src].includes())
    if(currentSprite === 0) {
        currentSprite = 1;
        pokemonImage.src = data.sprites.versions['generation-v']['black-white'].animated.back_default;
    } else {
        currentSprite = 0;
        pokemonImage.src = data.sprites.versions['generation-v']['black-white'].animated.front_default;
    }
    console.log(pokemonImage.src)
});

renderPokemon(searchPokemon);