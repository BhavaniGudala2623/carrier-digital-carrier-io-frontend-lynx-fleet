/**
 * src/components/looker/async/index.ts
 * Axios-based promises for API interaction
 */
export enum ResultFormat {
  PDF = 'pdf',
  PNG = 'png',
  JPG = 'jpg',
}

/**
 * extensions/marketplace_extension_api_explorer::api-explorer/4.0/methods/RenderTask/create_dashboard_render_task
 */
async function createDashboardRenderTask(
  dashboardId: string | number,
  resultFormat: ResultFormat,
  pdfPaperSize: string,
  pdfLandscape: boolean,
  longTables: boolean,
  body: Record<string, any>,
  width: string | number,
  height: string | number,
  lookerHost: string,
  bearerToken: string
): Promise<any> {
  const url = `https://${lookerHost}/api/4.0/render_tasks/dashboards/${dashboardId}/${resultFormat}?pdf_landscape=${pdfLandscape}&long_tables=${longTables}&pdf_paper_size=${pdfPaperSize}&width=${width}&height=${height}`;

  const result = await fetch(url, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (result?.ok) {
    const data = await result.json();

    return data;
  }

  return null;
}

/**
 * Fetch details about a render task to see if it's completed
 * @param taskId
 * @param lookerHost
 * @param bearerToken
 * statuses: enqueued_for_query | querying | enqueued_for_render | rendering | success | failure
 */
async function fetchRenderTask(taskId: string, lookerHost: string, bearerToken: string): Promise<any> {
  const url = `https://${lookerHost}/api/4.0/render_tasks/${taskId}?${new URLSearchParams({
    fields: ['id', 'dashboard_id', 'lookml_dashboard_id', 'status'].join(','),
  })}`;

  const result = await fetch(url, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });

  if (result?.ok) {
    const data = await result.json();

    return data;
  }

  return null;
}

/**
 * This will return a binary / blob stream
 * @param taskId
 * @param contentType
 * @param lookerHost
 * @param bearerToken
 */
async function fetchRenderTaskResults(
  taskId: string,
  contentType: string,
  lookerHost: string,
  bearerToken: string
): Promise<any> {
  const url = `https://${lookerHost}/api/4.0/render_tasks/${taskId}/results`;

  const result = await fetch(url, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': contentType,
    },
    method: 'GET',
  });

  if (result?.ok) {
    const blob = await result.blob();

    return blob;
  }

  return null;
}

export { createDashboardRenderTask, fetchRenderTask, fetchRenderTaskResults };
