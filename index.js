//getting stuff from html

const form = document.getElementById('form');
const input = document.getElementById('input');
const ipAddress = document.getElementById('ip');
const ipLocation = document.getElementById('location');
const ipTimezone = document.getElementById('timezone');
const ipIsp = document.getElementById('isp');

//api key

const apiKey = `at_IHD6KW0fHniF3ac59trc7DcMnYd3z`;

//mutable stuff

let address = ``;
let geoUrl = `https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${address}`;
let latitude = ``;
let longitude = ``;

//geo api get ip address and setting DOM on load

const setDOM = (ip, region, country, timezone, isp) => {
  ipAddress.innerHTML = ip;
  ipLocation.innerHTML = `${region}, ${country}`;
  ipTimezone.innerHTML = `UTC ${timezone}`;
  ipIsp.innerHTML = isp;
  return true;
};

let mymap = null;
const setMap = (lng, lat) => {
  if (mymap !== undefined && mymap !== null) {
    mymap.remove();
  }
  mymap = L.map('mapid');
  const myIcon = L.icon({
    iconUrl: '../images/icon-location.svg',
    iconSize: [25, 35],
    iconAnchor: [0, 0],
  });

  let tiles = L.tileLayer(
    `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    }
  );
  let mapView = mymap.setView(new L.LatLng(lat, lng), 9);
  tiles.addTo(mapView);
  L.marker([lat, lng], { icon: myIcon }).addTo(mapView);
};

const getIp = async (geoUrl) => {
  const resp = await fetch(geoUrl);
  console.log(await resp.statusText);
  const data = await resp.json();
  const {
    ip,
    location: { region, country, timezone, lng, lat },
    isp,
  } = await data;
  setDOM(await ip, await region, await country, await timezone, await isp);
  console.log(await data);
  latitude = await lat;
  longitude = await lng;
  setMap(longitude, latitude);
  return false;
};

const onLoad = () => {
  getIp(geoUrl);
};

// Placing the values into the dom on load

window.onload = onLoad(geoUrl);

// changing values on form submit

const changeInput = (e) => {
  e.preventDefault();
  address = input.value;
  geoUrl = `https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${address}`;
  getIp(geoUrl);
  // console.log(input.value);
};

form.addEventListener('submit', changeInput);
