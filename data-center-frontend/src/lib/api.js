// later we swap this import to real backend
import * as server from "../mock/server";

export const api = {
  getLiveMetrics: server.getLiveMetrics,
  getIncident: server.getIncident,
};
