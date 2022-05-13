// @ts-nocheck
import React, { useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Marker, Popup, GeoJSON, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw';
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// ---------------------------------------------------------------------

type Props = {
  position: [number, number];
  onDraw: (draw: any) => void;
}

const Leaflet = ({ position, onDraw }: Props) => {
  const [mapLayers, setMapLayers] = useState([]);

  const onCreated = e => {
    const { layerType, layer } = e;

    if (layerType !== "circle") {
      const { _leaflet_id } = layer;
      const draw = { id: _leaflet_id, latlngs: layer.getLatLngs()[0] }
      setMapLayers(draw)
      onDraw(draw)

    } else {
      const { _leaflet_id } = layer;
      const draw = { id: _leaflet_id, latlngs: layer._latlng }
      setMapLayers(draw)
      onDraw(draw)
    }
  };

  return (
    <>
      <h2>Marque no mapa a área desajada</h2>
      <MapContainer
        center={position}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={onCreated}
            draw={{
              circlemarker: false,
              marker: false,
              polyline: false,
              // rectangle: false,
              // circle: false,
            }}
          />
        </FeatureGroup>

        <Marker position={position} draggable={true}>
          <Popup>
            Last recorded position:
            <br />
            {position[0].toFixed(3)}&#176;,&nbsp;
            {position[1].toFixed(3)}&#176;
            <br />
          </Popup>
        </Marker>
      </MapContainer>
      {/* <pre className="text-left">{JSON.stringify(mapLayers, 0, 2)}</pre> */}
    </>
  );
};

export default Leaflet;
