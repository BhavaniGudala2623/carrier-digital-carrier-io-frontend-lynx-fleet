import type { IControl, Map } from 'mapbox-gl';
import { createRoot } from 'react-dom/client';

import { MapStyle } from './MapStyle';

import { MapStyleType } from '@/types';

export class MapStyleControl implements IControl {
  private map?: Map;

  private container?: HTMLElement;

  onStyleChange(mapStyle: MapStyleType) {
    switch (mapStyle) {
      case 'streets':
        this.map?.setLayoutProperty('satellite', 'visibility', 'none');
        break;
      case 'satellite':
        this.map?.setLayoutProperty('satellite', 'visibility', 'visible');
        break;
      default:
        break;
    }
  }

  onAdd(map: Map): HTMLElement {
    this.map = map;

    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl';

    const root = createRoot(this.container);

    root.render(<MapStyle onChange={(mapStyle) => this.onStyleChange(mapStyle)} />);

    return this.container;
  }

  onRemove(): void {
    this.container?.parentNode?.removeChild(this.container);
    this.map = undefined;
  }
}
