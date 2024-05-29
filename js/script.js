const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonWeight = document.querySelector('.pokemon__weight');
const pokemonHeight = document.querySelector('.pokemon__height');
const pokemonType = document.querySelector('.pokemon__type');
const pokemonImage = document.querySelector('.pokemon__image');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 1;
let statsChart;

const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    
    if(APIResponse.status == 200){
        const data = await APIResponse.json();
        return data;
    }
}

const renderPokemon = async (pokemon) => {

    pokemonName.innerHTML = 'Loading...';
    pokemonNumber.innerHTML = '';

    const data = await fetchPokemon(pokemon);
    
    if (data) {
        pokemonImage.classList.remove('hidden');
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        pokemonWeight.innerHTML = `Peso: ${data.weight}`;
        pokemonHeight.innerHTML = `Altura: ${data.height}`;
        pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
        const types = data.types.map(typeInfo => typeInfo.type.name).join(', ');
        pokemonType.innerHTML = `Tipo: ${types}`; // Atualizar o elemento com os tipos

        input.value = '';
        searchPokemon = data.id;

        // Pegar os stats do Pokémon
        const stats = data.stats.map(stat => stat.base_stat);
        const labels = data.stats.map(stat => stat.stat.name);
        const totalStats = stats.reduce((a, b) => a + b, 0);

        // Atualizar ou criar o gráfico de radar
        if (statsChart) {
            statsChart.data.datasets[0].data = stats;
            statsChart.data.datasets[1].data = Array(stats.length).fill(totalStats / stats.length);
            statsChart.update();
        } else {
            const ctx = document.getElementById('statsChart').getContext('2d');
            statsChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Base Stats',
                        data: stats,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }, {
                        label: 'Total Stats Average',
                        data: Array(stats.length).fill(totalStats / stats.length),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 150 // Ajuste conforme necessário
                        }
                    }
                }
            });
        }
    } else {
        pokemonImage.classList.add('hidden');
        pokemonName.innerHTML = 'Not Found :c';
        pokemonNumber.innerHTML = '';
        pokemonWeight.innerHTML = '';
        pokemonHeight.innerHTML = '';
        pokemonType.innerHTML = '';

        if (statsChart) {
            statsChart.destroy();
            statsChart = null;
        }
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1){
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

renderPokemon(searchPokemon);
