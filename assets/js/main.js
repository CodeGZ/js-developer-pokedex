const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml;

        // Adicionar eventos de clique após carregar a lista de Pokémon
        addPokemonClickEvents();
    })
}

/* Adicionando função card modal*/
function addPokemonClickEvents() {
    const pokemonItems = document.querySelectorAll('.pokemon');

    const modal = document.querySelector('.modal');
    const modalContent = document.querySelector('.modal-content');
    const closeModalButton = document.querySelector('.close');

    pokemonItems.forEach((pokemonItem) => {
        pokemonItem.addEventListener('click', () => {
            // Obtém informações do Pokémon clicado
            const pokemonNumber = pokemonItem.querySelector('.number').textContent;
            const pokemonName = pokemonItem.querySelector('.name').textContent;
            const pokemonTypes = Array.from(pokemonItem.querySelectorAll('.type')).map(type => type.textContent).join(', ');
            const pokemonImage = pokemonItem.querySelector('img').src;

            // Cria elementos para exibir as informações no modal
            const modalNumber = document.createElement('span');
            modalNumber.textContent = pokemonNumber;
            
            const modalName = document.createElement('h2');
            modalName.textContent = pokemonName;
            
            const modalTypes = document.createElement('p');
            modalTypes.textContent = 'Types: ' + pokemonTypes;
            
            const modalImage = document.createElement('img');
            modalImage.src = pokemonImage;
            modalImage.alt = pokemonName;

            // Limpa o conteúdo anterior do modal
            modalContent.innerHTML = '';

            // Adiciona os elementos ao modal
            modalContent.appendChild(modalNumber);
            modalContent.appendChild(modalName);
            modalContent.appendChild(modalTypes);
            modalContent.appendChild(modalImage);

            // Abre o modal
            modal.style.display = 'flex';
        });
    });

    // Fecha o modal quando o botão de fechar é clicado
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

        // Fecha o modal quando o usuário clica fora do modal
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
}

/**----------------------------- */

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})