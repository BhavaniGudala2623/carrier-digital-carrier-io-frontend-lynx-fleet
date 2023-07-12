export function flattenChartConfig(chartConfig) {
  const flatChartConfig = {};
  if (!chartConfig) {
    return {};
  }

  Object.keys(chartConfig).forEach((key) => {
    /*
    If the header node has a datapoint than it should be made visible or not based
    on the parent node chart config
     */
    if (chartConfig[key].rootNode) {
      flatChartConfig[key] = chartConfig[key];
    }
    Object.keys(chartConfig[key].children).forEach((flespikey) => {
      flatChartConfig[flespikey] = chartConfig[key].children[flespikey];
    });
  });

  return flatChartConfig;
}
