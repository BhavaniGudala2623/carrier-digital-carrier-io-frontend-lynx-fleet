export function unpureMarkEmptyGroupsAsUnavailable(chartConfig) {
  Object.keys(chartConfig).forEach((key) => {
    const node = chartConfig[key];
    if (node && node.children && Object.keys(node.children).length) {
      Object.keys(node.children).forEach((child) => unpureMarkEmptyGroupsAsUnavailable(node.children[child]));
      // If node has children and none of those children is available, remove it
      let available = false;
      Object.keys(node.children).forEach((child) => {
        if (node.children[child].available) {
          available = true;
        }
      });
      node.available = available;
    }
  });
}
