import { LanguageType } from '@carrier-io/lynx-fleet-types';

export const setMapLabels = (map: mapboxgl.Map, language: LanguageType) => {
  const labelList = map.getStyle().layers.filter((layer) => /-label/.test(layer.id));

  // there is no official support for dutch language currently in Mapbox
  labelList.forEach((label) => {
    map.setLayoutProperty(label.id, 'text-field', [
      'coalesce',
      ['get', `name_${language === 'nl-NL' ? 'en' : language.split('-')[0]}`],
      ['get', 'name'],
    ]);
  });
};
