import axios from 'axios'

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

// use your API key
const API_KEY = ''

function searchAddressHandler(event: Event) {
    event.preventDefault();
    const enteredAddress = addressInput.value;

    type GeocodingResponse = {
        results: { geometry: { location: { lat: number; lng: number } } }[]
        status: 'OK' | 'ZERO_RESULTS'
    };

    // send this to API
    axios.get<GeocodingResponse>(`https://api.longdo.com/map/services/address=${encodeURI(enteredAddress)}
    &noelevation=1&key=${API_KEY}`)
        .then(response => {
            if (response.data.status !== 'OK') {
                throw new Error('Could not retrieve address');
            }
            //const coordinates = response.data.result[0].geometry.location;
        })
        .catch(err => {
            alert(err.message);
            console.log(err);
        })
        ;
}

form.addEventListener('submit', searchAddressHandler)