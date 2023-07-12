/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
// Radius mode
// Source:
// https://gist.github.com/chriswhong/694779bc1f1e5d926e47bab7205fa559
// custom mapbopx-gl-draw mode that modifies draw_line_string
// shows a center point, radius line, and circle polygon while drawing
// forces draw.create on creation of second vertex

import MapboxDraw from '@mapbox/mapbox-gl-draw';
import lineDistance from '@turf/length';
import circleToPolygon from '@turf/circle';

// @ts-ignore
const RadiusMode = { ...MapboxDraw.modes.draw_line_string };

function createVertex(parentId, coordinates, path, selected) {
  return {
    type: 'Feature',
    properties: {
      meta: 'vertex',
      parent: parentId,
      coord_path: path,
      active: selected ? 'true' : 'false',
    },
    geometry: {
      type: 'Point',
      coordinates,
    },
  };
}

const doubleClickZoom = {
  enable: (ctx) => {
    setTimeout(() => {
      // First check we've got a map and some context.
      if (
        !ctx.map ||
        !ctx.map.doubleClickZoom ||
        !ctx._ctx ||
        !ctx._ctx.store ||
        !ctx._ctx.store.getInitialConfigValue
      ) {
        return;
      }
      // Now check initial state wasn't false (we leave it disabled if so)
      if (!ctx._ctx.store.getInitialConfigValue('doubleClickZoom')) {
        return;
      }
      ctx.map.doubleClickZoom.enable();
    }, 0);
  },
};
RadiusMode.onSetup = function (opts) {
  // @ts-ignore
  const props = MapboxDraw.modes.draw_line_string.onSetup.call(this, opts);
  const circle = this.newFeature({
    type: 'Feature',
    properties: {
      meta: 'radius',
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[]],
    },
  });

  this.addFeature(circle);

  return {
    ...props,
    circle,
  };
};

RadiusMode.clickAnywhere = function (state, e) {
  // this ends the drawing after the user creates a second point, triggering this.onStop
  if (state.currentVertexPosition === 1) {
    state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);

    return this.changeMode('simple_select', { featureIds: [state.line.id] });
  }

  this.updateUIClasses({ mouse: 'add' });
  state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);

  if (state.direction === 'forward') {
    state.currentVertexPosition += 1;
    state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
  } else {
    state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
  }

  return null;
};

RadiusMode.onMouseMove = function (state, e) {
  // @ts-ignore
  MapboxDraw.modes.draw_line_string.onMouseMove.call(this, state, e);
  const geojson = state.line.toGeoJSON();
  const center = geojson.geometry.coordinates[0];
  const radiusInKm = lineDistance(geojson, { units: 'kilometers' });

  const circleFeature = circleToPolygon(center, radiusInKm);

  if (circleFeature.properties) {
    circleFeature.properties.meta = 'radius';
    circleFeature.properties.parent = state.line.id;
  }

  state.circle.setCoordinates(circleFeature.geometry.coordinates);
};

// creates the final geojson point feature with a radius property
// triggers draw.create
RadiusMode.onStop = function (state) {
  doubleClickZoom.enable(this);

  this.activateUIButton();

  // check to see if we've deleted this feature
  if (this.getFeature(state.line.id) === undefined) {
    return;
  }

  // remove last added coordinate
  state.line.removeCoordinate('0');

  if (state.line.isValid()) {
    this.deleteFeature([state.line.id], { silent: true });
    // RadiusMode creates a polygon which has the same first and last coordinate
    // But @mapbox/mapbox-gl-draw lib duplicate first coordinate when you call toGeoJSON()
    // This method call getCoordinates() from Polygon which has duplication logic
    // https://github.com/mapbox/mapbox-gl-draw/blob/02c5e798377db6f11e73566450dbaad6963f11f4/src/feature_types/polygon.js#L54
    state.circle.removeCoordinate('0');
    this.map.fire('draw.create', {
      features: [state.circle.toGeoJSON()],
    });
  } else {
    this.deleteFeature([state.line.id], { silent: true });
    this.changeMode('simple_select', { silent: true });
  }
};

RadiusMode.toDisplayFeatures = function (state, geojson, display) {
  const isActiveLine = geojson.properties.id === state.line.id;
  geojson.properties.active = isActiveLine ? 'true' : 'false';

  // check isActiveLine and at least one real coordinate
  if (!isActiveLine && geojson.geometry.coordinates[0][0]) {
    return display(geojson);
  }

  // Only render the line if it has at least one real coordinate
  if (geojson.geometry.coordinates.length < 2) {
    return null;
  }
  geojson.properties.meta = 'feature';

  // displays center vertex as a point feature
  display(
    createVertex(
      state.line.id,
      geojson.geometry.coordinates[
        state.direction === 'forward' ? geojson.geometry.coordinates.length - 2 : 1
      ],
      `${state.direction === 'forward' ? geojson.geometry.coordinates.length - 2 : 1}`,
      false
    )
  );

  // displays the line as it is drawn
  display(geojson);

  // create custom feature for the current pointer position
  const currentVertex = {
    type: 'Feature',
    properties: {
      meta: 'currentPosition',
      parent: state.line.id,
    },
    geometry: {
      type: 'Point',
      coordinates: geojson.geometry.coordinates[1],
    },
  };
  display(currentVertex);

  return null;
};

export { RadiusMode };
