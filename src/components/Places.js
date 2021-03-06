import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fetchBreweries } from '../actions';
import InfoWindow from './InfoWindow';

class Places extends PureComponent {
  constructor(props) {
    super(props);
    this.mapDivRef = React.createRef();
    this.containerRef = React.createRef();
    this.infoWindowContainerRef = React.createRef();
    this.state = {
      mapsLibLoaded: false,
      tilesLoaded: false,
      resultsFetched: false
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        this.setState({
          center: coords
        });
      },
      () => {
        alert('Please, enable geolocation access and reload this page');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
    const script = document.createElement('script');
    script.setAttribute(
      'src',
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyDchVfbHFmTd_XgIAb3E1GM5SWT1u7cvnU&libraries=places'
    );
    document.head.appendChild(script);
    script.addEventListener('load', () =>
      this.setState({
        mapsLibLoaded: true
      })
    );
  }

  searchBreweries = () => {
    const google = window.google;
    const { latitude, longitude } = this.state.center;
    const location = new google.maps.LatLng(latitude, longitude);
    const map = new google.maps.Map(this.mapDivRef.current, {
      center: location,
      zoom: 12,
      scrollwheel: false
    });
    map.addListener('click', () => {
      if (this.state.openedInfoWindow) {
        this.state.openedInfoWindow.close();
      }
    });
    map.addListener('tilesloaded', () => {
      this.setState({
        tilesLoaded: true
      });
    });
    const placesService = new google.maps.places.PlacesService(map);
    const radius = 10000;
    placesService.nearbySearch(
      {
        location,
        radius,
        keyword: 'cervejaria'
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.setState({
            resultsFetched: true
          });
          results.forEach(place => {
            const marker = new google.maps.Marker({
              map,
              position: place.geometry.location,
              title: place.name
            });
            marker.addListener('click', () => {
              this.setState(
                {
                  curPlace: place.name
                },
                () => {
                  const infoWindow = new google.maps.InfoWindow({
                    content: this.infoWindowContainerRef.current
                  });
                  //console.log(infoWindow);
                  infoWindow.open(map, marker);
                  if (this.state.openedInfoWindow) {
                    this.state.openedInfoWindow.close();
                  }
                  this.setState({
                    openedInfoWindow: infoWindow
                  });
                }
              );
            });
          });
          console.log(results);
        }
      }
    );
  };

  componentDidUpdate(prevProps, prevState) {
    const { center, mapsLibLoaded } = this.state;
    if (
      (center !== prevState.center ||
        mapsLibLoaded !== prevState.mapsLibLoaded) &&
      mapsLibLoaded &&
      center
    ) {
      this.searchBreweries();
    }
  }

  render() {
    const { tilesLoaded, resultsFetched, curPlace } = this.state;
    return (
      <div ref={this.containerRef}>
        <h2>Near Bear - Bear near you</h2>
        {!tilesLoaded && <span>Please wait, your beer map is loading...</span>}
        {tilesLoaded &&
          !resultsFetched && (
            <span>Please wait, fetching nearby breweries...</span>
          )}
        <div
          id="mapDiv"
          ref={this.mapDivRef}
          style={{ height: '550px', width: '550px' }}
        />
        <div style={{ display: 'hidden' }}>
          <div ref={this.infoWindowContainerRef}>
            <InfoWindow name={curPlace ? curPlace.name : ''} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    breweries: state.items
  }),
  {
    fetchBreweries
  }
)(Places);
