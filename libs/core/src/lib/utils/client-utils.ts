import {
  ServerConnectionOptions,
  SetRouteVariant,
} from '@caribou-crew/mezzo-interfaces';
import axios from 'axios';
import { Mezzo } from '../core';

export class ClientUtils {
  private mezzo: Mezzo;

  constructor(mezzo: Mezzo) {
    this.mezzo = mezzo;
  }

  public setMockVariant = async (
    payload: SetRouteVariant,
    options?: ServerConnectionOptions
  ) => {
    const baseUri = this.mezzo.getConnectionFromOptions(options);
    const url = `${baseUri}/routeVariants/set`;
    await axios.post(url, payload);
  };

  public setMockVariantForSession = async (
    sessionId: string,
    payload: SetRouteVariant,
    options?: ServerConnectionOptions
  ) => {
    const baseUri = this.mezzo.getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState/set/${sessionId}`;
    await axios.post(url, payload);
  };

  public updateMockVariantForSession = async (
    sessionId: string,
    payload: SetRouteVariant,
    options?: ServerConnectionOptions
  ) => {
    const baseUri = this.mezzo.getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState/update/${sessionId}`;
    await axios.post(url, payload);
  };

  public resetMockVariant = async (options?: ServerConnectionOptions) => {
    const baseUri = this.mezzo.getConnectionFromOptions(options);
    const url = `${baseUri}/routeVariants`;
    await axios.delete(url);
  };

  public resetMockVariantForSession = async (
    sessionId: string,
    options?: ServerConnectionOptions
  ) => {
    const baseUri = this.mezzo.getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState/${sessionId}`;
    await axios.delete(url);
  };

  public resetMockVariantForAllSessions = async (
    options?: ServerConnectionOptions
  ) => {
    const baseUri = this.mezzo.getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState`;
    await axios.delete(url);
  };
}
